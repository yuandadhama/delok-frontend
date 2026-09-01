import type { Metadata } from "next";
import { CodeBlock } from "@/src/components/docs/CodeBlock";
import { Callout } from "@/src/components/docs/Callout";

export const metadata: Metadata = {
  title: "Logging",
  description: "Learn how to send logs with Delok.",
};

export default function LoggingPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-wider text-primary">SDK</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Logging
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          Send structured events with level, message, and payload. Logs are sent immediately — no batching or queue.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Methods</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          The SDK exposes four methods. Level is determined by the method you call.
        </p>
        <div className="space-y-6">
          <div>
            <h3 className="font-mono text-sm font-semibold text-foreground">info()</h3>
            <p className="text-sm text-muted-foreground">Normal application events.</p>
            <div className="mt-3">
              <CodeBlock language="typescript" code={`await delok.info({ event: "user_login" });`} />
            </div>
          </div>
          <div>
            <h3 className="font-mono text-sm font-semibold text-foreground">warn()</h3>
            <p className="text-sm text-muted-foreground">Potentially problematic conditions.</p>
            <div className="mt-3">
              <CodeBlock
                language="typescript"
                code={`await delok.warn({
  event: "payment_retry",
  message: "Payment gateway timeout",
});`}
              />
            </div>
          </div>
          <div>
            <h3 className="font-mono text-sm font-semibold text-foreground">error()</h3>
            <p className="text-sm text-muted-foreground">Application errors.</p>
            <div className="mt-3">
              <CodeBlock
                language="typescript"
                code={`await delok.error({
  event: "payment_failed",
  message: "Payment failed",
});`}
              />
            </div>
          </div>
          <div>
            <h3 className="font-mono text-sm font-semibold text-foreground">fatal()</h3>
            <p className="text-sm text-muted-foreground">Critical failures.</p>
            <div className="mt-3">
              <CodeBlock
                language="typescript"
                code={`await delok.fatal({
  event: "database_crash",
  message: "Primary DB unavailable",
});`}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Event shape</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            <span className="font-mono text-foreground">event</span> — required, non-empty string
          </li>
          <li>
            <span className="font-mono text-foreground">message</span> — optional string
          </li>
          <li>
            <span className="font-mono text-foreground">payload</span> — optional structured JSON
          </li>
          <li>All methods return <span className="font-mono text-foreground">Promise&lt;void&gt;</span></li>
        </ul>
        <Callout>
          <p>
            <span className="font-mono text-foreground">error()</span> does not automatically capture JavaScript{" "}
            <span className="font-mono text-foreground">Error</span> objects. Pass{" "}
            <span className="font-mono text-foreground">event</span> and{" "}
            <span className="font-mono text-foreground">payload</span> explicitly.
          </p>
        </Callout>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Error handling</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Logging methods may reject. Handle failures explicitly — they are not swallowed.
        </p>
        <CodeBlock
          language="typescript"
          code={`try {
  await delok.error({ event: "payment_failed" });
} catch (error) {
  if (error instanceof DelokError) {
    // DelokConfigurationError | DelokNetworkError | DelokTimeoutError | DelokHttpError
  }
}`}
        />
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            Configuration errors throw synchronously from{" "}
            <span className="font-mono text-foreground">new Delok()</span>
          </li>
          <li>Event validation rejects before the request is sent</li>
          <li>
            Retryable: network failure, timeout (5000ms), HTTP{" "}
            <span className="font-mono text-foreground">500 / 502 / 503 / 504</span> — up to 3 attempts
          </li>
          <li>
            Not retried: <span className="font-mono text-foreground">400 / 401 / 403 / 404</span>
          </li>
        </ul>
      </section>

      <section className="space-y-3 border-t border-border pt-6">
        <h2 className="text-base font-semibold text-foreground">What is not included</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          No <span className="font-mono text-foreground">projectId</span> config, no custom levels, no batching, no offline queue, no{" "}
          <span className="font-mono text-foreground">updateConfig()</span>, no encryption, and no browser support verification.
        </p>
      </section>
    </article>
  );
}
