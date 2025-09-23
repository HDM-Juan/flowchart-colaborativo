# Flowchart Colaborativo

A collaborative flowchart application built with React and Vite, deployed on Firebase Hosting.

## Features

- React-based flowchart editor
- Firebase integration for data persistence
- Real-time collaborative editing capabilities

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Run linting:
   ```bash
   npm run lint
   ```

## Building and Deployment

### Build for Production

Build the application for production:
```bash
npm run build
```

This creates a `dist` folder with the production-ready React app.

### Firebase Deployment

The app is configured to deploy to Firebase Hosting:

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy to Firebase (requires Firebase CLI):
   ```bash
   firebase deploy
   ```

The Firebase configuration in `firebase.json` is set to:
- Serve files from the `dist` directory (Vite build output)
- Route all requests to `/index.html` for single-page app routing
- Ignore Firebase default files and node_modules

## Vite Configuration

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
