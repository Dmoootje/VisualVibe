import type { ReactNode } from "react";

/**
 * Pass-through root layout. The real <html>/<body> and providers live in
 * app/[locale]/layout.tsx; this exists only so app/not-found.tsx (rendered for
 * non-localized paths such as bot probes to /Login.php) has a root layout,
 * which Next.js requires - especially under the `output: "standalone"` build
 * that Firebase App Hosting applies. It renders no markup of its own.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
