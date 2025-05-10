# JavaMaster - Java Coding Problems Platform

JavaMaster is an interactive platform for learning Java programming through 100 carefully curated coding problems. The platform features a sleek, modern UI with a dark theme and provides an interactive coding environment where users can write, run, and test Java code directly in the browser.

## Features

- **Interactive Problem Solving**: Write and execute Java code directly in your browser
- **Structured Learning Path**: Progress from basic to advanced Java concepts
- **Problem Categories**: Problems organized by difficulty and concept
- **Code Execution**: Real-time feedback on your code
- **Test Cases**: Validate your solutions against predefined test cases
- **Solution Hints**: Get help when you're stuck
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Supabase
- **Styling**: Tailwind CSS with custom theme
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/java-master.git
   cd java-master
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Database Setup

### Supabase Schema

Create a `problems` table in your Supabase database with the following schema:

\`\`\`sql
create table problems (
  id serial primary key,
  title text not null,
  description text not null,
  difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  concepts text[] not null,
  starter_code text not null,
  solution text not null,
  hints text[],
  test_cases jsonb not null
);
\`\`\`

### Sample Data

Insert sample problems into your Supabase database:

\`\`\`sql
INSERT INTO problems (title, description, difficulty, concepts, starter_code, solution, hints, test_cases)
VALUES 
(
  'Hello World',
  'Write a Java program that prints "Hello, World!" to the console.',
  'Easy',
  ARRAY['Basic Syntax', 'Output'],
  'public class Solution {
  public static void main(String[] args) {
    // Your code here
    
  }
}',
  'public class Solution {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}',
  ARRAY['Remember to use System.out.println() to print to the console.'],
  '[{"input": "", "expected_output": "Hello, World!"}]'
);
\`\`\`

## Deployment

### Deploy on Vercel

The easiest way to deploy the application is to use the [Vercel Platform](https://vercel.com).

1. Push your code to a GitHub repository
2. Import the project into Vercel
3. Add your environment variables
4. Deploy

## Project Structure

\`\`\`
java-master/
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   ├── problems/         # Problem pages
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── ui/               # UI components from shadcn/ui
│   ├── problem-list.tsx  # Problem listing component
│   └── ...               # Other components
├── lib/                  # Utility functions and libraries
│   └── supabase.ts       # Supabase client and types
├── public/               # Static assets
└── ...                   # Configuration files
\`\`\`

## Customization

### Theme

The color scheme can be customized in the `tailwind.config.ts` file. The current theme uses a dark background with deep purple accents.

### Adding Problems

Add new problems to the Supabase database following the schema defined above.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.io/)
- [Lucide Icons](https://lucide.dev/)
