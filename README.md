# <img src="public/logo.svg" alt="Branchy Logo" width="32" height="32" style="vertical-align: middle;"> Branchy

An AI-powered tool that helps you explore any topic by creating an interactive, branching tree of ideas. Enter a topic, click to expand, and discover new subtopics as you dive deeper.

🌐 **[Try it live at branchy.co](https://branchy.co)**

## ✨ What it does

- **Start with any topic**: Type anything you want to explore
- **AI generates subtopics**: Click the arrow to get 4-6 related subtopics
- **Expand infinitely**: Click any subtopic to explore it further
- **Smart navigation**: The tree automatically centers as you expand
- **Add your own ideas**: Use the "+" button to add custom subtopics
- **Start fresh**: Clear the entire tree and begin again

## 🚀 Quick start

### Prerequisites

- Node.js 18 or newer
- A Supabase account (free tier works fine)
- An OpenAI API key

### Setup

1. **Clone and install**

   ```bash
   git clone <your-repo-url>
   cd branchy-text-tree-view
   npm install
   ```

2. **Set up Supabase**

   - Create a project at [supabase.com](https://supabase.com)
   - Deploy the edge function:
     ```bash
     npx supabase functions deploy generate-tree-content
     ```
   - Add your OpenAI API key as a secret:
     ```bash
     npx supabase secrets set OPEN_AI_KEY=your-openai-api-key
     ```

3. **Configure environment**
   Create `.env.local`:

   ```
   OPENAI_API_KEY=your-openai-api-key
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   SUPABASE_DB_URL=your-database-url
   ```

4. **Start developing**
   ```bash
   npm run dev
   ```

## 🎯 How to use

1. **Enter a topic** in the text box (try "Future of transportation" or "Learning to cook")
2. **Click the green arrow** to generate AI-powered subtopics
3. **Click any subtopic's arrow** to explore that branch further
4. **Add custom topics** with the "+" button
5. **Clear everything** with the "Clear" button when you want to start over

## 🛠️ Built with

- **React 18** + **TypeScript** - Frontend framework
- **Supabase** - Backend and edge functions
- **OpenAI GPT-4** - AI content generation
- **Tailwind CSS** - Styling
- **Framer Motion** - Smooth animations

## 📁 Project structure

```
src/
├── components/          # UI components
│   ├── TreeNode.tsx    # Individual tree nodes
│   └── CenteredTreeViewer.tsx  # Main tree container
├── hooks/              # Business logic
│   ├── useTreeState.ts # Tree state management
│   └── useOpenAIChildren.ts    # AI integration
├── context/            # Global state
└── lib/                # Utilities and API integration
supabase/
└── functions/          # Edge functions for AI processing
```

## 🔧 Available commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🚀 Deployment

1. **Build the project**

   ```bash
   npm run build
   ```

2. **Deploy to any static host** (Vercel, Netlify, etc.)

3. **Set environment variables** in your hosting platform

## 🤝 Contributing

Feel free to open issues or submit pull requests! This is an experimental project and improvements are welcome.

## 👨‍💻 About

Created by **Dennis Hansen** - [Twitter/X](https://x.com/dennizor) | [GitHub](https://github.com/dennishansen)

---

**Explore any topic. Discover new connections. Powered by AI.** 🌳
