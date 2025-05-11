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
  {
    id: 2,
    title: "Variable Declaration",
    description: "Create variables to store your name, age, and height (in meters). Print them.",
    difficulty: "Easy",
    concepts: ["Variables", "Data Types", "Output"],
    starter_code: `public class Solution {
  public static void main(String[] args) {
    // Your code here
    
  }
}`,
    solution: `public class Solution {
  public static void main(String[] args) {
    String name = "John Doe";
    int age = 25;
    double height = 1.75;
    
    System.out.println("Name: " + name);
    System.out.println("Age: " + age);
    System.out.println("Height: " + height + "m");
  }
}`,
    hints: ["Use String for text, int for whole numbers, and double for decimal numbers."],
    test_cases: [
      {
        input: "",
        expected_output: "Name: ",
      },
    ],
    completed: false,
  },
  {
    id: 3,
    title: "Conditional Statements",
    description: "Write a program that checks if a number is positive, negative, or zero.",
    difficulty: "Easy",
    concepts: ["Conditionals", "If-Else"],
    starter_code: `public class Solution {
  public static void main(String[] args) {
    int number = 5; // Change this value to test
    
    // Your code here
    
  }
}`,
    solution: `public class Solution {
  public static void main(String[] args) {
    int number = 5; // Change this value to test
    
    if (number > 0) {
      System.out.println("Positive");
    } else if (number < 0) {
      System.out.println("Negative");
    } else {
      System.out.println("Zero");
    }
  }
}`,
    hints: ["Use if, else if, and else statements to check different conditions."],
    test_cases: [
      {
        input: "",
        expected_output: "Positive",
      },
    ],
    completed: false,
  },
]

export async function getProblems() {
  try {
    const { data, error } = await supabase.from("problems").select("*").order("id", { ascending: true })

    if (error) {
      console.error("Error fetching problems:", error)
      return fallbackProblems
    }

    return data as Problem[]
  } catch (error) {
    console.error("Failed to fetch problems:", error)
    return fallbackProblems
  }
}

export async function getProblem(id: number) {
  try {
    const { data, error } = await supabase.from("problems").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error fetching problem ${id}:`, error)
      return fallbackProblems.find((p) => p.id === id) || fallbackProblems[0]
    }

    return data as Problem
  } catch (error) {
    console.error(`Failed to fetch problem ${id}:`, error)
    return fallbackProblems.find((p) => p.id === id) || fallbackProblems[0]
  }
}

// Auth types
export type User = {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
  }
}

// Auth functions
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
