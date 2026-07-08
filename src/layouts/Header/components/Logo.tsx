import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center relative z-10 group">
      <Image
        src="/logo.svg"
        alt="VisualVibe"
        width={250}
        height={48}
        priority
        className="h-8 sm:h-10 w-auto transition-transform group-hover:scale-105"
      />
    </Link>
  );
}
