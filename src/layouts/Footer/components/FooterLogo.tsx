import Link from "next/link";
import Image from "next/image";

export function FooterLogo() {
  return (
    <Link href="/" className="flex items-center mb-6">
      <Image src="/logo.svg" alt="VisualVibe" width={250} height={48} className="h-10 w-auto" />
    </Link>
  );
}
