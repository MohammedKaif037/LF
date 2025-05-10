import { createClient } from "@supabase/supabase-js"
import { staticProblems } from "./static-data"

// These would be set in your environment variables in production
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-supabase-url.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Problem = {
  id: number
  title: string
  description: string
  difficulty: "Easy" | "Medium" | "Hard"
  concepts: string[]
  starter_code: string
  solution: string
  hints: string[]
  test_cases: {
    input: string
    expected_output: string
  }[]
  completed?: boolean
}

export async function getProblems() {
  try {
    const { data, error } = await supabase.from("problems").select("*").order("id", { ascending: true })

    if (error) {
      console.error("Error fetching problems:", error)
      return staticProblems // Return static data on error
    }

    return data as Problem[]
  } catch (error) {
    console.error("Failed to fetch problems:", error)
    return staticProblems // Return static data on error
  }
}

export async function getProblem(id: number) {
  try {
    const { data, error } = await supabase.from("problems").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error fetching problem ${id}:`, error)
      // Find the problem in static data
      const staticProblem = staticProblems.find((p) => p.id === id)
      return staticProblem || null
    }

    return data as Problem
  } catch (error) {
    console.error(`Failed to fetch problem ${id}:`, error)
    // Find the problem in static data
    const staticProblem = staticProblems.find((p) => p.id === id)
    return staticProblem || null
  }
}
