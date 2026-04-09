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

#### Local Setup (Development)
1. The project now uses an optional `config-local.js` file for local testing.
2. I have already created a `config-local.js` for you with your current key.
3. This file is listed in `.gitignore`, so it will **never be pushed to GitHub**.

#### Production Setup (Netlify / Vercel)
Since this is a vanilla site without a build tool like Vite, we use **Build-Time Injection**:
1. Go to your site's **Environment Variables** dashboard.
2. Add a variable named `NINJAS_API_KEY` with your real API key.
3. Change your **Build Command** to the following:
   ```bash
   sed -i '' "s/__NINJAS_API_KEY__/$NINJAS_API_KEY/g" script.js
   ```
   *Note: If you are on a Linux-based builder (common on Netlify), use `sed -i` instead of `sed -i ''`.*
4. Set the **Publish Directory** to `.` (or leave it blank).

### Deployment
This project is ready for one-click deployment to **Netlify** or **Vercel**. Simply upload the `index.html`, `style.css`, and `script.js` files.

## 📂 File Structure
- `index.html`: Main layout and structure.
- `style.css`: Modern design system and responsiveness.
- `script.js`: API fetching logic and UI updates.
