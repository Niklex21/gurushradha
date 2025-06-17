# Gurushradha Website

A modern, responsive website built with Astro for showcasing cultural activities, events, and Instagram content.

## 🚀 Features

- **Static Site Generation** with Astro for fast performance
- **Instagram Integration** with automatic token refresh (zero maintenance)
- **Responsive Design** with Tailwind CSS
- **Type-Safe** development with TypeScript
- **Component Library** with shadcn/ui components
- **SEO Optimized** with proper meta tags and structure

## 📸 Instagram Integration

This site includes a robust, zero-maintenance Instagram integration that:

- ✅ **Automatically refreshes** access tokens every 30 days via GitHub Actions
- ✅ **No database required** - stateless approach
- ✅ **No manual intervention** needed once set up
- ✅ **Works with static hosting** (Vercel, Netlify, etc.)

For setup instructions, see [SIMPLE_SETUP.md](./SIMPLE_SETUP.md).

## �️ Development

### Prerequisites

- Node.js 18+ or Bun
- Instagram Business Account (for Instagram integration)

### Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd gurushradha
   bun install  # or npm install
   ```

2. **Environment setup:**
   ```bash
   cp .env.example .env
   # Add your Instagram token (see SIMPLE_SETUP.md)
   ```

3. **Start development server:**
   ```bash
   bun dev  # or npm run dev
   ```

   Open [http://localhost:4321](http://localhost:4321) in your browser.

### Commands

| Command | Action |
|---------|--------|
| `bun dev` | Start development server |
| `bun build` | Build for production |
| `bun preview` | Preview production build |
| `bun astro ...` | Run Astro CLI commands |

## 📁 Project Structure

```
/
├── .github/workflows/          # GitHub Actions for token refresh
├── src/
│   ├── components/            # Reusable components
│   ├── layouts/              # Page layouts
│   ├── pages/                # Routes and pages
│   ├── lib/                  # Utility functions
│   └── styles/               # Global styles
├── public/                   # Static assets
└── documentation/            # Setup guides
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Add environment variables** in Vercel dashboard:
   ```
   INSTAGRAM_LONG_LIVED_TOKEN=your_token_here
   ```
3. **Deploy** - Vercel will automatically build and deploy

### Other Platforms

This static site can be deployed to any platform that supports Astro:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting provider

## 📚 Documentation

- [Simple Instagram Setup](./SIMPLE_SETUP.md) - Main setup guide
- [Instagram Setup Overview](./INSTAGRAM_SETUP.md) - Quick reference
- [Meta App Production Config](./META_APP_PRODUCTION.md) - Facebook app setup

## � Technology Stack

- **Framework**: [Astro](https://astro.build)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Components**: [shadcn/ui](https://ui.shadcn.com)
- **Language**: TypeScript
- **Deployment**: Vercel / Netlify
- **CI/CD**: GitHub Actions

## 📄 License

This project is for the Gurushradha cultural organization.

---

**Need help?** Check the documentation files or open an issue.
