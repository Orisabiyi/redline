import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#e63946]" />
          <span className="text-lg font-bold tracking-tight">Redline</span>
        </div>

        <div className="flex gap-8 text-sm text-neutral-500">
          <Link
            href="https://github.com/orisabiyi/redline"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </Link>
          <Link
            href="https://twitter.com/DevOrisabiyi"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Twitter
          </Link>
          <Link
            href="https://commonchronicles.live"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Common Chronicles
          </Link>
        </div >

        <p className="text-sm text-neutral-600">
          © {new Date().getFullYear()} Redline. Open source.
        </p>
      </div >
    </footer >
  );
}