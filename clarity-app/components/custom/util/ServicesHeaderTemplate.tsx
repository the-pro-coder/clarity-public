import Image from "next/image";
export default function ServicesHeaderTemplate() {
  return (
    <section className="flex flex-col items-center pt-4 gap-2">
      <Image
        src="/app logos/square/2048x2048/Clarity Square Deployment 2048x2048.png"
        alt="Clarity Logo"
        width={100}
        height={100}
        className="rounded-md"
      />
      <h2 className="font-bold text-3xl">Clarity</h2>
      <p className="text-secondary">
        Learning that adapts <span className="font-bold">to your mind</span>
      </p>
    </section>
  );
}
