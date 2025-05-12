"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Play } from "lucide-react"

interface CodeEditorProps {
  problemId: number
  starterCode: string
  testCases: string
  onExecute: (
    code: string,
    input?: string,
  ) => Promise<{ success: boolean; output: string; executionTime?: string; error?: string }>
}

export function CodeEditor({ problemId, starterCode, testCases, onExecute }: CodeEditorProps) {
  const [code, setCode] = useState(starterCode)
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [executionTime, setExecutionTime] = useState<string | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionSuccess, setExecutionSuccess] = useState<boolean | null>(null)
  const [executionError, setExecutionError] = useState<string | null>(null)

  useEffect(() => {
    setCode(starterCode)
  }, [starterCode])

  const handleExecute = async () => {
    setIsExecuting(true)
    setOutput("Executing code...")
    setExecutionSuccess(null)
    setExecutionError(null)
    setExecutionTime(null)

    try {
      const result = await onExecute(code, input)
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

  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="code" className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <TabsList>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="input">Input</TabsTrigger>
            <TabsTrigger value="test-cases">Test Cases</TabsTrigger>
          </TabsList>
          <Button onClick={handleExecute} disabled={isExecuting} className="gap-1">
            <Play className="h-4 w-4" />
            {isExecuting ? "Executing..." : "Run Code"}
          </Button>
        </div>

        <TabsContent value="code" className="flex-1 flex flex-col mt-0">
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 font-mono text-sm p-4 resize-none h-[400px] md:h-[500px]"
            placeholder="Write your Java code here..."
          />
        </TabsContent>

        <TabsContent value="input" className="flex-1 mt-0">
          <div className="flex flex-col h-full">
            <p className="text-sm text-muted-foreground mb-2">Enter input values for your program (if needed):</p>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 font-mono text-sm p-4 resize-none h-[400px] md:h-[460px]"
              placeholder="Enter input values here..."
            />
          </div>
        </TabsContent>

        <TabsContent value="test-cases" className="flex-1 mt-0">
          <div className="border rounded-md p-4 h-[400px] md:h-[500px] overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">{testCases}</pre>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">Output</h3>
          {executionTime && <span className="text-xs text-muted-foreground">Execution time: {executionTime}</span>}
        </div>
        <div className="border rounded-md p-4 bg-muted min-h-[100px] max-h-[200px] overflow-auto">
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
                  <AlertDescription>{executionError || "There was an error executing your code."}</AlertDescription>
                </>
              )}
            </Alert>
          )}
          <pre className="text-sm whitespace-pre-wrap font-mono">{output}</pre>
        </div>
      </div>
    </div>
  )
}
