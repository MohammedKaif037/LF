import { ProblemList } from "@/components/problem-list"
import { ProblemSidebar } from "@/components/problem-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

//Problems Page Skeleton 
//ToDo Impl Global Error
export default function ProblemsPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <ProblemSidebar />
        <main className="flex-1">
          <div className="container py-8">
            <h1 className="text-3xl font-bold mb-6">Java Coding Problems</h1>
            <ProblemList />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
