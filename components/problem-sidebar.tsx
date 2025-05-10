"use client"
//SideBar
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { CheckCircle, Code, Filter, Home, Search, Terminal } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { type Problem, getProblems } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function ProblemSidebar() {
  const pathname = usePathname()
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProblems() {
      try {
        setLoading(true)
        setError(null)
        const data = await getProblems()
        setProblems(data)
      } catch (err) {
        console.error("Failed to load problems:", err)
        setError("Failed to load problems. Using fallback data.")
      } finally {
        setLoading(false)
      }
    }

    loadProblems()
  }, [])

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Terminal className="h-6 w-6 text-primary" />
          <Link href="/" className="text-xl font-bold">
            JavaMaster
          </Link>
        </div>
        <div className="px-2 pb-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search problems..."
              className="w-full rounded-md border border-input bg-background py-2 pl-8 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/"}>
                  <Link href="/">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/problems"}>
                  <Link href="/problems">
                    <Code className="h-4 w-4" />
                    <span>All Problems</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {error && (
          <div className="px-2 py-2">
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Problems</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {loading
                ? // Loading skeletons
                  Array.from({ length: 5 }).map((_, index) => (
                    <SidebarMenuItem key={index}>
                      <div className="flex items-center gap-2 p-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </SidebarMenuItem>
                  ))
                : problems.map((problem) => (
                    <SidebarMenuItem key={problem.id}>
                      <SidebarMenuButton asChild isActive={pathname === `/problems/${problem.id}`}>
                        <Link href={`/problems/${problem.id}`}>
                          {problem.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border border-muted-foreground/50" />
                          )}
                          <span>
                            {problem.id}. {problem.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2">
          <Button variant="outline" className="w-full justify-start gap-2">
            <Filter className="h-4 w-4" />
            Filter Problems
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
      <SidebarTrigger className="absolute right-4 top-4 md:hidden" />
    </Sidebar>
  )
}
