// This is Fallback static data for when Supabase connection fails
export const staticProblems = [
  {
    id: 1,
    title: "Hello World",
    description: "Write a Java program that prints 'Hello, World!' to the console.",
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
    // Declare variables for name, age, and height
    // Print them to the console
    
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
    hints: [
      "Use String for text, int for whole numbers, and double for decimal numbers.",
      "Use System.out.println() to print each variable.",
    ],
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
    int number = 10; // Try with different values
    
    // Your code here
    
  }
}`,
    solution: `public class Solution {
  public static void main(String[] args) {
    int number = 10; // Try with different values
    
    if (number > 0) {
      System.out.println("Positive");
    } else if (number < 0) {
      System.out.println("Negative");
    } else {
      System.out.println("Zero");
    }
  }
}`,
    hints: [
      "Use if, else if, and else statements to check different conditions.",
      "Compare the number with 0 to determine if it's positive, negative, or zero.",
    ],
    test_cases: [
      {
        input: "",
        expected_output: "Positive",
      },
    ],
    completed: false,
  },
  {
    id: 4,
    title: "Loops",
    description: "Print numbers from 1 to 10 using a for loop.",
    difficulty: "Easy",
    concepts: ["Loops", "For Loop"],
    starter_code: `public class Solution {
  public static void main(String[] args) {
    // Your code here
    
  }
}`,
    solution: `public class Solution {
  public static void main(String[] args) {
    for (int i = 1; i <= 10; i++) {
      System.out.println(i);
    }
  }
}`,
    hints: [
      "Use a for loop with a counter variable that starts at 1.",
      "Increment the counter in each iteration until it reaches 10.",
    ],
    test_cases: [
      {
        input: "",
        expected_output: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10",
      },
    ],
    completed: false,
  },
  {
    id: 5,
    title: "Arrays",
    description: "Create an array of integers and find the sum of all elements.",
    difficulty: "Medium",
    concepts: ["Arrays", "Loops"],
    starter_code: `public class Solution {
  public static void main(String[] args) {
    int[] numbers = {5, 10, 15, 20, 25};
    
    // Calculate and print the sum
    
  }
}`,
    solution: `public class Solution {
  public static void main(String[] args) {
    int[] numbers = {5, 10, 15, 20, 25};
    
    int sum = 0;
    for (int number : numbers) {
      sum += number;
    }
    
    System.out.println("Sum: " + sum);
  }
}`,
    hints: [
      "Initialize a variable to store the sum.",
      "Use a for-each loop to iterate through the array.",
      "Add each element to the sum variable.",
    ],
    test_cases: [
      {
        input: "",
        expected_output: "Sum: 75",
      },
    ],
    completed: false,
  },
  {
    id: 6,
    title: "Methods",
    description: "Create a method that calculates the factorial of a number.",
    difficulty: "Medium",
    concepts: ["Methods", "Recursion"],
    starter_code: `public class Solution {
  public static void main(String[] args) {
    int number = 5;
    System.out.println("Factorial of " + number + " is: " + factorial(number));
  }
  
  // Create the factorial method here
  
}`,
    solution: `public class Solution {
  public static void main(String[] args) {
    int number = 5;
    System.out.println("Factorial of " + number + " is: " + factorial(number));
  }
  
  public static int factorial(int n) {
    if (n == 0 || n == 1) {
      return 1;
    }
    return n * factorial(n - 1);
  }
}`,
    hints: [
      "The factorial of 0 and 1 is 1.",
      "For other numbers, factorial(n) = n * factorial(n-1).",
      "You can use recursion or a loop to solve this problem.",
    ],
    test_cases: [
      {
        input: "",
        expected_output: "Factorial of 5 is: 120",
      },
    ],
    completed: false,
  },
]
