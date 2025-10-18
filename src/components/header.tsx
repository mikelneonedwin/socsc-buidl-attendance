import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { Link, useLocation } from "react-router";
import { Menu } from "lucide-react";
import { Sui } from "./svgs";

const navLinks = [
  { name: "Home", to: "/" },
  { name: "History", to: "/history" },
];

const Header = () => {
  const account = useCurrentAccount();
  const location = useLocation();
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b shadow-sm">
      <div className="container flex items-center justify-between py-3 px-4 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Sui className="h-10 w-10 sm:h-12 sm:w-12" />
          <h1 className="max-sm:hidden text-xl sm:text-2xl font-semibold tracking-tight text-primary">
            SOCSC UNIUYO
          </h1>
        </div>

        {/* Desktop Nav + Connect */}
        <div className="flex items-center gap-4">
          {account && (
            <nav className="hidden sm:flex items-center gap-2">
              {navLinks.map((link) => (
                <Button
                  key={link.to}
                  asChild
                  variant={
                    location.pathname === link.to ? "default" : "outline"
                  }
                  className="text-sm sm:text-base transition-all"
                >
                  <Link to={link.to}>{link.name}</Link>
                </Button>
              ))}
            </nav>
          )}
          <ConnectButton />

          {/* Mobile Menu */}
          {account && (
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="sm:hidden rounded-full"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex flex-col">
                <SheetHeader>
                  <SheetTitle className="text-primary font-semibold">
                    Navigation
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-4 mx-3 flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Button
                      key={link.to}
                      asChild
                      variant={
                        location.pathname === link.to ? "default" : "outline"
                      }
                      className="w-full justify-start text-base"
                    >
                      <Link to={link.to}>{link.name}</Link>
                    </Button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
