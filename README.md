# 🎂 Interactive Birthday Wish & Cake App (생일 축하 카드 & 케이크)

An interactive, multi-language (Korean, English, Burmese) birthday greeting application with background music, candle blowing interactivity, custom wishes, floating star wishes, and downloadable photo cards!

---

## ✨ Key Features

- **🌐 Multi-Language Support**: Switch seamlessly between Korean (한국어), English, and Burmese (မြန်မာ) with a single click in the top toolbar.
- **🎵 BGM & Audio Controls**: Background birthday melody and interactive sound effects.
- **🎂 Interactive Cake & Candle Blowing**: Write a secret wish, light candles, and blow them out (or click to extinguish them).
- **🌟 Floating Star Wish Sky**: Watch your wish float into the starry night sky inside a glowing bubble.
- **🖼️ Downloadable Photo Card**: Save your personalized birthday card as an image directly to your device or photo gallery.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (version 18 or higher) installed on your system.

### 2. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
cd YOUR_REPOSITORY_NAME
npm install
```

### 3. Run Locally
Start the development server:

```bash
npm run dev
```
Open your browser at `http://localhost:3000` (or the local URL shown in your terminal).

---

## 📦 Building for Production

To create an optimized production build:

```bash
npm run build
```

The compiled static files will be placed inside the `dist/` directory.

---

## 🌐 Free Hosting / Deployment Options

### Option A: Vercel or Netlify (Recommended)
1. Push your code to GitHub.
2. Sign in to [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
3. Import your GitHub repository.
4. Leave build settings as default:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**!

### Option B: GitHub Pages
1. Push your repository to GitHub.
2. Go to **Settings > Pages** in your GitHub repository.
3. Under **Source**, select `GitHub Actions` or `Deploy from a branch` (select `main` branch and `/dist` folder if built).

---

## 📄 License

Distributed under the MIT License.
