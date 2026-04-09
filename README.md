# Public API Playground

A modern, responsive dashboard to explore various public APIs. Built with HTML, CSS, and Vanilla JavaScript.

## 🚀 Features
- **6 Integrated APIs**: 
  - **Dog Finder**: Random dog images and breeds.
  - **Random Image**: Random high-quality images from API Ninjas.
  - **Random User**: Detailed random persona profiles.
  - **Joke Generator**: Random jokes to brighten your day.
  - **Emoji Finder**: Search for any emoji by name.
  - **Animal Finder**: Search for detailed animal taxonomy and facts.
- **Modern UI**: Clean cards, responsive grid, and smooth animations.
- **Interactive Elements**: Copy-to-clipboard buttons and dynamic fetching.
- **Robust Logic**: Async/Await fetch calls with loading spinners and error handling.

## 🛠️ Setup & Deployment

### Local Development
To test all APIs locally, please use a local development server (e.g., **Live Server** extension in VS Code or `npx serve`) instead of opening `index.html` directly in the browser. This avoids **CORS** restrictions.

### API Keys & Security

> [!CAUTION]
> **Secret Rotation Required**: Your API key was previously committed to GitHub history. To ensure your account is secure, please **rotate your API key** in the [API Ninjas Dashboard](https://api-ninjas.com/profile) and update your `.env` file with the new one.

#### Local Setup
1. Create a `.env` file in the root directory (already created for you).
2. Add your keys:
   ```env
   NINJAS_API_KEY=your_new_key_here
   ```
3. Since this is a vanilla JavaScript project, browser-side code cannot natively read `.env` files. For local testing, you can temporarily add your key to `script.js`, but **do not commit it**.
4. For production (Netlify/Vercel), add `NINJAS_API_KEY` to your environment variables in the site settings dashboard.

#### Using with a Bundler (Recommended)
If you want to use the `.env` file locally, consider adding **Vite** to this project:
```bash
npm create vite@latest ./ --template vanilla
```
Vite will automatically load variables prefixed with `VITE_` and make them available via `import.meta.env`.

### Deployment
This project is ready for one-click deployment to **Netlify** or **Vercel**. Simply upload the `index.html`, `style.css`, and `script.js` files.

## 📂 File Structure
- `index.html`: Main layout and structure.
- `style.css`: Modern design system and responsiveness.
- `script.js`: API fetching logic and UI updates.
