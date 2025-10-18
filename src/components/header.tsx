import { ConnectButton } from "@mysten/dapp-kit";
import { Sui } from "./svgs";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b shadow-sm">
      <div className="container flex items-center justify-between py-3 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Sui className="h-10 w-10 sm:h-12 sm:w-12" />
          <h1 className="max-sm:hidden text-xl sm:text-2xl font-semibold tracking-tight text-[#0D3A42]">
            SOCSC UNIUYO
          </h1>
        </div>
        <ConnectButton />
      </div>
    </header>
  );
};

export default Header;
