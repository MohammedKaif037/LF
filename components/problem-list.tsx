"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { staticProblems } from "@/lib/static-data"
import type { Problem } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Code, X, CheckCircle, AlertCircle, Play, Save, Trophy } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { executeCode, useCodeSubmission } from "./code-executor"
import { useAuth } from "./auth-provider"
import { useToast } from "@/components/ui/use-toast"

export function ProblemList() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Solve problem state
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null)
  const [code, setCode] = useState("")
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [executionTime, setExecutionTime] = useState<string | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionSuccess, setExecutionSuccess] = useState<boolean | null>(null)
  const [executionError, setExecutionError] = useState<string | null>(null)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean
    message: string
    output?: string
  } | null>(null)

  const { submitSolution, isSubmitting } = useCodeSubmission()
  const { user } = useAuth()
  const { toast } = useToast()

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

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.concept.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDifficulty = difficultyFilter === "all" || problem.difficulty === difficultyFilter
    const matchesCategory = categoryFilter === "all" || (problem.category && problem.category === categoryFilter)

    return matchesSearch && matchesDifficulty && matchesCategory
  })

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

  const handleOpenProblem = (problem: Problem) => {
    setSelectedProblem(problem)
    setCode(problem.starter_code)
    setInput("")
    setOutput("")
    setExecutionTime(null)
    setExecutionSuccess(null)
    setExecutionError(null)
    setSubmissionResult(null)
  }

  const handleCloseProblem = () => {
    setSelectedProblem(null)
  }

  const handleExecute = async () => {
    if (!selectedProblem) return

    setIsExecuting(true)
    setOutput("Executing code...")
    setExecutionSuccess(null)
    setExecutionError(null)
    setExecutionTime(null)

    try {
      const result = await executeCode({ code, input })
      setOutput(result.output)
      setExecutionSuccess(result.success)
      setExecutionTime(result.executionTime || null)
      setExecutionError(result.error || null)
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`)
      setExecutionSuccess(false)
      setExecutionError(error instanceof Error ? error.message : String(error))
    } finally {
      setIsExecuting(false)
    }
  }

  const handleSubmit = async () => {
    if (!selectedProblem) return

    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to submit solutions",
        variant: "destructive",
      })
      return
    }

    setIsExecuting(true)
    setSubmissionResult(null)

    try {
      // First execute the code to verify it works
      const executionResult = await executeCode({ code })

      if (!executionResult.success) {
        setSubmissionResult({
          success: false,
          message: "Your code failed to execute correctly",
          output: executionResult.output,
        })
        return
      }

      // If execution was successful, submit the solution
      const result = await submitSolution(selectedProblem.id, code)
      setSubmissionResult(result)

      if (result.success) {
        setShowSuccessDialog(true)
      }
    } catch (error) {
      setSubmissionResult({
        success: false,
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Java Problems</h1>
          <p className="text-muted-foreground">Practice your Java skills with these coding challenges</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search problems..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Basic Syntax and Data Types">Basic Syntax and Data Types</SelectItem>
              <SelectItem value="Control Structures">Control Structures</SelectItem>
              <SelectItem value="Functions and Methods">Functions and Methods</SelectItem>
              <SelectItem value="Arrays and Lists">Arrays and Lists</SelectItem>
              <SelectItem value="String Manipulation">String Manipulation</SelectItem>
              {/* Add more categories as needed */}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="h-[200px]">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))}
        </div>
      ) : filteredProblems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.map((problem) => (
            <Card key={problem.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{problem.title}</CardTitle>
                  <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                </div>
                <CardDescription>{problem.concept}</CardDescription>
                {problem.category && <p className="text-xs text-muted-foreground">Category: {problem.category}</p>}
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm line-clamp-3">{problem.description}</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleOpenProblem(problem)} className="w-full">
                  <Code className="mr-2 h-4 w-4" /> Solve Problem
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No problems found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Problem Solving Dialog */}
      {selectedProblem && (
        <Dialog open={!!selectedProblem} onOpenChange={(open) => !open && handleCloseProblem()}>
          <DialogContent className="max-w-5xl w-[90vw] h-[90vh] flex flex-col">
            <DialogHeader className="flex flex-row justify-between items-start">
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <span>{selectedProblem.title}</span>
                  <Badge className={getDifficultyColor(selectedProblem.difficulty)}>{selectedProblem.difficulty}</Badge>
                </DialogTitle>
                <DialogDescription>{selectedProblem.concept}</DialogDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCloseProblem}>
                <X className="h-4 w-4" />
              </Button>
            </DialogHeader>

            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Problem Description */}
              <div className="mb-4 p-4 border rounded-md bg-muted/50 overflow-auto max-h-[20vh]">
                <p>{selectedProblem.description}</p>
              </div>

              {submissionResult && (
                <Alert
                  className={`mb-4 ${
                    submissionResult.success
                      ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
                  }`}
                >
                  {submissionResult.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  )}
                  <AlertTitle>{submissionResult.success ? "Success!" : "Submission Failed"}</AlertTitle>
                  <AlertDescription>{submissionResult.message}</AlertDescription>
                </Alert>
              )}

              {/* Code Editor */}
              <div className="flex-1 flex flex-col min-h-0">
                <Tabs defaultValue="code" className="flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <TabsList>
                      <TabsTrigger value="code">Code</TabsTrigger>
                      <TabsTrigger value="input">Input</TabsTrigger>
                      <TabsTrigger value="test-cases">Test Cases</TabsTrigger>
                    </TabsList>
                    <div className="flex gap-2">
                      <Button onClick={handleExecute} disabled={isExecuting} size="sm" className="gap-1">
                        <Play className="h-4 w-4" />
                        {isExecuting ? "Running..." : "Run Code"}
                      </Button>
                      {user && (
                        <Button onClick={handleSubmit} disabled={isSubmitting} size="sm" className="gap-1">
                          <Save className="h-4 w-4" />
                          {isSubmitting ? "Submitting..." : "Submit"}
                        </Button>
                      )}
                    </div>
                  </div>

                  <TabsContent value="code" className="flex-1 flex flex-col mt-0">
                    <Textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="flex-1 font-mono text-sm p-4 resize-none min-h-[30vh]"
                      placeholder="Write your Java code here..."
                    />
                  </TabsContent>

                  <TabsContent value="input" className="flex-1 mt-0">
                    <div className="flex flex-col h-full">
                      <p className="text-sm text-muted-foreground mb-2">
                        Enter input values for your program (if needed):
                      </p>
                      <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 font-mono text-sm p-4 resize-none min-h-[30vh]"
                        placeholder="Enter input values here..."
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="test-cases" className="flex-1 mt-0">
                    <div className="border rounded-md p-4 min-h-[30vh] overflow-auto">
                      <pre className="text-sm whitespace-pre-wrap">{selectedProblem.test_cases}</pre>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">Output</h3>
                    {executionTime && (
                      <span className="text-xs text-muted-foreground">Execution time: {executionTime}</span>
                    )}
                  </div>
                  <div className="border rounded-md p-4 bg-muted min-h-[100px] max-h-[150px] overflow-auto">
                    {executionSuccess !== null && (
                      <Alert
                        className={`mb-2 ${
                          executionSuccess
                            ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                            : "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
                        }`}
                      >
                        {executionSuccess ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <AlertTitle>Success!</AlertTitle>
                            <AlertDescription>Your code executed successfully.</AlertDescription>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                            <AlertTitle>Execution Failed</AlertTitle>
                            <AlertDescription>
                              {executionError || "There was an error executing your code."}
                            </AlertDescription>
                          </>
                        )}
                      </Alert>
                    )}
                    <pre className="text-sm whitespace-pre-wrap font-mono">{output}</pre>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Problem Solved!
            </DialogTitle>
            <DialogDescription>Congratulations! You've successfully solved this problem.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>Your solution has been saved and added to your profile.</p>
            {selectedProblem && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="font-medium">Problem: {selectedProblem.title}</p>
                <p className="text-sm text-muted-foreground">Difficulty: {selectedProblem.difficulty}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setShowSuccessDialog(false)
                handleCloseProblem()
              }}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
