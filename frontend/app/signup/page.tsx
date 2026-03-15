import { SignupForm } from "@/components/signup-form";
import { Suspense } from "react";

export default function signupPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Suspense
          fallback={
            <div className="text-center text-sm text-muted-foreground">
              Loading...
            </div>
          }
        >
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}
