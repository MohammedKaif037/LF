"use client"

import { useState } from "react"
import { CodeEditor } from "@/components/code-editor"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Problem } from "@/lib/supabase"
import { Play, RotateCcw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle } from "lucide-react"

interface CodeExecutorProps {
  problem: Problem
}

export function CodeExecutor({ problem }: CodeExecutorProps) {
  const [code, setCode] = useState(problem.starter_code)
  const [output, setOutput] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [testResults, setTestResults] = useState<Array<{ passed: boolean; output: string }>>([])

  const handleReset = () => {
    setCode(problem.starter_code)
    setOutput(null)
    setStatus("idle")
    setTestResults([])
  }

  const executeCode = async () => {
    setLoading(true)
    setOutput(null)
    setStatus("idle")

    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, input: "" }),
      })

      const data = await response.json()

      if (data.error) {
        setOutput(data.error)
        setStatus("error")
      } else {
        setOutput(data.output)

        // Check if output matches any test case
        const results = problem.test_cases.map((testCase) => {
          const passed = data.output.includes(testCase.expected_output)
          return {
            passed,
            output: data.output,
          }
        })

        setTestResults(results)

        // If any test passed, consider it a success
        setStatus(results.some((r) => r.passed) ? "success" : "error")
      }
    } catch (error) {
      console.error("Error executing code:", error)
      setOutput("Failed to execute code. Please try again.")
      setStatus("error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Code Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeEditor defaultValue={code} onChange={setCode} />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset} disabled={loading}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button className="gap-2" onClick={executeCode} disabled={loading}>
            <Play className="h-4 w-4" />
            {loading ? "Running..." : "Run Code"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Output</CardTitle>
        </CardHeader>
        <CardContent>
          {status !== "idle" && (
            <Alert
              className={`mb-4 ${status === "success" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}
            >
              <AlertDescription className="flex items-center">
                {status === "success" ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Code executed successfully!
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Code execution failed.
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="console">
            <TabsList className="mb-4">
              <TabsTrigger value="console">Console</TabsTrigger>
              <TabsTrigger value="test-cases">Test Cases</TabsTrigger>
            </TabsList>
            <TabsContent value="console">
              <div className="bg-secondary rounded-md p-4 font-mono text-sm h-32 overflow-auto">
                {output ? (
                  <pre>{output}</pre>
                ) : (
                  <p className="text-muted-foreground">Run your code to see output here...</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="test-cases">
              <div className="space-y-2">
                {problem.test_cases.map((testCase, index) => (
                  <div key={index} className="border rounded-md p-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Test Case #{index + 1}</span>
                      {testResults[index] ? (
                        <span className={testResults[index].passed ? "text-green-500" : "text-red-500"}>
                          {testResults[index].passed ? "Passed" : "Failed"}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Not run</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="font-medium mb-1">Input:</p>
                        <pre className="bg-secondary rounded-md p-2 overflow-x-auto">{testCase.input || "(empty)"}</pre>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Expected Output:</p>
                        <pre className="bg-secondary rounded-md p-2 overflow-x-auto">{testCase.expected_output}</pre>
                      </div>
                    </div>
                    {testResults[index] && (
                      <div className="mt-2">
                        <p className="font-medium mb-1">Your Output:</p>
                        <pre className="bg-secondary rounded-md p-2 overflow-x-auto">{testResults[index].output}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  )
  }
                  
