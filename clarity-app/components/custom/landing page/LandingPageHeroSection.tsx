import Image from "next/image";
import { Button } from "../../ui/button";
import { Fragment } from "react/jsx-runtime";
import { LinkedButton } from "./LandingPageHeader";
export default function LandingPageHeroSection({
  hamburgerMenuOpen,
  hamburgerItems,
}: {
  hamburgerMenuOpen: boolean;
  hamburgerItems: LinkedButton[];
}) {
  return (
    <Fragment>
      {!hamburgerMenuOpen ? (
        <section className="flex">
          <div className="flex-1 h-[91dvh] max-w-1/2 max-sm:max-w-full max-sm:items-center flex flex-col pt-10">
            <h1 className="text-[clamp(35px,4.3vw,90px)] max-w-full text-nowrap flex flex-col pl-14 max-sm:pl-2">
              <span>Learning that adapts</span>
              <span className="text-[clamp(60px,7vw,150px)] lg:leading-20 lg:mb-4 font-bold max-sm:leading-10">
                to your mind
              </span>
            </h1>
            <p className="mt-10 text-[clamp(20px,1.75vw,60px)] pl-14 max-sm:pl-2 max-sm:text-2xl w-[90%] flex flex-col gap-6">
              <span>
                <span>
                  Clarity turns complex school topics into short, visual
                  explanations tailored to your attention style.
                </span>
                <b> Powered by AI designed for focus.</b>
              </span>
              <span>
                <span>
                  No overwhelm. No long paragraphs. Just simple, personalized
                  learning, built for students who think
                </span>
                <b> different.</b>
              </span>
            </p>
            <div className="w-[90%] pl-14 max-sm:pl-2 mt-10 flex gap-4">
              <Button
                className="text-lg cursor-pointer"
                size={"lg"}
                variant={"outline"}
              >
                Info Button
              </Button>
              <Button className="text-lg cursor-pointer" size={"lg"}>
                Get Started
              </Button>
            </div>
          </div>
          <div className="flex-1 h-[91dvh] max-sm:hidden flex justify-center items-center min-w-1/2">
            <Image
              className="w-full object-contain max-h-[90dvh] pr-[clamp(4rem, 5dvw, 1rem)]"
              width={2048}
              height={2048}
              src="/landing page/hero-section-image.png"
              alt="Girl holding a pencil whilst surrounded by academic stuff"
            />
          </div>
        </section>
      ) : (
        <section>
          <div className="flex flex-col h-[93dvh] mt-[7dvh]">
            {hamburgerItems.map(({ text, _link }: LinkedButton, key) => (
              <Button
                className="hover:cursor-pointer text-2xl flex-1 rounded-none"
                variant={"outline"}
                key={key}
              >
                <a href={_link} target="_blank">
                  {text}
                </a>
              </Button>
            ))}
          </div>
        </section>
      )}
    </Fragment>
  );
}
