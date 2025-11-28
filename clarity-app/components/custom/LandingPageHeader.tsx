import { Button } from "../ui/button";
import Image from "next/image";
export default function LandingPageHeader() {
  return (
    <header className="border-b m-auto flex justify-between px-10 py-2">
      <div className="flex items-center gap-4">
        <Image
          className="hover:cursor-pointer"
          src="/Clarity Logos/Clarity Full Logo Light.png"
          alt="Clarity Logo"
          width={180}
          height={40}
        />
        <div>
          <Button className="hover:cursor-pointer" variant={"link"}>
            Element 1
          </Button>
          <Button className="hover:cursor-pointer" variant={"link"}>
            Element 2
          </Button>
          <Button className="hover:cursor-pointer" variant={"link"}>
            Element 3
          </Button>
          <Button className="hover:cursor-pointer" variant={"link"}>
            Element 4
          </Button>
          <Button className="hover:cursor-pointer" variant={"link"}>
            Element 5
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button className="hover:cursor-pointer" variant={"outline"}>
          Button 1
        </Button>
        <Button className="hover:cursor-pointer" variant={"outline"}>
          Button 2
        </Button>
        <Button className="hover:cursor-pointer">CTA</Button>
      </div>
    </header>
  );
}
