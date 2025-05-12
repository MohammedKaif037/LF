import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">JMaster</h1>
            <div className="space-x-2">
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Master Java Programming</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Learn Java with interactive coding problems, from basic syntax to advanced concepts. Practice, solve, and
              improve your coding skills.
            </p>
            <Link href="/problems">
              <Button size="lg">Start Coding Now</Button>
            </Link>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Why JMaster?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">100+ Java Problems</h3>
                <p>From basic syntax to advanced algorithms, our curated collection covers it all.</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Interactive Code Editor</h3>
                <p>Write, test, and run your Java code directly in the browser.</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Track Your Progress</h3>
                <p>Monitor your learning journey and see your improvement over time.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 JMaster. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
