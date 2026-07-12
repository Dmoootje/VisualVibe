import Link from "next/link";
import "./globals.css";

/**
 * Root not-found for paths that never reach the [locale] segment (bot probes
 * like /Login.php, or any non-localized unknown URL). next-intl's [locale]
 * setup has no root layout, so without this file Next.js has nothing to render
 * for these paths and returns a 500 instead of a clean 404. This page brings
 * its own <html>/<body> and does not depend on any locale/intl context.
 */
export default function NotFound() {
  return (
    <html lang="nl">
      <body className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
        <main className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#ff7500]">
            404
          </p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Pagina niet gevonden</h1>
          <p className="mx-auto mt-4 max-w-md text-white/60">
            Deze pagina bestaat niet of is verplaatst.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-[#ff7500] px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            Terug naar de homepage
          </Link>
        </main>
      </body>
    </html>
  );
}
