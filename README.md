# JavaMaster – Java Coding Problems Platform

JavaMaster is an interactive platform designed for mastering Java programming through a curated set of 100 coding challenges. The platform boasts a sleek, modern UI with a dark theme, offering users a seamless experience to write, run, and test Java code directly in the browser.

---

## 🚀 Features

- **🧑‍💻 Interactive Problem Solving:** Write and execute Java code directly in your browser
- **📚 Structured Learning Path:** Progress from basic to advanced Java concepts
- **🗂️ Problem Categories:** Problems organized by difficulty and concept
- **⚡ Code Execution:** Real-time feedback on your code
- **🧪 Test Cases:** Validate your solutions against predefined test cases
- **💡 Solution Hints:** Get help when you're stuck
- **📱 Responsive Design:** Works on desktop and mobile devices

---

## 🛠️ Tech Stack

| Layer         | Technology                       | Symbol |
|---------------|----------------------------------|--------|
| **Frontend**  | Next.js 14, React, Tailwind CSS  | ⚛️     |
| **UI**        | shadcn/ui                        | 🎨     |
| **Database**  | Supabase                         | 🗄️     |
| **Styling**   | Tailwind CSS with custom theme   | 🎨     |
| **Icons**     | Lucide React                     | 🖼️     |

---

## 🏁 Getting Started

### Prerequisites

- 🟢 Node.js 18.x or higher
- 📦 npm or yarn
- 🗝️ Supabase account

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/java-master.git
   cd java-master
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000) **in your browser.**

---

## 🗄️ Database Setup

### Supabase Schema

```sql
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
```

### Sample Data

```sql
INSERT INTO problems (title, description, difficulty, concepts, starter_code, solution, hints, test_cases)
VALUES 
(
  'Hello World',
  'Write a Java program that prints "Hello, World!" to the console.',
  'Easy',
  ARRAY['Basic Syntax', 'Output'],
  'public class Solution {\n  public static void main(String[] args) {\n    // Your code here\n  }\n}',
  'public class Solution {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}',
  ARRAY['Remember to use System.out.println() to print to the console.'],
  '[{"input": "", "expected_output": "Hello, World!"}]'
);
```

---

## 🚀 Deployment

### Deploy on Vercel

- Push your code to a GitHub repository
- Import the project into Vercel
- Add your environment variables
- Deploy

---

## 🗂️ Project Structure

```
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
```

---

## 🎨 Customization

- **Theme:** Adjust the color scheme in `tailwind.config.ts` (currently a dark background with deep purple accents).
- **Adding Problems:** Add new problems to the Supabase database following the schema above.

---

## 🤝 Contributing

Contributions are welcome! Please submit a Pull Request.

---

## 📄 License

MIT License – see the LICENSE file for details.

---

## 🙏 Acknowledgements

- Next.js
- Tailwind CSS
- shadcn/ui
- Supabase
- Lucide Icons

