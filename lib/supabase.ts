import { createClient } from "@supabase/supabase-js"

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

// Fallback data in case of Supabase errors
export const fallbackProblems: Problem[] = [
  {
    id: 1,
    title: "Hello World",
    description: "Write a program that prints 'Hello, World!' to the console.",
    difficulty: "Easy",
    concepts: ["Basic Syntax", "Output"],
    starter_code: `public class Solution {
  public static void main(String[] args) {
    // Your code here
    
  }
}`,
    solution: `public class Solution {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}`,
    hints: ["Remember to use System.out.println() to print to the console."],
    test_cases: [
      {
        input: "",
        expected_output: "Hello, World!",
      },
    ],
    completed: false,
  },
  // other fallback problems...
]

export async function getProblems() {
  try {
    // Get all problems
    const { data: problems, error: problemsError } = await supabase
      .from("problems")
      .select("*")
      .order("id", { ascending: true })

    if (problemsError) {
      console.error("Error fetching problems:", problemsError)
      return fallbackProblems
    }

    // Get all test cases
    const { data: testCases, error: testCasesError } = await supabase
      .from("test_cases")
      .select("*")

    if (testCasesError) {
      console.error("Error fetching test cases:", testCasesError)
      return problems.map((problem) => ({
        ...problem,
        test_cases: [],
      }))
    }

    // Associate test cases with their respective problems
    const problemsWithTestCases = problems.map((problem) => ({
      ...problem,
      test_cases: testCases
        .filter((testCase) => testCase.problem_id === problem.id)
        .map(({ input, expected_output }) => ({ input, expected_output })),
    }))

    return problemsWithTestCases as Problem[]
  } catch (error) {
    console.error("Failed to fetch problems:", error)
    return fallbackProblems
  }
}

export async function getProblem(id: number) {
  try {
    // Get the problem
    const { data: problem, error: problemError } = await supabase
      .from("problems")
      .select("*")
      .eq("id", id)
      .single()

    if (problemError) {
      console.error(`Error fetching problem ${id}:`, problemError)
      return fallbackProblems.find((p) => p.id === id) || fallbackProblems[0]
    }

    // Get the test cases for this problem
    const { data: testCases, error: testCasesError } = await supabase
      .from("test_cases")
      .select("*")
      .eq("problem_id", id)

    if (testCasesError) {
      console.error(`Error fetching test cases for problem ${id}:`, testCasesError)
      return {
        ...problem,
        test_cases: [],
      }
    }

    // Combine problem with its test cases
    return {
      ...problem,
      test_cases: testCases.map(({ input, expected_output }) => ({ 
        input, 
        expected_output 
      })),
    } as Problem
  } catch (error) {
    console.error(`Failed to fetch problem ${id}:`, error)
    return fallbackProblems.find((p) => p.id === id) || fallbackProblems[0]
  }
}

// Auth types and functions remain unchanged
export type User = {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
  }
}

export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  return { data, error }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) return null

  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}
