"use client"

import { CodeEditor } from "@/components/code-editor"
import { ProblemDetail } from "@/components/problem-detail"
import { ProblemSidebar } from "@/components/problem-sidebar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getProblem } from "@/lib/supabase"
import { AlertCircle, ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function ProblemPage({ params }: { params: { id: string } }) {
  const problemId = Number.parseInt(params.id)
  const [problem, setProblem] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [code, setCode] = useState("")
  const [output, setOutput] = useState<string | null>(null)
  const [executionResult, setExecutionResult] = useState<{
    success: boolean
    error: string | null
    executionTime?: string
  } | null>(null)
  const [executing, setExecuting] = useState(false)

  useEffect(() => {
    async function loadProblem() {
      try {
        const data = await getProblem(problemId)
        setProblem(data)
        if (data?.starter_code) {
          setCode(data.starter_code)
        }
      } catch (error) {
        console.error(`Failed to load problem ${problemId}:`, error)
      } finally {
        setLoading(false)
      }
    }

    loadProblem()
  }, [problemId])

  const executeCode = async (codeToExecute: string) => {
    setExecuting(true)
    setOutput(null)
    setExecutionResult(null)

    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: codeToExecute }),
      })

      const data = await response.json()

      if (response.ok) {
        setOutput(data.output || "")
        setExecutionResult({
          success: data.success,
          error: data.error,
          executionTime: data.executionTime,
        })
      } else {
        setExecutionResult({
          success: false,
          error: data.error || "Failed to execute code",
        })
      }
    } catch (error) {
      console.error("Error executing code:", error)
      setExecutionResult({
        success: false,
        error: "An unexpected error occurred while executing the code",
      })
    } finally {
      setExecuting(false)
    }
  }

  const resetCode = () => {
    if (problem?.starter_code) {
      setCode(problem.starter_code)
      setOutput(null)
      setExecutionResult(null)
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <ProblemSidebar />
        <main className="flex-1">
          <div className="container py-4">
            <div className="flex items-center gap-4 mb-6">
              <SidebarTrigger />
              <Link href="/problems">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Problems
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Card>
                    <CardHeader>
                      <Skeleton className="h-8 w-48" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-5/6" />
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-80 w-full" />
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Skeleton className="h-9 w-20" />
                      <Skeleton className="h-9 w-24" />
                    </CardFooter>
                  </Card>
                </div>
              </div>
            ) : problem ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <ProblemDetail problem={problem} />
                </div>
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Code Editor</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CodeEditor defaultValue={code} onChange={setCode} onExecute={executeCode} />
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={resetCode}>
                        Reset
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Output</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="console">
                        <TabsList className="mb-4">
                          <TabsTrigger value="console">Console</TabsTrigger>
                          <TabsTrigger value="test-cases">Test Cases</TabsTrigger>
                        </TabsList>
                        <TabsContent value="console">
                          {executionResult && (
                            <Alert
                              className={`mb-4 ${
                                executionResult.success
                                  ? "border-green-500 text-green-500"
                                  : "border-red-500 text-red-500"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {executionResult.success ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <XCircle className="h-4 w-4" />
                                )}
                                <AlertTitle>{executionResult.success ? "Success" : "Error"}</AlertTitle>
                              </div>
                              <AlertDescription className="mt-1">
                                {executionResult.success
                                  ? `Code executed successfully${
                                      executionResult.executionTime ? ` in ${executionResult.executionTime}` : ""
                                    }`
                                  : executionResult.error || "An error occurred during execution"}
                              </AlertDescription>
                            </Alert>
                          )}

                          <div className="bg-secondary rounded-md p-4 font-mono text-sm h-32 overflow-auto">
                            {executing ? (
                              <p className="text-muted-foreground">Executing code...</p>
                            ) : output !== null ? (
                              output || <span className="text-muted-foreground">(No output)</span>
                            ) : (
                              <p className="text-muted-foreground">Run your code to see output here...</p>
                            )}
                          </div>
                        </TabsContent>
                        <TabsContent value="test-cases">
                          <div className="space-y-2">
                            {problem.test_cases.map((testCase: any, index: number) => (
                              <div key={index} className="border rounded-md p-3">
                                <div className="flex justify-between text-sm mb-2">
                                  <span className="font-medium">Test Case #{index + 1}</span>
                                  <span className="text-muted-foreground">Not run</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div>
                                    <p className="font-medium mb-1">Input:</p>
                                    <pre className="bg-secondary rounded-md p-2 overflow-x-auto">
                                      {testCase.input || "(empty)"}
                                    </pre>
                                  </div>
                                  <div>
                                    <p className="font-medium mb-1">Expected Output:</p>
                                    <pre className="bg-secondary rounded-md p-2 overflow-x-auto">
                                      {testCase.expected_output}
                                    </pre>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="flex items-center gap-2 text-red-500 mb-4">
                  <AlertCircle className="h-6 w-6" />
                  <h2 className="text-xl font-bold">Problem Not Found</h2>
                </div>
                <p className="text-muted-foreground mb-6">
                  The problem you're looking for doesn't exist or couldn't be loaded.
                </p>
                <Link href="/problems">
                  <Button>View All Problems</Button>
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
