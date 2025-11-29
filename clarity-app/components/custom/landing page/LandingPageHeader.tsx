"use client";
import Link from "next/link";
import { Button } from "../../ui/button";
import Image from "next/image";
import { Fragment, useState } from "react";
import { MenuIcon } from "lucide-react";
import { XIcon } from "lucide-react";
import { useTheme } from "next-themes";
import LandingPageSectionJoint, {
  HamburgerMenu,
} from "./LandingPageSectionJoint";
// Type for button that also contains a link
export type LinkedButton = {
  text: string;
  _link: string;
};

// Define a list of LinkedButtons (the left side buttons) to map them into shadcn Button elements
const leftButtonList: LinkedButton[] = [
  { text: "Element 1", _link: "" },
  { text: "Element 2", _link: "" },
  { text: "Element 3", _link: "" },
  { text: "Element 4", _link: "" },
  { text: "Element 5", _link: "" },
];

// Define a list of LinkedButtons (the right side buttons) to map them into shadcn Button elements

const rightButtonList: LinkedButton[] = [
  { text: "Button 1", _link: "https://google.com" },
  { text: "Button 2", _link: "" },
];

// Define a CTA message to be included in the CTA button
const ctaText = "CTA";

export default function LandingPageHeader() {
  const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState(false);
  const { setTheme } = useTheme();
  setTheme("system");
  return (
    <Fragment>
      {!hamburgerMenuOpen ? (
        <Fragment>
          <header className="sticky bg-header backdrop-blur-xs top-0 border-b w-full m-auto h-20 flex max-sm:px-3 gap-4 justify-between px-3 py-2">
            <div className="flex items-center gap-4 flex-2">
              <Image
                className="hover:cursor-pointer"
                src="/app logos/full logo light.png"
                alt="Clarity Logo"
                width={140}
                height={40}
              />
              <div className="max-md:hidden">
                {leftButtonList.map(({ text, _link }: LinkedButton, key) => (
                  <Button
                    className="hover:cursor-pointer"
                    variant={"ghost"}
                    key={key}
                  >
                    <Link href={`/${_link}`} target="_blank">
                      {text}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 max-sm:gap-2 flex-1 justify-end">
              <Button
                onClick={() => {
                  setHamburgerMenuOpen((prev) => !prev);
                }}
                className="hover:cursor-pointer hidden max-md:block"
              >
                {<MenuIcon />}
              </Button>

              {rightButtonList.map(({ text, _link }: LinkedButton, key) => (
                <Button
                  className="hover:cursor-pointer max-sm:p-1.5"
                  variant={"outline"}
                  key={key}
                >
                  <Link href={`/${_link}`} target="_blank">
                    {text}
                  </Link>
                </Button>
              ))}
              <Button className="hover:cursor-pointer max-sm:p-2.5">
                {ctaText}
              </Button>
            </div>
          </header>
          <LandingPageSectionJoint />
        </Fragment>
      ) : (
        <Fragment>
          <header>
            <div className="absolute right-3 top-2">
              <Button
                className="rounded-full w-10 h-10 cursor-pointer"
                variant={"ghost"}
                size={"icon-lg"}
                onClick={() => {
                  setHamburgerMenuOpen(false);
                }}
              >
                {<XIcon />}
              </Button>
            </div>
          </header>
          <HamburgerMenu hamburgerItems={leftButtonList} />
        </Fragment>
      )}
    </Fragment>
  );
}
