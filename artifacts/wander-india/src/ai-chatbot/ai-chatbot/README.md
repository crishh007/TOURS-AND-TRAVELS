# 🤖 AI Chatbot — React JS + Google Gemini

A sleek, dark-themed AI chatbot powered by **Google Gemini 1.5 Flash** (free tier), built with React JS.

---

## ✨ Features

- 💬 **Real AI Chat** — Powered by Google Gemini 1.5 Flash
- 🎨 **Dark Gold Theme** — Elegant dark UI with golden accents
- 📱 **Responsive Design** — Works on desktop and mobile
- ⌨️ **Keyboard Shortcuts** — Enter to send, Shift+Enter for new line
- 🧠 **Conversation Memory** — Maintains full chat history per session
- 🗑️ **Clear Chat** — Reset conversation anytime
- ⚡ **Typing Indicator** — Animated dots while AI responds
- 🛡️ **Error Handling** — Clear error messages for API issues

---

## 🚀 Quick Start

### Step 1 — Get a FREE Gemini API Key

1. Go to: **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key

### Step 2 — Configure the API Key

Open the `.env` file and replace the placeholder:

```
REACT_APP_GEMINI_API_KEY=your_actual_api_key_here
```

### Step 3 — Install Dependencies

```bash
npm install
```

### Step 4 — Run the App

```bash
npm start
```

The app will open at **http://localhost:3000** 🎉

---

## 📁 Project Structure

```
ai-chatbot/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ChatWindow.js       # Main chat UI
│   │   ├── ChatWindow.css
│   │   ├── MessageBubble.js    # Individual message
│   │   ├── MessageBubble.css
│   │   ├── TypingIndicator.js  # Animated dots
│   │   └── TypingIndicator.css
│   ├── services/
│   │   └── gemini.js           # Gemini API integration
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── .env                        # ← Add your API key here
├── package.json
└── README.md
```

---

## 🔧 Customization

| What | Where |
|------|-------|
| Change AI personality | Edit the `INITIAL_MESSAGE` in `ChatWindow.js` |
| Change colors | Edit CSS variables in `src/index.css` |
| Change model | Edit `API_URL` in `src/services/gemini.js` |
| Add system prompt | Prepend a system message in `gemini.js` |

---

## 📦 Build for Production

```bash
npm run build
```

Output will be in the `build/` folder — ready to deploy to any static host (Netlify, Vercel, GitHub Pages).

---

## 🆓 Gemini API Free Tier Limits

- **15 requests/minute**
- **1 million tokens/day**
- Completely free — no credit card required

---

## 🛠 Tech Stack

- **React 18** — UI framework
- **Google Gemini 1.5 Flash** — AI model
- **CSS Variables** — Theming system
- **Google Fonts** — Syne + Space Mono
