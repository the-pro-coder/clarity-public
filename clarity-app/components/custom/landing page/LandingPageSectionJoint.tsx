import { LinkedButton } from "./LandingPageHeader";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LandingPageHeroSection from "./LandingPageHeroSection";
import LandingPageCoreFeaturesSection from "./LandingPageCoreFeaturesSection";
import { Fragment } from "react/jsx-runtime";

export default function LandingPageSectionJoint() {
  return (
    <Fragment>
      <LandingPageHeroSection />
      <LandingPageCoreFeaturesSection />
    </Fragment>
  );
}

export function HamburgerMenu({
  hamburgerItems,
}: {
  hamburgerItems: LinkedButton[];
}) {
  return (
    <section>
      <div className="flex flex-col h-[93dvh] mt-[7dvh]">
        {hamburgerItems.map(({ text, _link }: LinkedButton, key) => (
          <Button
            className="hover:cursor-pointer text-2xl flex-1 rounded-none"
            variant={"outline"}
            key={key}
          >
            <Link href={`/${_link}`} target="_blank">
              {text}
            </Link>
          </Button>
        ))}
      </div>
    </section>
  );
}
