import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

function SpinnerEmpty() {
  return (
    <Empty className="w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>Generating Content</EmptyTitle>
        <EmptyDescription>
          Please wait while we personalize your learning experience.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export default function GeneratingContent() {
  return (
    <main className="fixed top-0 left-0 w-dvw h-dvh z-50 bg-background">
      <section className="flex w-full h-full items-center justify-center">
        <SpinnerEmpty />
      </section>
    </main>
  );
}
