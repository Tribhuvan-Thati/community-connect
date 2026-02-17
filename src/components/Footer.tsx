import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h3 className="font-bold text-lg">Community Portal</h3>
            <p className="text-sm opacity-70">
              Making community living better, one complaint at a time.
            </p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm opacity-70 flex items-center justify-center md:justify-end gap-1">
              Made with <Heart className="w-4 h-4 text-destructive fill-current" /> for our residents
            </p>
            <p className="text-xs opacity-50 mt-1">
              © {new Date().getFullYear()} Community Portal. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
