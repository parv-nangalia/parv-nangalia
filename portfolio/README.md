# Interactive 3D Showcase

A 3D interactive portfolio built with React, Three.js, Vite, and TypeScript.

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- pnpm (v9+)

### Installation

```bash
pnpm install
```

### Local Development

**Start the development server:**
```bash
pnpm dev
```

The portfolio will be available at: http://localhost:5173

## 🏗️ Building for Production

**Build for production:**
```bash
pnpm build
```

**Preview production build:**
```bash
pnpm preview
```

## 🌐 GitHub Pages Deployment

This project automatically deploys to GitHub Pages on push to `main`.

### Initial Setup

1. **Enable GitHub Pages:**
   - Go to repository **Settings > Pages**
   - Set **Source** to "GitHub Actions"
   - Set **Branch** to "main"

2. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Monitor Deployment:**
   - Go to **Actions** tab
   - Check the "Deploy to GitHub Pages" workflow
   - Site will be live at: `https://your-username.github.io/your-repo-name/`

## 📦 Available Scripts

```bash
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm preview          # Preview production build
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 + TypeScript
- **3D Graphics**: Three.js + React Three Fiber + React Three Drei
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Component Library**: Radix UI
- **Animation**: Framer Motion

## 🔧 Troubleshooting

### pnpm not installed
```bash
npm install -g pnpm
# or
corepack enable pnpm
```

### Build fails
Ensure all dependencies are installed:
```bash
pnpm install --frozen-lockfile
```

### GitHub Pages shows 404
1. Check that the workflow succeeded in the Actions tab
2. Ensure GitHub Pages is enabled in Settings > Pages

## 📝 License

MIT

## 📧 Support

For issues or questions, open an issue in the GitHub repository.
