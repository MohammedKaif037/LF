// Fallback data in case Supabase connection fails
export const staticProblems = [
  {
    id: 1,
    title: "Hello World",
    description: 'Write a program that prints "Hello, World!" to the console',
    concept: "Basic program structure, System.out.println()",
    difficulty: "easy",
    starter_code:
      "public class HelloWorld {\n  public static void main(String[] args) {\n    // Your code here\n  }\n}",
    test_cases: "Output: Hello, World!",
    solution:
      'public class HelloWorld {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}',
    created_at: "2023-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    title: "Variable Declaration",
    description: "Create variables to store your name, age, and height (in meters)",
    concept: "Variable declaration, primitive data types",
    difficulty: "easy",
    starter_code:
      "public class Variables {\n  public static void main(String[] args) {\n    // Declare your variables here\n    \n    // Print them out\n  }\n}",
    test_cases: "Output should include string, int, and double values",
    solution:
      'public class Variables {\n  public static void main(String[] args) {\n    String name = "John Doe";\n    int age = 25;\n    double height = 1.75;\n    \n    System.out.println("Name: " + name);\n    System.out.println("Age: " + age);\n    System.out.println("Height: " + height + " meters");\n  }\n}',
    created_at: "2023-01-02T00:00:00.000Z",
  },
  {
    id: 3,
    title: "Simple Calculator",
    description:
      "Write a program that takes two numbers and performs addition, subtraction, multiplication, and division",
    concept: "Arithmetic operators, basic input/output",
    difficulty: "easy",
    starter_code:
      "import java.util.Scanner;\n\npublic class Calculator {\n  public static void main(String[] args) {\n    Scanner scanner = new Scanner(System.in);\n    \n    // Get user input\n    \n    // Perform calculations\n    \n    // Print results\n  }\n}",
    test_cases: "Input: 10 5\nOutput should show sum, difference, product, and quotient",
    solution:
      'import java.util.Scanner;\n\npublic class Calculator {\n  public static void main(String[] args) {\n    Scanner scanner = new Scanner(System.in);\n    \n    System.out.print("Enter first number: ");\n    double num1 = scanner.nextDouble();\n    \n    System.out.print("Enter second number: ");\n    double num2 = scanner.nextDouble();\n    \n    System.out.println("Sum: " + (num1 + num2));\n    System.out.println("Difference: " + (num1 - num2));\n    System.out.println("Product: " + (num1 * num2));\n    System.out.println("Quotient: " + (num1 / num2));\n    \n    scanner.close();\n  }\n}',
    created_at: "2023-01-03T00:00:00.000Z",
  },
  {
    id: 4,
    title: "Conditional Statements",
    description: "Write a program that determines if a number is positive, negative, or zero",
    concept: "If-else statements, conditional logic",
    difficulty: "easy",
    starter_code:
      "import java.util.Scanner;\n\npublic class Conditions {\n  public static void main(String[] args) {\n    Scanner scanner = new Scanner(System.in);\n    \n    // Get user input\n    \n    // Check if positive, negative, or zero\n    \n    scanner.close();\n  }\n}",
    test_cases: "Test with values: 5, -3, 0",
    solution:
      'import java.util.Scanner;\n\npublic class Conditions {\n  public static void main(String[] args) {\n    Scanner scanner = new Scanner(System.in);\n    \n    System.out.print("Enter a number: ");\n    int number = scanner.nextInt();\n    \n    if (number > 0) {\n      System.out.println("The number is positive.");\n    } else if (number < 0) {\n      System.out.println("The number is negative.");\n    } else {\n      System.out.println("The number is zero.");\n    }\n    \n    scanner.close();\n  }\n}',
    created_at: "2023-01-04T00:00:00.000Z",
  },
  {
    id: 5,
    title: "Loops",
    description: "Write a program that prints the first 10 numbers in the Fibonacci sequence",
    concept: "Loops, sequence generation",
    difficulty: "medium",
    starter_code:
      "public class Fibonacci {\n  public static void main(String[] args) {\n    // Print the first 10 Fibonacci numbers\n  }\n}",
    test_cases: "Output: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34",
    solution:
      'public class Fibonacci {\n  public static void main(String[] args) {\n    int n = 10;\n    int first = 0, second = 1;\n    \n    System.out.print(first + ", " + second);\n    \n    for (int i = 2; i < n; i++) {\n      int next = first + second;\n      System.out.print(", " + next);\n      first = second;\n      second = next;\n    }\n  }\n}',
    created_at: "2023-01-05T00:00:00.000Z",
  },
]
