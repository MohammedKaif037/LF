"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "./auth-provider"
import { useToast } from "@/components/ui/use-toast"

interface ExecuteCodeParams {
  code: string
  language?: string
  input?: string
}

interface ExecuteCodeResult {
  success: boolean
  output: string
  error?: string | null
  executionTime?: string
}

interface SubmitSolutionResult {
  success: boolean
  message: string
  output?: string
}

// Function to extract input label from code (reused from your implementation)
function extractInputLabel(code: string): string | null {
  // Python input("label")
  let match = code.match(/input\("([^"]+)"\)/)
  if (match) return match[1]
  // C scanf("label")
  match = code.match(/scanf\("([^"]+)"/)
  if (match) return match[1]
  // Java new Scanner(System.in).next(); System.out.print("label")
  match = code.match(/System\.out\.print(?:ln)?\("([^"]+)"\)/)
  if (match) return match[1]
  return null
}

// Execute code function that works with the Codex API (from your implementation)
export async function executeCode({ code, language = "java", input = "" }: ExecuteCodeParams): Promise<ExecuteCodeResult> {
  console.log("Executing code with Codex API:", { language, inputLength: input?.length || 0 })
  
  try {
    // Remove input prompts for execution (for clean output)
    const cleanedCode = code
      .replace(/input\("([^"]+)"\)/g, "input()")
      .replace(/scanf\("([^"]+)"/g, 'scanf("')
      .replace(/System\.out\.print(?:ln)?\("([^"]+)"\)/g, "")

    const data = new URLSearchParams()
    data.append("language", language)
    data.append("code", cleanedCode)
    if (input) data.append("input", input)

    console.log("Making API request to Codex")
    const startTime = performance.now()
    
    const response = await fetch("https://api.codex.jaagrav.in", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: data,
    })
    
    const endTime = performance.now()
    const executionTime = `${(endTime - startTime).toFixed(2)}ms`
    console.log(`API request completed in ${executionTime}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API responded with status ${response.status}: ${errorText}`)
      return {
        success: false,
        output: `Execution failed with status ${response.status}: ${errorText}`,
        error: errorText,
        executionTime
      }
    }

    const result = await response.json()
    console.log("Execution result:", result)
    
    return {
      success: !result.error,
      output: result.output || result.error || "No output",
      error: result.error || null,
      executionTime
    }
  } catch (error) {
    console.error("Exception during code execution:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    return {
      success: false,
      output: `Error: ${errorMessage}`,
      error: errorMessage
    }
  }
}

// Custom hook for submission logic with improved logging
export function useCodeSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const submitSolution = async (problemId: number, code: string, language = "java"): Promise<SubmitSolutionResult> => {
    console.log(`Submitting solution for problem ID: ${problemId}`)
    
    if (!user) {
      console.error("Submission failed: User not authenticated")
      return {
        success: false,
        message: "You must be logged in to submit solutions"
      }
    }

    if (!code.trim()) {
      console.error("Submission failed: No code provided")
      return {
        success: false,
        message: "You cannot submit an empty solution"
      }
    }

    setIsSubmitting(true)

    try {
      console.log("Executing code for submission validation")
      // First verify the code works
      const executionResult = await executeCode({ code, language })
      
      if (!executionResult.success) {
        console.error("Submission failed: Code execution failed", executionResult)
        return {
          success: false,
          message: "Your solution contains errors and cannot be submitted.",
          output: executionResult.output
        }
      }

      // Now save the solution to Supabase
      console.log("Saving solution to database")
      const { error } = await supabase.from("solutions").insert({
        user_id: user.id,
        problem_id: problemId,
        code: code,
        status: "completed",
        created_at: new Date().toISOString()
      })

      if (error) {
        console.error("Database error during submission:", error)
        return {
          success: false,
          message: `Failed to save your solution: ${error.message}`
        }
      }

      console.log("Solution submitted successfully")
      // Show toast notification
      toast({
        title: "Solution Submitted",
        description: "Your solution has been saved successfully!",
      })

      return {
        success: true,
        message: "Your solution has been submitted successfully!"
      }
    } catch (error) {
      console.error("Exception during solution submission:", error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      
      return {
        success: false,
        message: `An error occurred: ${errorMessage}`
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return { submitSolution, isSubmitting }
}
