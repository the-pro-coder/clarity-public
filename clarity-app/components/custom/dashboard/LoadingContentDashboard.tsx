import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

export default function LoadingContentDashboard() {
  return (
    <main className="fixed top-0 left-0 w-dvw h-dvh z-50 bg-background">
      <section className="flex w-full h-full items-center justify-center">
        <SpinnerEmpty />
      </section>
    </main>
  );
}
function SpinnerEmpty() {
  return (
    <Empty className="w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>Loading Profile</EmptyTitle>
        <EmptyDescription>Please wait.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
