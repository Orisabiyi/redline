import Exa from "exa-js";
import { neon } from "@neondatabase/serverless";
import Groq from "groq-sdk";
import FirecrawlApp from "@mendable/firecrawl-js";
import dotenv from "dotenv";

dotenv.config();

const exa = new Exa(process.env.EXA_API_KEY!);
const sql = neon(process.env.DATABASE_URL!);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });
const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY! });

const groqKeys = [
  process.env.GROQ_API_KEY_1!,
  process.env.GROQ_API_KEY_2!,
].filter(Boolean);

let currentKeyIndex = 0;

function getGroqClient(): Groq {
  const key = groqKeys[currentKeyIndex];
  return new Groq({ apiKey: key });
}

function rotateKey(): void {
  currentKeyIndex = (currentKeyIndex + 1) % groqKeys.length;
  console.log(`  🔄 Rotated to API key ${currentKeyIndex + 1}/${groqKeys.length}`);
}

// =============================================
// NHTSA
// =============================================
interface NHTSAModel {
  Make_Name: string;
  Model_Name: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry(url: string, options?: RequestInit, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url, {
      ...options,
      headers: {
        "User-Agent": "RevvBot/1.0 (car encyclopedia)",
        ...options?.headers,
      },
    });

    if (res.status === 429) {
      const retryAfter = parseInt(res.headers.get("retry-after") || "10");
      console.log(`  ⏳ Rate limited — waiting ${retryAfter}s...`);
      await sleep(retryAfter * 1000);
      continue;
    }

    return res;
  }

  throw new Error("Max retries reached");
}

async function getFirecrawlContent(carName: string): Promise<string> {
  try {
    console.log(`  🔥 Firecrawl: scraping additional sources for ${carName}`);

    const searchResults = await exa.search(
      `${carName} specifications horsepower engine`,
      {
        type: "auto",
        numResults: 1,
        includeDomains: ["supercars.net", "caranddriver.com", "automobile-catalog.com", "ultimatecarpage.com"],
      }
    );

    const url = searchResults.results[0]?.url;
    if (!url) return "";

    console.log(`  🔥 Scraping: ${url}`);
    const result = await firecrawl.scrapeUrl(url, {
      formats: ["markdown"],
    } as any);

    const markdown = (result as any).markdown || "";
    return markdown.substring(0, 3000);
  } catch {
    console.log(`  ⚠️  Firecrawl scraping failed`);
    return "";
  }
}

async function getModelsForMake(make: string): Promise<NHTSAModel[]> {
  const res = await fetch(
    `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${encodeURIComponent(make)}?format=json`,
  );
  const data = await res.json();
  return data.Results || [];
}

const performanceModels: Record<string, string[]> = {
  nissan: [
    "skyline",
    "gt-r",
    "silvia",
    "370z",
    "350z",
    "300zx",
    "240sx",
    "fairlady",
  ],
  toyota: ["supra", "ae86", "mr2", "celica", "86", "gr86", "2000gt"],
  mazda: ["rx-7", "rx-8", "mx-5", "miata", "cosmo", "rx-3"],
  honda: ["nsx", "s2000", "civic type r", "integra type r", "prelude", "beat"],
  subaru: ["impreza wrx", "brz", "wrx sti", "22b", "legacy gt"],
  mitsubishi: ["lancer evolution", "3000gt", "eclipse", "gto", "starion"],
  ferrari: [
    "f40",
    "enzo",
    "458",
    "488",
    "f50",
    "testarossa",
    "308",
    "250",
    "laferrari",
    "296",
  ],
  lamborghini: [
    "countach",
    "diablo",
    "murcielago",
    "aventador",
    "huracan",
    "miura",
    "gallardo",
  ],
  mclaren: ["f1", "p1", "720s", "600lt", "650s", "570s"],
  bugatti: ["veyron", "chiron", "eb110"],
  pagani: ["zonda", "huayra"],
  porsche: ["911", "918", "carrera gt", "959", "gt3", "gt2"],
  koenigsegg: ["agera", "jesko", "regera", "ccx"],
  shelby: ["gt500", "cobra", "gt350"],
  jaguar: ["e-type", "xj220", "xk120", "d-type"],
  "mercedes-benz": ["300sl", "190sl", "clk gtr"],
  chevrolet: ["corvette", "camaro", "chevelle"],
  ford: ["gt40", "gt", "mustang boss"],
  bmw: ["m3", "m5", "m1", "csl", "z8"],
  "aston martin": ["db5", "db4", "v8 vantage", "valkyrie"],
  "alfa romeo": ["33 stradale", "giulia sprint", "tipo 33"],
};

