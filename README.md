# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Deployment with Firebase Hosting

This project is configured to deploy to Firebase Hosting. Follow these steps to deploy:

### Prerequisites
- Install Firebase CLI: `npm install -g firebase-tools`
- Login to Firebase: `firebase login`

### Deployment Steps

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase Hosting:**
   ```bash
   firebase deploy --only hosting
   ```

### Configuration Details

- **Build Output:** Vite builds the React app to the `dist/` directory
- **Firebase Configuration:** `firebase.json` points to `dist/` as the public directory
- **SPA Routing:** All routes are redirected to `/index.html` to support client-side routing

### Local Development

- **Development server:** `npm run dev`
- **Build preview:** `npm run preview` (serves the built app locally)
- **Linting:** `npm run lint`
