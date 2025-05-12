import { createClient } from "@supabase/supabase-js"

// These will be replaced with actual values when deployed
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types based on our schema
export type User = {
  id: string
  email: string
  username: string
  created_at: string
}

export type Problem = {
  id: number
  title: string
  description: string
  concept: string
  difficulty: "easy" | "medium" | "hard"
  starter_code: string
  test_cases: string
  solution: string
  created_at: string
}

export type Submission = {
  id: number
  user_id: string
  problem_id: number
  code: string
  status: "pending" | "success" | "failed"
  created_at: string
}