function isPerformanceModel(make: string, model: string): boolean {
  const makeLower = make.toLowerCase();
  const modelLower = model.toLowerCase();
  const keywords = performanceModels[makeLower];
  if (!keywords) return false;
  return keywords.some((k) => modelLower.includes(k));
}

function capitalize(str: string): string {
  return str
    .split(/[\s-]+/)
    .map((word) => {
      const lower = word.toLowerCase();
      if (lower === "bmw" || lower === "gt-r" || lower === "gtr")
        return word.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ")
    .replace("Mercedes Benz", "Mercedes-Benz")
    .replace("Aston Martin", "Aston Martin")
    .replace("Alfa Romeo", "Alfa Romeo");
}

function getCategory(make: string): string {
  const jdm = ["nissan", "toyota", "mazda", "honda", "subaru", "mitsubishi"];
  const supercar = [
    "ferrari",
    "lamborghini",
    "mclaren",
    "bugatti",
    "pagani",
    "porsche",
    "koenigsegg",
  ];
  const makeLower = make.toLowerCase();
  if (jdm.includes(makeLower)) return "JDM";
  if (supercar.includes(makeLower)) return "SUPERCAR";
  return "CLASSIC";
}

// =============================================
// WIKIPEDIA — get raw content + image
// =============================================
async function getWikipediaContent(
  carName: string,
): Promise<{ text: string; imageUrl: string | null }> {
  try {
    // Step 1: Search — try without "car" first for better results
    let title: string | null = null;

    for (const searchQuery of [
      carName,
      `${carName} car`,
      `${carName} automobile`,
    ]) {
      const searchRes = await fetchWithRetry(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchQuery)}&srlimit=3&format=json&origin=*`,
        { headers: { "User-Agent": "RevvBot/1.0 (car encyclopedia)" } },
      );

      if (!searchRes.ok) {
        console.log(`  ⚠️  Wikipedia search failed: ${searchRes.status}`);
        continue;
      }

      const searchData = await searchRes.json();
      const results = searchData?.query?.search || [];

      if (results.length > 0) {
        title = results[0].title;
        break;
      }
    }

    if (!title) {
      console.log(`  ⚠️  No Wikipedia page found for ${carName}`);
      return { text: "", imageUrl: null };
    }

    console.log(`  📖 Wikipedia page: "${title}"`);

    // Step 2: Get summary via REST API (more reliable)
    let imageUrl: string | null = null;
    let summaryText = "";

    const summaryRes = await fetchWithRetry(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
      { headers: { "User-Agent": "RevvBot/1.0 (car encyclopedia)" } },
    );

    if (summaryRes.ok) {
      const summaryData = await summaryRes.json();
      summaryText = summaryData.extract || "";
      imageUrl =
        summaryData.originalimage?.source ||
        summaryData.thumbnail?.source ||
        null;
    }

    // Step 3: Get full content via extracts API
    let fullText = "";
    const contentRes = await fetchWithRetry(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=extracts&explaintext=true&exlimit=1&format=json&origin=*`,
      { headers: { "User-Agent": "RevvBot/1.0 (car encyclopedia)" } },
    );

    if (contentRes.ok) {
      const contentData = await contentRes.json();
      const pages = contentData?.query?.pages || {};
      const pageId = Object.keys(pages)[0];
      if (pageId && pageId !== "-1") {
        fullText = pages[pageId]?.extract || "";
      }
    }

    // Step 4: Fallback — use the mobile content endpoint if extracts failed
    if (!fullText && summaryText) {
      console.log(
        `  📖 Using summary as fallback (${summaryText.length} chars)`,
      );
      fullText = summaryText;
    }

    if (!fullText) {
      // Step 5: Last resort — mobile sections API
      try {
        const mobileRes = await fetchWithRetry(
          `https://en.wikipedia.org/api/rest_v1/page/mobile-sections-lead/${encodeURIComponent(title)}`,
          { headers: { "User-Agent": "RevvBot/1.0 (car encyclopedia)" } },
        );
        if (mobileRes.ok) {
          const mobileData = await mobileRes.json();
          fullText = (mobileData.sections || [])
            .map((s: any) => s.text || "")
            .join("\n")
            .replace(/<[^>]+>/g, "")
            .substring(0, 5000);
        }
      } catch { }
    }

    return { text: fullText.substring(0, 5000), imageUrl };
  } catch (err) {
    console.log(`  ⚠️  Wikipedia fetch error:`, err);
    return { text: "", imageUrl: null };
  }
}

// =============================================
// EXA — get additional enthusiast context
// =============================================
async function getExaContext(carName: string): Promise<string> {
  try {
    console.log(`  🔍 Exa: searching for ${carName}`);
    const results = await exa.searchAndContents(
      `${carName} history specifications review why iconic`,
      {
        type: "auto",
        numResults: 2,
        text: { maxCharacters: 2000 },
        excludeDomains: ["reddit.com", "quora.com", "facebook.com"],
      },
    );

    return results.results
      .map((r: any) => r.text || "")
      .filter((t: string) => t.length > 50)
      .join("\n\n")
      .substring(0, 3000);
  } catch {
    return "";
  }
}

// =============================================
// GROQ — process into complete car object
// =============================================
interface CarData {
  engine: string;
  displacement: number | null;
  horsepower: number | null;
  torque: number | null;
  transmission: string;
  drivetrain: string;
  weight: number | null;
  zeroToSixty: number | null;
  topSpeed: number | null;
  unitsProduced: number | null;
  yearStart: number | null;
  yearEnd: number | null;
  tagline: string;
  story: string;
  funFacts: string[];
  tags: string[];
  variants: { name: string; horsepower: number | null; notes: string }[];
}

async function processWithGroq(
  carName: string,
  category: string,
  wikiText: string,
  exaText: string
): Promise<CarData | null> {
  console.log(`  🤖 Groq: processing ${carName}`);

  // Trim inputs to conserve tokens
  const trimmedWiki = wikiText.substring(0, 3000);
  const trimmedExa = exaText.substring(0, 1500);

  const prompt = `You are a car encyclopedia editor. Extract and generate a complete entry for the ${carName}.

CATEGORY: ${category}

WIKIPEDIA:
${trimmedWiki}

ADDITIONAL:
${trimmedExa}

Return ONLY valid JSON, no backticks, no explanation:
{"engine":"Clean name e.g. RB26DETT 2.6L Twin-Turbo Inline-6","displacement":2.6,"horsepower":280,"torque":293,"transmission":"6-speed manual","drivetrain":"AWD","weight":1560,"zeroToSixty":4.9,"topSpeed":165,"unitsProduced":11344,"yearStart":1999,"yearEnd":2002,"tagline":"Punchy 3-6 word tagline","story":"2-3 engaging editorial paragraphs. Write like a passionate car journalist, not Wikipedia.","funFacts":["Fact 1","Fact 2","Fact 3"],"tags":["turbo","awd","inline-6","iconic"],"variants":[{"name":"V-Spec","horsepower":280,"notes":"Description"}]}

Rules: Numbers or null. Torque lb-ft. Weight kg. Speed mph. No wiki markup. 5-8 tags. Editorial story not dry summary.`;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: attempt === 0 ? 0.7 : 0.3,
        max_tokens: 2000,
      });

      let text = response.choices[0]?.message?.content || "";
      text = text
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/gi, "")
        .trim();

      // Fix control characters
      text = text.replace(/[\x00-\x1F\x7F]/g, (char) => {
        if (char === "\n") return "\\n";
        if (char === "\r") return "\\r";
        if (char === "\t") return "\\t";
        return "";
      });
      text = text.replace(/\\\\n/g, "\\n");

      const parsed = JSON.parse(text) as CarData;
      if (!parsed.engine || !parsed.story) return null;
      return parsed;

    } catch (err: any) {
      if (err?.status === 429) {
        console.log(`  ⏳ Key ${currentKeyIndex + 1} rate limited`);
        rotateKey();
        await sleep(3000);
        continue;
      }

      if (err instanceof SyntaxError && attempt < 2) {
        console.log(`  🔄 JSON parse failed — retrying (attempt ${attempt + 2}/3)`);
        await sleep(2000);
        continue;
      }

      console.log(`  ⚠️  Groq failed:`, err?.message || err);
      return null;
    }
  }

  return null;
}

