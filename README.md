# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Deploy to Netlify

This project is configured for deployment on Netlify. To deploy:

1. **Automatic deployment (recommended):**
   - Connect your GitHub repository to Netlify
   - Netlify will automatically detect the configuration from `netlify.toml`
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Manual deployment:**
   - Run `npm run build` to build the project
   - Upload the `dist/` folder to Netlify

The `netlify.toml` configuration file handles build settings and SPA routing automatically.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
