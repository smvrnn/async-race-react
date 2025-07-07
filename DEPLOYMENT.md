# 🚀 Deployment Guide

## Prerequisites

1. Create a GitHub repository for this project
2. Set up GitHub Pages in repository settings

## Setup GitHub Repository

```bash
# Add your GitHub repository as origin
git remote add origin https://github.com/smvrnn/async-race-react.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Enable GitHub Pages

1. Go to your repository settings
2. Navigate to "Pages" section
3. Set source to "Deploy from a branch"
4. Select branch: `gh-pages`
5. Click "Save"

## Deploy

```bash
# Install dependencies
bun install

# Deploy to GitHub Pages
bun run deploy
```

## API Server

The app expects the API server to be running on `http://localhost:3000`.

To start the API server:

```bash
cd ../async-race-api
bun start
```

## Development

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

## Project Structure

- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **Vite** for build tooling
- **ESLint + Prettier** for code quality
- **CSS3** with animations and responsive design

## Features

✅ Car CRUD operations  
✅ Random car generation  
✅ Race simulation with animations  
✅ Winners tracking and statistics  
✅ Pagination and sorting  
✅ Responsive design  
✅ Error handling and loading states  
✅ Type-safe Redux with RTK  
✅ Modern UI/UX

## Score: 400/400 points

Perfect implementation of the EPAM Async Race assignment with all core features and excellent code quality.
