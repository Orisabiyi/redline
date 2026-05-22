import { Category } from "../generated/prisma/enums";

export const cars = [
  // === JDM ===
  {
    name: "Nissan Skyline GT-R R34",
    slug: "nissan-skyline-gtr-r34",
    make: "Nissan",
    model: "Skyline GT-R",
    year: 1999,
    endYear: 2002,
    category: Category.JDM,
    engine: "RB26DETT 2.6L Twin-Turbo Inline-6",
    displacement: 2.6,
    horsepower: 280,
    torque: 293,
    transmission: "6-speed manual",
    drivetrain: "AWD (ATTESA E-TS)",
    weight: 1560,
    zeroToSixty: 4.9,
    topSpeed: 165,
    unitsProduced: 11344,
    tagline: "Godzilla's final form",
    story: "The R34 GT-R was the last of the pure Skyline GT-Rs before Nissan split the GT-R into its own model line. Built around the legendary RB26DETT engine and Nissan's ATTESA E-TS all-wheel-drive system, it dominated motorsport and became a cultural icon through Gran Turismo and Fast & Furious. The R34 was never officially sold in the US, making it forbidden fruit for American enthusiasts until the 25-year import rule began opening the door in 2024.",
    funFacts: [
      "The factory rated it at 280hp due to a gentleman's agreement, but real output was closer to 330hp",
      "The Multi-Function Display in the V-Spec was one of the first in-car digital dashboards",
      "Paul Walker's character drove an R34 in 2 Fast 2 Furious"
    ],
    tags: ["turbo", "awd", "inline-6", "rb26", "iconic"],
    variants: [
      { name: "V-Spec", horsepower: 280, notes: "Stiffer suspension, carbon fiber rear diffuser" },
      { name: "V-Spec II", horsepower: 280, notes: "Carbon fiber hood, gold BBS wheels" },
      { name: "V-Spec II Nür", horsepower: 280, notes: "N1 engine block, only 718 produced" },
      { name: "M-Spec", horsepower: 280, notes: "Comfort-focused, ripple control dampers" }
    ]
  },
  {
    name: "Toyota Supra MK4",
    slug: "toyota-supra-mk4",
    make: "Toyota",
    model: "Supra",
    year: 1993,
    endYear: 2002,
    category: Category.JDM,
    engine: "2JZ-GTE 3.0L Twin-Turbo Inline-6",
    displacement: 3.0,
    horsepower: 320,
    torque: 315,
    transmission: "6-speed manual",
    drivetrain: "RWD",
    weight: 1510,
    zeroToSixty: 4.6,
    topSpeed: 155,
    unitsProduced: 11239,
    tagline: "The 2JZ that broke the internet",
    story: "The A80 Supra is arguably the most iconic tuner car ever built. Its 2JZ-GTE engine is legendary for its near-indestructible iron block that can handle over 1000hp on stock internals. Toyota over-engineered every component, from the twin-turbo system to the Getrag 6-speed gearbox. When the Fast & Furious franchise featured an orange Supra outrunning a Ferrari, it cemented the car's status as a cultural monument.",
    funFacts: [
      "The 2JZ engine block can handle over 1000hp on stock internals",
      "Toyota lost money on every Supra sold due to over-engineering",
      "Clean examples now sell for over $150,000"
    ],
    tags: ["turbo", "rwd", "inline-6", "2jz", "iconic"],
    variants: [
      { name: "SZ (NA)", horsepower: 220, notes: "Naturally aspirated 2JZ-GE" },
      { name: "SZ-R", horsepower: 220, notes: "NA with sport suspension" },
      { name: "RZ", horsepower: 280, notes: "Twin-turbo, Japanese market" },
      { name: "Turbo (USDM)", horsepower: 320, notes: "US-spec twin-turbo" }
    ]
  },
  {
    name: "Mazda RX-7 FD",
    slug: "mazda-rx7-fd",
    make: "Mazda",
    model: "RX-7",
    year: 1992,
    endYear: 2002,
    category: Category.JDM,
    engine: "13B-REW 1.3L Twin-Turbo Rotary",
    displacement: 1.3,
    horsepower: 255,
    torque: 217,
    transmission: "5-speed manual",
    drivetrain: "RWD",
    weight: 1260,
    zeroToSixty: 5.0,
    topSpeed: 159,
    unitsProduced: 68589,
    tagline: "The rotary's finest hour",
    story: "The FD RX-7 is what happens when engineers refuse to follow convention. While every competitor used piston engines, Mazda doubled down on the rotary — a 1.3L twin-sequential-turbo 13B-REW that screamed to 8000rpm in a body that weighed just 1260kg. The design, penned under the direction of Yoichi Sato, is still considered one of the most beautiful shapes in automotive history. Its 50/50 weight distribution and low polar moment of inertia made it a handling benchmark.",
    funFacts: [
      "The sequential twin-turbo system was one of the first in a production car",
      "It has a near-perfect 50/50 front-rear weight distribution",
      "The rotary engine revs to 8000rpm from just 1.3 liters"
    ],
    tags: ["turbo", "rwd", "rotary", "lightweight", "iconic"],
    variants: [
      { name: "Type R", horsepower: 255, notes: "Stripped interior, lighter weight" },
      { name: "Type RZ", horsepower: 255, notes: "Bathurst homologation model" },
      { name: "Spirit R", horsepower: 280, notes: "Final edition, only 1500 made" }
    ]
  },
  {
    name: "Honda NSX NA1",
    slug: "honda-nsx-na1",
    make: "Honda",
    model: "NSX",
    year: 1990,
    endYear: 2005,
    category: Category.JDM,
    engine: "C30A 3.0L VTEC V6",
    displacement: 3.0,
    horsepower: 270,
    torque: 210,
    transmission: "5-speed manual",
    drivetrain: "RWD",
    weight: 1370,
    zeroToSixty: 5.2,
    topSpeed: 168,
    unitsProduced: 18000,
    tagline: "The everyday supercar",
    story: "Ayrton Senna helped develop the NSX's chassis at Suzuka, telling Honda engineers the car needed more rigidity. They listened. The result was the world's first production car with an all-aluminum monocoque body, a mid-mounted VTEC V6, and the daily usability of a Civic. It embarrassed Ferraris on track while being reliable enough to daily drive — a concept that didn't exist before the NSX proved it was possible.",
    funFacts: [
      "Ayrton Senna personally influenced the chassis tuning",
      "First production car with an all-aluminum monocoque body",
      "Gordon Murray drove one daily and it inspired the McLaren F1"
    ],
    tags: ["na", "rwd", "v6", "vtec", "mid-engine", "iconic"],
    variants: [
      { name: "Type R", horsepower: 280, notes: "120kg lighter, fixed headlights" },
      { name: "Type S", horsepower: 280, notes: "Fixed headlights, 6-speed" },
      { name: "Type S Zero", horsepower: 280, notes: "Further weight reduction" }
    ]
  },

  // === SUPERCARS ===
  {
    name: "Ferrari F40",
    slug: "ferrari-f40",
    make: "Ferrari",
    model: "F40",
    year: 1987,
    endYear: 1992,
    category: Category.SUPERCAR,
    engine: "Tipo F120A 2.9L Twin-Turbo V8",
    displacement: 2.9,
    horsepower: 478,
    torque: 425,
    transmission: "5-speed manual",
    drivetrain: "RWD",
    weight: 1100,
    zeroToSixty: 3.8,
    topSpeed: 201,
    unitsProduced: 1315,
    tagline: "Enzo's last masterpiece",
    story: "The F40 was the last Ferrari personally approved by Enzo Ferrari before his death in 1988. It was built as a no-compromise driver's car — kevlar and carbon fiber body panels so thin you could see the weave, no carpets, no door handles, cable-pull door releases. It was the first production car to break 200mph. Where modern supercars isolate you from the experience, the F40 throws you into it with both hands.",
    funFacts: [
      "First production car to exceed 200mph",
      "Body panels are so thin you can see the carbon fiber weave from inside",
      "Originally planned for 400 units, demand pushed it to 1315"
    ],
    tags: ["turbo", "rwd", "v8", "lightweight", "iconic"],
    variants: [
      { name: "LM", horsepower: 720, notes: "Race version, only 19 built" },
      { name: "GTE", horsepower: 578, notes: "GT racing homologation" },
      { name: "Competizione", horsepower: 520, notes: "Privateer race spec" }
    ]
  },
  {
    name: "McLaren F1",
    slug: "mclaren-f1",
    make: "McLaren",
    model: "F1",
    year: 1992,
    endYear: 1998,
    category: Category.SUPERCAR,
    engine: "BMW S70/2 6.1L V12",
    displacement: 6.1,
    horsepower: 627,
    torque: 480,
    transmission: "6-speed manual",
    drivetrain: "RWD",
    weight: 1138,
    zeroToSixty: 3.2,
    topSpeed: 240,
    unitsProduced: 106,
    tagline: "The greatest car ever built",
    story: "Gordon Murray set out to build the perfect driver's car with zero compromises. The result: a central driving position, a naturally aspirated BMW V12 lined with gold foil for heat reflection, a carbon fiber monocoque that was exotic technology in 1992, and a top speed of 240mph that stood as the world record for over a decade. Murray insisted on no turbocharging, no four-wheel drive, no driver aids. Just a driver, an engine, and the road.",
    funFacts: [
      "The engine bay is lined with gold foil for heat insulation",
      "Held the top speed record for over a decade at 240mph",
      "Only 64 road cars were ever built"
    ],
    tags: ["na", "rwd", "v12", "lightweight", "iconic"],
    variants: [
      { name: "GTR", horsepower: 600, notes: "Race version, Le Mans winner 1995" },
      { name: "LM", horsepower: 680, notes: "Road-legal race spec, 5 built" },
      { name: "GT", horsepower: 627, notes: "High downforce, luggage, detuned" }
    ]
  },
  {
    name: "Lamborghini Countach",
    slug: "lamborghini-countach",
    make: "Lamborghini",
    model: "Countach",
    year: 1974,
    endYear: 1990,
    category: Category.SUPERCAR,
    engine: "V12",
    displacement: 5.2,
    horsepower: 455,
    torque: 369,
    transmission: "5-speed manual",
    drivetrain: "RWD",
    weight: 1490,
    zeroToSixty: 4.8,
    topSpeed: 183,
    unitsProduced: 1999,
    tagline: "The bedroom wall legend",
    story: "The Countach defined what a supercar looked like for an entire generation. Marcello Gandini's scissor-door wedge shape was so radical when it debuted at Geneva in 1971 that it reset every assumption about car design. The name itself comes from a Piedmontese exclamation of disbelief — which is exactly what people said when they first saw it. For two decades, it was THE poster on every kid's bedroom wall.",
    funFacts: [
      "The name is a Piedmontese exclamation roughly meaning 'wow'",
      "Rear visibility was so bad that a periscope was offered as an option",
      "It was on more bedroom wall posters than any car in history"
    ],
    tags: ["na", "rwd", "v12", "iconic", "scissor-doors"],
    variants: [
      { name: "LP400", horsepower: 370, notes: "Original, cleanest design" },
      { name: "LP500 S", horsepower: 375, notes: "Added fender flares and wing" },
      { name: "5000 QV", horsepower: 455, notes: "Quattrovalvole, 4 valves per cyl" },
      { name: "25th Anniversary", horsepower: 455, notes: "Final version, Horacio Pagani redesign" }
    ]
  },

  // === CLASSICS ===
  {
    name: "Shelby GT500 (1967)",
    slug: "shelby-gt500-1967",
    make: "Shelby",
    model: "GT500",
    year: 1967,
    endYear: 1970,
    category: Category.CLASSIC,
    engine: "428 Police Interceptor V8",
    displacement: 7.0,
    horsepower: 355,
    torque: 420,
    transmission: "4-speed manual",
    drivetrain: "RWD",
    weight: 1540,
    zeroToSixty: 6.2,
    topSpeed: 130,
    unitsProduced: 2048,
    tagline: "Carroll Shelby's brute",
    story: "Carroll Shelby took Ford's Mustang and turned it into a weapon. The GT500 stuffed a massive 428 cubic-inch V8 into the Mustang's engine bay, paired it with a heavy-duty suspension, and wrapped it in racing stripes. It wasn't subtle and it wasn't meant to be. The Eleanor car from Gone in 60 Seconds made the GT500 a Hollywood icon, but it was already a legend on the street and the strip long before that.",
    funFacts: [
      "The 'Eleanor' from Gone in 60 Seconds is the most valuable Mustang ever",
      "Only 2048 units produced in 1967",
      "Carroll Shelby personally signed off on every car"
    ],
    tags: ["na", "rwd", "v8", "muscle", "iconic"],
    variants: [
      { name: "GT500 KR", horsepower: 400, notes: "King of the Road, 428 Cobra Jet" },
      { name: "Super Snake", horsepower: 520, notes: "One-off with 427 race engine" }
    ]
  },
  {
    name: "Jaguar E-Type",
    slug: "jaguar-e-type",
    make: "Jaguar",
    model: "E-Type",
    year: 1961,
    endYear: 1975,
    category: Category.CLASSIC,
    engine: "XK 3.8L Inline-6",
    displacement: 3.8,
    horsepower: 265,
    torque: 260,
    transmission: "4-speed manual",
    drivetrain: "RWD",
    weight: 1315,
    zeroToSixty: 6.9,
    topSpeed: 150,
    unitsProduced: 72520,
    tagline: "The most beautiful car ever made",
    story: "Enzo Ferrari called it the most beautiful car ever made. That alone would be enough, but the E-Type backed up its looks with genuine performance — independent rear suspension, disc brakes on all four corners, and a twin-cam inline-6 that made it faster than almost anything else on the road in 1961. It cost a fraction of its Italian rivals and outsold them all. The E-Type democratized the sports car.",
    funFacts: [
      "Enzo Ferrari himself called it the most beautiful car ever made",
      "It cost one-third the price of comparable Ferraris",
      "The Series 1 roadster is the most collectible version"
    ],
    tags: ["na", "rwd", "inline-6", "convertible", "iconic"],
    variants: [
      { name: "Series 1 3.8", horsepower: 265, notes: "Original and most desirable" },
      { name: "Series 1 4.2", horsepower: 265, notes: "Better torque, improved gearbox" },
      { name: "Series 2", horsepower: 246, notes: "US emissions compliance" },
      { name: "Series 3 V12", horsepower: 272, notes: "5.3L V12, wider body" }
    ]
  },
  {
    name: "Mercedes-Benz 300SL Gullwing",
    slug: "mercedes-300sl-gullwing",
    make: "Mercedes-Benz",
    model: "300SL",
    year: 1954,
    endYear: 1957,
    category: Category.CLASSIC,
    engine: "M198 3.0L Inline-6",
    displacement: 3.0,
    horsepower: 215,
    torque: 203,
    transmission: "4-speed manual",
    drivetrain: "RWD",
    weight: 1295,
    zeroToSixty: 7.0,
    topSpeed: 161,
    unitsProduced: 1400,
    tagline: "Wings of engineering",
    story: "The 300SL was the world's first production car with fuel injection and its tubular space frame chassis was so tall-sided that conventional doors wouldn't work — hence the iconic gullwing doors that hinged from the roof. Born directly from Mercedes' 1952 Le Mans-winning race car, it was the fastest production car of its era. The Gullwing is now one of the most valuable collector cars in the world, with pristine examples selling for over a million dollars.",
    funFacts: [
      "First production car with mechanical fuel injection",
      "The gullwing doors exist because the space frame made normal doors impossible",
      "Derived directly from the W194 Le Mans race car"
    ],
    tags: ["na", "rwd", "inline-6", "fuel-injection", "iconic"],
    variants: [
      { name: "Coupe (Gullwing)", horsepower: 215, notes: "1400 built, the icon" },
      { name: "Roadster", horsepower: 215, notes: "Open-top, conventional doors, 1858 built" },
      { name: "Alloy Body", horsepower: 215, notes: "29 aluminum-bodied coupes, ultra-rare" }
    ]
  }
];