// =============================================
// SAVE TO DATABASE
// =============================================
async function saveCar(
  make: string,
  model: string,
  category: string,
  data: CarData,
  imageUrl: string | null,
): Promise<boolean> {
  const makeName = capitalize(make);
  const name = `${makeName} ${model}`;
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+$/, "")
    .replace(/^-+/, "");
  const id = `crawl_${slug}_${Date.now()}`;

  // Skip if exists
  const existing = await sql`SELECT id FROM "Car" WHERE slug = ${slug}`;
  if (existing.length > 0) {
    console.log(`  ⏭️  Already exists: ${name}`);
    return false;
  }

  // Insert car
  await sql`
    INSERT INTO "Car" (
      id, name, slug, make, model, year, "endYear", category,
      engine, displacement, horsepower, torque, transmission, drivetrain,
      weight, "zeroToSixty", "topSpeed", "unitsProduced",
      tagline, story, "funFacts", tags, "createdAt", "updatedAt"
    ) VALUES (
      ${id}, ${name}, ${slug}, ${makeName}, ${model},
      ${data.yearStart || 0}, ${data.yearEnd || null}, ${category},
      ${data.engine}, ${data.displacement || null},
      ${data.horsepower || null}, ${data.torque || null},
      ${data.transmission || null}, ${data.drivetrain || null},
      ${data.weight || null}, ${data.zeroToSixty || null},
      ${data.topSpeed || null}, ${data.unitsProduced || null},
      ${data.tagline || null}, ${data.story},
      ${data.funFacts || []}, ${data.tags || []},
      NOW(), NOW()
    )
  `;

  // Insert image
  if (imageUrl) {
    await sql`
      INSERT INTO "Image" (id, "carId", url, source, attribution, "isPrimary")
      VALUES (${`img_${slug}_${Date.now()}`}, ${id}, ${imageUrl}, 'wikipedia', 'Wikimedia Commons', true)
    `;
  }

  // Insert variants
  if (data.variants && data.variants.length > 0) {
    for (let i = 0; i < data.variants.length; i++) {
      const v = data.variants[i];
      const variantId = `var_${slug}_${i}_${Date.now()}`;
      await sql`
        INSERT INTO "Variant" (id, "carId", name, horsepower, notes)
        VALUES (${variantId}, ${id}, ${v.name}, ${v.horsepower || null}, ${v.notes || null})
      `;
    }
    console.log(`  📋 ${data.variants.length} variants saved`);
  }

  console.log(
    `  ✅ ${name} | ${data.horsepower || "?"}hp | ${data.yearStart}-${data.yearEnd || "?"} | "${data.tagline}"`,
  );
  console.log(
    `     ${data.funFacts.length} facts, ${data.tags.length} tags, ${data.variants.length} variants`,
  );
  return true;
}

