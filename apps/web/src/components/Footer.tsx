"use client";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800/50 py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-[#e63946]" />
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-[#e63946] animate-ping opacity-20" />
            </div>
            <span className="font-display text-2xl tracking-wider">
              REDLINE
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-8 text-sm text-neutral-500">
            <a
              href="https://github.com/orisabiyi/redline"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-300 uppercase tracking-wider text-xs"
            >
              GitHub
            </a>
            <a
              href="https://twitter.com/DevOrisabiyi"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-300 uppercase tracking-wider text-xs"
            >
              Twitter / X
            </a>
            <a
              href="https://commonchronicles.live"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-300 uppercase tracking-wider text-xs"
            >
              Common Chronicles
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-neutral-700 tracking-wider uppercase">
            © {new Date().getFullYear()} Redline. Free &amp; open source.
          </p>
          <p className="text-[11px] text-neutral-800 tracking-wider">
            Built with obsession in Lagos 🇳🇬
          </p>
        </div>
      </div>
    </footer>
  );
}