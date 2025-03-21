import { MenuIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

export default function MobileMenuSheet({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <MenuIcon className="!w-6 !h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-0">{children}</SheetContent>
    </Sheet>
  );
}
