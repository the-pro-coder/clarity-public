import Image from "next/image";
import { toast } from "sonner";
import signInWithExternalProvider, {
  ExternalProviders,
} from "@/app/authenticate/action";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function AuthServiceIcon({
  service,
  loginSelected,
  router,
}: {
  service: ExternalProviders;
  loginSelected: boolean;
  router: AppRouterInstance;
}) {
  async function SignInWithOAuth(provider: ExternalProviders) {
    const { error, url } = await signInWithExternalProvider(provider);
    if (!error && url) {
      router.push(url);
    } else {
      console.error(error);
      toast.error(`Error at ${loginSelected ? "log in" : "sign up"}`, {
        description: `There was an error while trying to ${
          loginSelected ? "log in" : "sign up"
        } with ${provider}, please try again later.`,
      });
    }
  }

  return (
    <button
      className="rounded-full shadow-md h-12 w-12 hover:brightness-75 active:brightness-50 transition-all"
      onClick={() => {
        SignInWithOAuth(service);
      }}
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