// =============================================
// MAIN PIPELINE
// =============================================
async function main() {
  console.log("🏎️  Revv Automated Crawl Pipeline");
  console.log("  NHTSA → Wikipedia → Exa → Groq → Database\n");

  const makes = Object.keys(performanceModels);
  let totalSaved = 0;
  let totalSkipped = 0;
  let totalFailed = 0;
  let tokensUsed = 0;
  const TOKEN_BUDGET = 270000;
  let budgetExhausted = false;

  for (const make of makes) {
    if (budgetExhausted) break;

    console.log(`\n📂 ${make.toUpperCase()}`);
    console.log("─".repeat(50));

    const allModels = await getModelsForMake(make);
    console.log(`  📦 NHTSA: ${allModels.length} total models`);

    const notable = allModels.filter((m) =>
      isPerformanceModel(m.Make_Name, m.Model_Name),
    );
    const uniqueModels = [...new Set(notable.map((m) => m.Model_Name))];
    console.log(`  🎯 ${uniqueModels.length} performance models\n`);

    for (const model of uniqueModels) {
      if (tokensUsed > TOKEN_BUDGET) {
        budgetExhausted = true;
        console.log(`\n  ⚠️  Token budget reached (${tokensUsed}/${TOKEN_BUDGET}).`);
        console.log(`  💡 Run again tomorrow to continue with remaining cars.\n`);
        break;
      }

      const carName = `${capitalize(make)} ${model}`;
      const category = getCategory(make);
      console.log(`  🚗 ${carName}`);

      try {
        // Check if already in DB
        const slug = carName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/-+$/, "")
          .replace(/^-+/, "");
        const existing = await sql`SELECT id FROM "Car" WHERE slug = ${slug}`;
        if (existing.length > 0) {
          console.log(`  ⏭️  Already exists\n`);
          continue;
        }

        // Step 1: Wikipedia
        const { text: wikiText, imageUrl } = await getWikipediaContent(carName);
        console.log(
          `  📖 Wikipedia: ${wikiText.length} chars | image: ${imageUrl ? "✓" : "✗"}`,
        );

        if (wikiText.length < 100) {
          console.log(`  ⏭️  Skipping — not enough Wikipedia content\n`);
          totalSkipped++;
          continue;
        }

        // Step 2: Exa context
        const exaText = await getExaContext(carName);
        console.log(`  🔍 Exa: ${exaText.length} chars`);

        // Step 2.5: Firecrawl if Wikipedia is thin
        let firecrawlText = "";
        if (wikiText.length < 1500) {
          firecrawlText = await getFirecrawlContent(carName);
          console.log(`  🔥 Firecrawl: ${firecrawlText.length} chars`);
        }

        // Step 3: Groq processing
        const allContext = `${exaText}\n\n${firecrawlText}`.trim();
        const carData = await processWithGroq(carName, category, wikiText, allContext);
        tokensUsed += 5000;

        if (!carData) {
          console.log(`  ❌ Groq failed — skipping\n`);
          totalFailed++;
          continue;
        }

        // Step 4: Save
        const saved = await saveCar(make, model, category, carData, imageUrl);
        if (saved) totalSaved++;
        console.log();

        // 5s between cars
        await sleep(5000);
      } catch (err) {
        console.error(`  ❌ Failed: ${carName}`, err);
        totalFailed++;
        console.log();
      }
    }

    // 5s between makes
    await sleep(5000);
  }

  console.log(`\n${"═".repeat(50)}`);
  console.log(`🏁 Crawl complete!`);
  console.log(`  ✅ Saved: ${totalSaved}`);
  console.log(`  ⏭️  Skipped: ${totalSkipped}`);
  console.log(`  ❌ Failed: ${totalFailed}`);
  console.log(`  🪙 Tokens used: ~${tokensUsed}`);
  if (budgetExhausted) {
    console.log(`  💡 Budget reached — run again tomorrow for remaining cars.`);
  }
  const count = await sql`SELECT COUNT(*) as total FROM "Car"`;
  console.log(`  📊 Total cars in DB: ${count[0].total}`);
}

main().catch(console.error);
