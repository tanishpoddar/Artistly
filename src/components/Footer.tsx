import { Music2, Twitter, Instagram, Dribbble } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col items-center justify-center gap-6 py-10 md:h-24 md:py-0">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <Music2 className="h-6 w-6 text-primary" />
            <p className="text-sm leading-loose text-muted-foreground">
              © {new Date().getFullYear()} Artistly. All rights reserved.
            </p>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Made with <span className="text-red-500">❤️</span> by Tanish
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="#" aria-label="Twitter">
            <Twitter className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
          </Link>
          <Link href="#" aria-label="Instagram">
            <Instagram className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
          </Link>
          <Link href="#" aria-label="Dribbble">
            <Dribbble className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
