import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { code, input } = data

    // Simple validation
    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 })
    }

    // Simulate execution delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check for basic Java patterns to simulate execution
    let output = ""
    let success = false
    let error = null

    if (code.includes("System.out.println")) {
      // Extract what's being printed
      const printMatches = code.match(/System\.out\.println\("(.*)"\)/g)
      if (printMatches && printMatches.length > 0) {
        // Extract content from all println statements
        output = printMatches
          .map((match) => {
            const content = match.match(/System\.out\.println\("(.*)"\)/)
            return content ? content[1] : ""
          })
          .join("\n")
        success = true
      } else if (code.includes("System.out.println")) {
        // If we can't extract the exact content but println is used
        output = "Output generated (simulated)"
        success = true
      }
    } else if (code.includes("public static void main")) {
      output = "Program executed successfully, but no output was generated."
      success = true
    } else {
      error = "Compilation error: Missing main method."
      success = false
    }

    // Check for common syntax errors
    if (code.includes("{") && !code.includes("}")) {
      error = "Compilation error: Missing closing brace '}'."
      success = false
    } else if (!code.includes("{") && code.includes("}")) {
      error = "Compilation error: Missing opening brace '{'."
      success = false
    } else if (code.includes("System.out.println") && !code.includes(";")) {
      error = "Compilation error: Missing semicolon ';'."
      success = false
    }

    return NextResponse.json({
      output,
      success,
      error,
      executionTime: "0.12s", // Simulated execution time
    })
  } catch (error) {
    console.error("Error executing code:", error)
    return NextResponse.json(
      {
        error: "Failed to execute code",
        success: false,
      },
      { status: 500 },
    )
  }
}
