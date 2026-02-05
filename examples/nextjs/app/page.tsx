import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex flex-col items-center">
      {/* Hero Section */}

      <div className="mx-auto max-w-2xl px-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-6 mt-8">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
            @vybe-adk/swc-dom-source
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
          SWC DOM Source Plugin
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300">
          Automatically inject source file locations into your DOM elements for
          better debugging and development experience.
        </p>
      </div>


      {/* Content */}
      <div className="w-full max-w-2xl px-6 py-16 space-y-10">
        {/* How It Works */}
        <Card className="border-slate-200 shadow-sm dark:border-slate-800 py-4">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">How It Works</CardTitle>
            <CardDescription>
              Inspect any element on this page to see the magic
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pb-6">
            <p className="text-slate-600 dark:text-slate-300">
              This plugin adds a{" "}
              <code className="rounded-md bg-slate-100 px-2 py-1 font-mono text-sm text-violet-600 dark:bg-slate-800 dark:text-violet-400">
                data-source
              </code>{" "}
              attribute to every JSX element, pointing to its source file and line number.
            </p>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/50">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                Open DevTools and inspect this card to see:
              </p>
              <code className="block font-mono text-sm text-emerald-600 dark:text-emerald-400">
                &lt;div data-source=&quot;app/page.tsx:52:8&quot;&gt;
              </code>
            </div>
          </CardContent>
        </Card>

        {/* Configuration */}
        <Card className="border-slate-200 shadow-sm dark:border-slate-800 py-4">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Configuration</CardTitle>
            <CardDescription>next.config.ts</CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="rounded-lg bg-slate-900 p-5 font-mono text-sm overflow-x-auto">
              <pre className="text-slate-300">
                <span className="text-slate-500">{"// next.config.ts\n"}</span>
                <span className="text-purple-400">experimental</span>
                <span className="text-slate-500">:</span>
                {" {\n  "}
                <span className="text-purple-400">swcPlugins</span>
                <span className="text-slate-500">:</span>
                {" [\n    ["}
                <span className="text-emerald-400">&quot;@vybe-adk/swc-dom-source&quot;</span>
                {", {\n      "}
                <span className="text-blue-400">attr</span>
                <span className="text-slate-500">:</span>
                {" "}
                <span className="text-amber-400">&quot;data-source&quot;</span>
                {",\n      "}
                <span className="text-blue-400">exclude</span>
                <span className="text-slate-500">:</span>
                {" ["}
                <span className="text-amber-400">&quot;components/ui&quot;</span>
                {"]\n    }]\n  ]\n}"}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Exclusions */}
        <Card className="border-slate-200 shadow-sm dark:border-slate-800 py-4">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Exclusions</CardTitle>
            <CardDescription>Keep your UI library clean</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pb-6">
            <p className="text-slate-600 dark:text-slate-300">
              Notice these buttons{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm dark:bg-slate-800">
                data-source
              </code>
              ? The{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm dark:bg-slate-800">
                components/ui
              </code>{" "}
              folder is excluded in the config.
            </p>
          </CardContent>
          <CardFooter className="gap-3 pt-6 border-t border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30 rounded-b-lg">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
          </CardFooter>
        </Card>

        {/* Use Cases */}
        <Card className="border-slate-200 shadow-sm dark:border-slate-800 py-4">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Use Cases</CardTitle>
            <CardDescription>
              Why you might want source locations in your DOM
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="grid gap-4">
              {[
                {
                  title: "Click-to-source",
                  description: "Jump directly from browser to code editor",
                },
                {
                  title: "Error tracking",
                  description: "Include source context in error reports",
                },
                {
                  title: "Visual debugging",
                  description: "Quickly identify which component rendered what",
                },
                {
                  title: "Documentation",
                  description: "Build component documentation tools",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30">
                    <div className="h-2.5 w-2.5 rounded-full bg-violet-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-6 border-t border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30 rounded-b-lg">
            <Button variant="outline" asChild>
              <a
                href="https://github.com/vybe-build/swc-dom-source"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 mt-auto">
        <div className="py-10">
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Built with Next.js 16 &middot; Powered by SWC
          </p>
        </div>
      </footer>
    </main>
  );
}
