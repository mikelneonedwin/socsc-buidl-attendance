import { useCurrentAccount } from "@mysten/dapp-kit";
import { Check } from "lucide-react";
import { Button } from "./ui/button";

const Hero = () => {
  const account = useCurrentAccount();

  return (
    <section className="bg-[#DBEDF6] py-16 sm:py-20 md:py-24 shadow-md">
      <div className="container mx-auto max-w-5xl px-6 text-center space-y-10">
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black/80">
            Set Up Your Account
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-black/80 max-w-2xl mx-auto leading-relaxed">
            Complete your profile and connect your wallet address to get the
            best experience during BUIDL sessions.
          </p>
        </div>

        {account && (
          <div className="flex justify-center">
            <Button className="flex items-center gap-2 sm:gap-3 border border-[#EDF8FC]/20 rounded-full h-12 sm:h-14 px-6 sm:px-8 transition-transform hover:scale-105">
              <span className="text-base sm:text-lg font-medium text-white">
                Wallet Connected
              </span>
              <span className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-accent flex items-center justify-center">
                <Check
                  className="h-3 w-3 sm:h-4 sm:w-4 text-primary"
                  strokeWidth={2.5}
                />
              </span>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
