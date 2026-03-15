import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CallToAction() {
  return (
    <section id="get-started" className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            Ready to organize your next group trip in minutes?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Create a trip room, invite collaborators, build an itinerary, and
            track tasks and expenses with one shared source of truth.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/signup">
                <span>Create Free Account</span>
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline">
              <Link href="/login">
                <span>Go to Login</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
