import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Code, Cpu, GraduationCap, Terminal } from "lucide-react"
//Homepage 
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">JavaMaster</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link href="/problems" className="text-sm font-medium hover:text-primary">
              Problems
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-primary">
              Resources
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-primary">
              About
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 md:py-32 bg-gradient-to-b from-background to-secondary/20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Master Java with <span className="text-primary">100 Coding Problems</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Interactive coding challenges to help you learn Java programming from basics to advanced concepts.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/problems">
                    <Button size="lg" className="w-full min-[400px]:w-auto">
                      Start Coding
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="w-full min-[400px]:w-auto">
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="mx-auto lg:mx-0 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-lg blur-3xl opacity-50" />
                <div className="relative bg-card border rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500" />
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                    </div>
                    <div className="text-xs text-muted-foreground">Problem #1: Hello World</div>
                  </div>
                  <pre className="bg-secondary p-4 rounded-md overflow-x-auto text-sm">
                    <code className="text-foreground">
                      {`public class HelloWorld {
public static void main(String[] args) {
  // Your solution here
  System.out.println("Hello, World!");
}
}`}
                    </code>
                  </pre>
                  <div className="mt-4 flex justify-between">
                    <div className="text-xs text-muted-foreground">Java 17</div>
                    <Button size="sm" variant="secondary">
                      Run Code
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Everything you need to master Java</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides a comprehensive learning experience with interactive coding challenges.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Interactive Coding</h3>
                <p className="text-center text-muted-foreground">
                  Write, compile, and run Java code directly in your browser with real-time feedback.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Structured Learning</h3>
                <p className="text-center text-muted-foreground">
                  Progress from basic to advanced concepts with carefully curated problems.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Cpu className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Performance Tracking</h3>
                <p className="text-center text-muted-foreground">
                  Monitor your progress and see how your solutions compare to others.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to start your Java journey?</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of developers who have improved their Java skills with our platform.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/problems">
                  <Button size="lg" className="w-full min-[400px]:w-auto">
                    Start Coding Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">© 2025 JavaMaster. All rights reserved.</p>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
