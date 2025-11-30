import Image from "next/image";
type AuthService = "Google" | "Microsoft" | "Discord";

function getSignInFunction(service: string) {
  switch (service) {
    case "google":
      return () => {};
    default:
      return () => {
        console.log("Unknown OAuth Provider");
      };
  }
}
export default function AuthServiceIcon({ service }: { service: AuthService }) {
  const signInFunction = getSignInFunction(service.toLowerCase());
  return (
    <button
      className="rounded-full shadow-md h-12 w-12 hover:brightness-75 active:brightness-50 transition-all"
      onClick={signInFunction}
    >
      <Image
        src={`/auth/auth services/${service.toLowerCase()} auth icon.png`}
        alt={`${service} Auth Icon`}
        className="rounded-full"
        width={100}
        height={100}
      />
    </button>
  );
}
