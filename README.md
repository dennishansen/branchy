# Branchy

An AI-powered interactive tree visualization tool that helps you explore topics by generating branching content. Start with any topic, click to expand, and watch as AI generates related subtopics that branch out into an explorable knowledge tree.

![Branchy Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Branchy-blue?style=for-the-badge)

## ✨ Features

- **AI-Powered Exploration**: Uses OpenAI's GPT-4 to intelligently generate subtopics and categories
- **Interactive Tree Navigation**: Click arrows to expand nodes and explore deeper into topics
- **Streaming Content Generation**: Real-time content streaming as AI generates responses
- **Smart Centering**: Automatically centers the tree view as it expands horizontally
- **Topic Suggestions**: Get inspired with random interesting starting topics
- **Clean UI**: Modern, responsive interface built with React and Tailwind CSS
- **Flexible Tree Management**: Add custom nodes, regenerate content, or clear the entire tree

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd branchy-text-tree-view
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```bash
   VITE_OPENAI_API_KEY=your-openai-api-key-here
   ```

   Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to start exploring!

## 🎯 How to Use

1. **Start with a topic**: Enter any topic you want to explore in the root text area
2. **Expand to explore**: Click the purple arrow button to generate AI-powered subtopics
3. **Go deeper**: Click on any subtopic's arrow to explore further down that branch
4. **Add custom nodes**: Use the "+" button to add your own custom subtopics
5. **Regenerate content**: If expanded content doesn't match after editing, click the refresh icon
6. **Start over**: Use the "Clear" button to reset the entire tree

### Example Starting Topics

- "Maximize human flourishing"
- "Industries of the world"
- "The future of education"
- "Building sustainable cities"
- "AI's long-term societal impact"

## 🛠️ Built With

### Core Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling

### UI Components

- **Radix UI** - Accessible component primitives
- **Shadcn/ui** - Pre-built component library
- **Framer Motion** - Smooth animations
- **Lucide React** - Icon library

### AI Integration

- **OpenAI API** - GPT-4 powered content generation
- **Streaming responses** - Real-time content delivery

### State Management

- **React Context** - Global state management
- **Custom hooks** - Modular business logic
- **useReducer** - Predictable state updates

## 📁 Project Structure

```
src/
├── components/
│   ├── CenteredTreeViewer.tsx    # Main tree container with centering
│   ├── TreeNode.tsx              # Individual tree node component
│   └── ui/                       # Reusable UI components
├── context/
│   └── TreeContext.tsx           # Global tree state management
├── hooks/
│   ├── useOpenAIChildren.ts      # AI content generation logic
│   ├── useTreeState.ts           # Tree state management
│   └── useTreeScroll.ts          # Auto-scrolling functionality
├── lib/
│   ├── openai.ts                 # OpenAI API integration
│   └── utils.ts                  # Utility functions
└── pages/
    ├── Index.tsx                 # Main application page
    └── NotFound.tsx              # 404 page
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🚀 Deployment

The project is configured for easy deployment:

1. **Build the project**

   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your preferred hosting service:

   - Vercel
   - Netlify
   - GitHub Pages
   - Any static hosting provider

3. **Set environment variables** in your hosting platform with your OpenAI API key

## 🔒 Environment Variables

| Variable              | Description                                | Required |
| --------------------- | ------------------------------------------ | -------- |
| `VITE_OPENAI_API_KEY` | Your OpenAI API key for content generation | Yes      |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Dennis Hansen**

- Twitter/X: [@dennizor](https://x.com/dennizor)
- GitHub: [dennishansen](https://github.com/dennishansen)

## 🙏 Acknowledgments

- OpenAI for the powerful API that makes intelligent content generation possible
- The React community for excellent tooling and libraries
- Radix UI team for accessible component primitives
- Tailwind CSS team for the utility-first CSS framework

---

**Explore any topic. Discover new connections. Built with AI.** 🌳
