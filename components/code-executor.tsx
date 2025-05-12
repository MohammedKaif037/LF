"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "./auth-provider"

interface ExecuteCodeProps {
  problemId: number
  code: string
}

export async function executeCode({ code, input = "" }: { code: string; input?: string }) {
  try {
    // Call the API route to execute the code
    const response = await fetch("/api/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, input }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to execute code")
    }

    const data = await response.json()
    return {
      success: data.success,
      output: data.error ? `Error: ${data.error}` : data.output,
      executionTime: data.executionTime,
      error: data.error,
    }
  } catch (error) {
    console.error("Error executing code:", error)
    return {
      success: false,
      output: error instanceof Error ? error.message : "An unknown error occurred",
      executionTime: null,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

export function useCodeSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()

  const submitSolution = async (problemId: number, code: string) => {
    if (!user) {
      return {
        success: false,
        message: "You must be logged in to submit solutions",
      }
    }

    setIsSubmitting(true)
    try {
      // First execute the code to verify it works
      const executionResult = await executeCode({ code })

      if (!executionResult.success) {
        return {
          success: false,
          message: "Your code failed to execute correctly",
          output: executionResult.output,
          error: executionResult.error,
        }
      }

      // If execution was successful, save the submission
      const { error } = await supabase.from("submissions").insert({
        user_id: user.id,
        problem_id: problemId,
        code,
        status: "success",
      })

      if (error) {
        throw new Error(error.message)
      }

      return {
        success: true,
        message: "Solution submitted successfully!",
        output: executionResult.output,
        executionTime: executionResult.executionTime,
      }
    } catch (error) {
      console.error("Error submitting solution:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to submit solution",
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    submitSolution,
    isSubmitting,
  }
}
