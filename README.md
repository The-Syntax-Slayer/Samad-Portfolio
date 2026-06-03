# 👑 Samad Shaikh | Interactive Software Engineer & AI Specialist Portfolio

An ultra-premium, interactive developer portfolio showcasing advanced engineering skills, custom animations, embedded hacker terminals, and an integrated Conversational AI Assistant.

---

## ✨ Features & Interactive Modules

1. **⚡ Custom Ambient Theme Switcher**
   - A floating settings portal allowing users to swap the portfolio's accent color in real-time.
   - Dynamic configurations: **Mint Spark**, **Cyberpunk Pink**, **Electric Cyan**, and **Amber Gold**.

2. **🌌 Interactive Particle Background**
   - High-performance HTML5 Canvas constellation network that tracks mouse movement and matches your selected accent color.

3. **📟 Developer System Boot Loader**
   - Futuristic fullscreen booting terminal on first visit, showing system checks, loading files, and diagnostics before revealing the portfolio. Utilizes session caching for seamless navigation.

4. **🤖 Google Gemini-Powered Chatbot (SyntaxAgent)**
   - Integrated floating AI assistant running on the fast, low-latency **Gemini 2.5 Flash** model. 
   - Dynamically answers professional context, bio, skills, and project queries, falling back to local regex NLP matching if needed.

5. **🖥️ Hacker Command-Line Terminal**
   - Retro command line embedded in the Bento grid interface. Run commands like `help`, `about`, `skills`, `projects`, `contact`, `clear`, and a `secret` matrix raining overlay!

6. **🗺️ bandra Custom Map Interface**
   - Seamlessly integrated Google Maps location pin of Bandra West, Mumbai, custom-filtered with CSS neon-blue blueprint styles to match the dark theme aesthetic.

7. **💫 Smooth Lenis Inertial Scrolling**
   - Hardware-accelerated, buttery smooth inertial scrolling using Lenis, coupled with dynamic horizontal scrolling bento panels for desktop users.

---

## 🛠️ Technology Stack

* **Core**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Animations**: [Framer Motion](https://www.framer.com/motion/) & HTML5 Canvas API
* **APIs & Libraries**: [Lenis Scroll](https://lenis.darkroom.engineering/), [Google Gemini API](https://ai.google.dev/), [Lucide React Icons](https://lucide.dev/)

---

## 🚀 Setup & Local Installation

### 1. Clone the repository
```bash
git clone https://github.com/The-Syntax-Slayer/Samad-Portfolio.git
cd Samad-Portfolio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory and insert your Gemini API Key from [Google AI Studio](https://aistudio.google.com/):
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

---

## 📁 Repository Structure

```
PORTFOLIO/
├── public/                 # Static assets, vector icons & favicons
├── src/
│   ├── assets/             # Images, portraits, and resume files
│   ├── components/
│   │   ├── AIAssistant.tsx         # Gemini 2.5 Chatbot window
│   │   ├── About.tsx               # Tech skills bento & Bio
│   │   ├── BootLoader.tsx          # Startup CLI animation
│   │   ├── Connect.tsx             # Contact layout & social links
│   │   ├── Footer.tsx              # Page footer & brand details
│   │   ├── Home.tsx                # Hero, custom Map, Bento frame, Terminal
│   │   ├── ParticleBackground.tsx  # Dynamic Canvas particles
│   │   ├── Play.tsx                # Extra playground module (if active)
│   │   ├── TerminalConsole.tsx     # Hacker console input logic
│   │   ├── ThemeSwitcher.tsx       # Accent theme portal switcher
│   │   └── Work.tsx                # Desktop Horizontal/Mobile Vertical scroll list
│   │
│   ├── App.tsx             # Entry point wrapping Lenis smooth scroll
│   ├── index.css           # Custom glassmorphism, animations & design system
│   └── main.tsx            # DOM initialization
```

---

## 📧 Contact & Links

* **Name**: Samad Shaikh
* **Email**: [sxmxd.1825@gmail.com](mailto:sxmxd.1825@gmail.com)
* **LinkedIn**: [linkedin.com/in/samad-ai](https://linkedin.com/in/samad-ai)
* **GitHub**: [github.com/The-Syntax-Slayer](https://github.com/The-Syntax-Slayer)
