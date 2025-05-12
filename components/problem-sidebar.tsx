"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { staticProblems } from "@/lib/static-data"
import type { Problem } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, BookOpen, Code, Home, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export function ProblemSidebar() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    async function fetchProblems() {
      try {
        const { data, error } = await supabase.from("problems").select("*").order("id", { ascending: true })

        if (error) {
          console.error("Error fetching problems:", error)
          setProblems(staticProblems)
        } else {
          setProblems(data || staticProblems)
        }
      } catch (error) {
        console.error("Failed to fetch problems:", error)
        setProblems(staticProblems)
      } finally {
        setLoading(false)
      }
    }

    fetchProblems()
  }, [])

  const filteredProblems = problems.filter(
    (problem) =>
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.concept.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500 hover:bg-green-600"
      case "medium":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "hard":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-blue-500 hover:bg-blue-600"
    }
  }

  return (
    <div className={cn("border-r bg-background flex flex-col h-screen", isCollapsed ? "w-[60px]" : "w-[250px]")}>
      <div className="p-2 border-b flex justify-between items-center">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <span className="font-bold">JMaster</span>
          </Link>
        )}
        {isCollapsed && (
          <Link href="/" className="mx-auto">
            <BookOpen className="h-5 w-5" />
          </Link>
        )}
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? "→" : "←"}
        </Button>
      </div>

      {!isCollapsed && (
        <div className="px-2 py-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search problems..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="p-2">
          <div className="space-y-1">
            <p className={cn("text-xs font-medium text-muted-foreground py-1", isCollapsed && "text-center")}>
              {!isCollapsed && "Navigation"}
            </p>
            <NavItem
              href="/"
              icon={<Home className="h-4 w-4" />}
              label="Home"
              isActive={pathname === "/"}
              isCollapsed={isCollapsed}
            />
            <NavItem
              href="/problems"
              icon={<Code className="h-4 w-4" />}
              label="Problems"
              isActive={pathname === "/problems"}
              isCollapsed={isCollapsed}
            />
            <NavItem
              href="/profile"
              icon={<User className="h-4 w-4" />}
              label="Profile"
              isActive={pathname === "/profile"}
              isCollapsed={isCollapsed}
            />
          </div>

          <div className="mt-6">
            <p className={cn("text-xs font-medium text-muted-foreground py-1", isCollapsed && "text-center")}>
              {!isCollapsed && "Problems"}
            </p>
            <div className="space-y-1">
              {loading ? (
                Array(5)
                  .fill(0)
                  .map((_, i) => <Skeleton key={i} className="h-8 w-full" />)
              ) : filteredProblems.length > 0 ? (
                filteredProblems.map((problem) => (
                  <NavItem
                    key={problem.id}
                    href={`/problems/${problem.id}`}
                    label={problem.title}
                    isActive={pathname === `/problems/${problem.id}`}
                    isCollapsed={isCollapsed}
                    badge={
                      !isCollapsed && (
                        <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                      )
                    }
                  />
                ))
              ) : (
                <div className={cn("text-sm text-muted-foreground py-2", isCollapsed ? "text-center" : "px-2")}>
                  {!isCollapsed ? "No problems found" : "..."}
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className={cn("border-t p-2 text-xs text-muted-foreground", isCollapsed ? "text-center" : "")}>
        {!isCollapsed ? "© 2025 JMaster" : "©"}
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon?: React.ReactNode
  label: string
  isActive?: boolean
  isCollapsed?: boolean
  badge?: React.ReactNode
}

function NavItem({ href, icon, label, isActive, isCollapsed, badge }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium",
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        isCollapsed && "justify-center px-0",
      )}
    >
      {icon}
      {!isCollapsed && <span className="flex-1 truncate">{label}</span>}
      {!isCollapsed && badge}
    </Link>
  )
}
