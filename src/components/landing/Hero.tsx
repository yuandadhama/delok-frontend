import Link from "next/link";
import { ROUTES } from "@/src/constants/routes";
import { DelokLogPreview } from "./DelokLogPreview";

export function Hero() {
  return (
    <section className="relative w-full pt-24">
      {/* Log panel — behind the text, pulled up */}
      <div className="relative w-full -mt-8">
        <DelokLogPreview />

        {/* Side gradients to hide edges */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-y-0 left-0 w-16 bg-linear-to-r from-background to-transparent" />
          <div className="absolute inset-y-0 right-0 w-16 bg-linear-to-l from-background to-transparent" />
        </div>
      </div>

      {/* Hero text — overlaps on top of the log panel */}
      <div className="absolute inset-x-0 top-0 z-10">
        {/* Dark gradient backdrop behind the text */}
        <div className="absolute inset-0 bg-linear-to-b from-background via-background/95 via-60% to-transparent pointer-events-none" />

        {/* Text content */}
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-32">
          <div className="flex flex-col">
            {/* Headline */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-semibold text-foreground leading-[1.1] mb-6">
              See what your systems are doing.
            </h1>

            {/* CTA */}
            <div className="relative w-fit">
              {/* Dark backdrop to dim log rows behind the CTA */}
              <div
                aria-hidden
                className="absolute -inset-x-10 -inset-y-6 bg-background/70 blur-2xl rounded-full pointer-events-none"
              />
              <Link
                href={ROUTES.AUTH.SIGN_UP}
                className="relative inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-5 py-3 text-base font-medium transition-opacity duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
