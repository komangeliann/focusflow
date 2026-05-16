# FocusFlow

**FocusFlow** is a mood-aware productivity app that combines a focus timer, task management, mood check-in, and progress analytics to help users build healthier and more intentional focus habits.

This app is designed for students, developers, and creators who often struggle to stay focused because their energy, mood, and task priorities change from day to day.

---

## Overview

Most productivity apps only focus on tasks or timers. FocusFlow takes a more human-centered approach by combining focus sessions, mood tracking, task priority, and progress visualization in one simple mobile-first experience.

The goal of FocusFlow is to help users not only finish tasks, but also understand their personal productivity rhythm.

---

## Problem Statement

Many students and young digital workers find it difficult to stay productive consistently. The problem is not always a lack of motivation, but often a mismatch between task difficulty, emotional state, and available energy.

Traditional to-do lists help users remember tasks, but they do not guide users on how to start, how long to focus, or how their mood affects productivity. FocusFlow was created to solve this gap by combining task planning, focus timing, and mood awareness.

---

## Key Features

### Focus Timer

- 25, 45, and 60-minute focus sessions
- Short break timer
- Long break after several focus sessions
- Auto-start break option
- Sound alert when a session ends
- Visual feedback with confetti animation

### Task Management

- Add new tasks
- Edit existing tasks
- Delete tasks
- Mark tasks as completed
- Set task priority: Low, Medium, High
- Add due dates
- Set target focus sessions for each task
- Connect a task to the focus timer
- Automatically update task progress after each completed focus session

### Mood Check-In

- Daily mood tracking
- Mood-based session suggestions
- Mood data is saved per day
- Helps users choose a realistic focus session based on their current condition

### Analytics

- Weekly focus minutes
- Total completed sessions
- Task completion overview
- Mood and focus session summary
- Empty state for new users

### Personal Settings

- Change user name
- Set default focus duration
- Adjust short break duration
- Adjust long break duration
- Set long break interval
- Enable or disable sound
- Enable browser notifications
- Reset app data

### Progressive Web App Support

- Web app manifest included
- Service worker included
- App icons included
- Installable on supported browsers after deployment

---

## Design Direction

FocusFlow uses a modern dark glassmorphism interface with soft gradients, rounded cards, subtle borders, and a mobile-first layout.

The visual style is designed to feel:

- Calm
- Focused
- Modern
- Lightweight
- App-like on mobile devices

On desktop, the app is displayed inside a phone mockup. On mobile devices, the app automatically becomes fullscreen for a more native-like experience.

---

## Tech Stack

- React
- Vite
- JavaScript
- CSS-in-JS
- LocalStorage
- Progressive Web App support

---

## Project Structure

```txt
focusflow/
├── public/
│   ├── icon.svg
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── manifest.json
│   └── sw.js
├── src/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── CASE_STUDY.md
├── README.md
├── index.html
├── package.json
└── vite.config.js
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/komangeliann/focusflow.git
```

### 2. Open the project folder

```bash
cd focusflow
```

### 3. Install dependencies

```bash
npm install
```

### 4. Run the development server

```bash
npm run dev
```

Open the local URL shown in the terminal.

---

## Build for Production

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

---

## Run on Mobile Device

Make sure your laptop and phone are connected to the same Wi-Fi network.

```bash
npm run dev -- --host 0.0.0.0
```

Then open the network URL on your phone, for example:

```txt
http://192.168.1.10:5173
```

---

## PWA Installation

After the app is deployed, it can be installed on supported devices.

### Android / Chrome

Open the deployed link, tap the browser menu, then choose:

```txt
Add to Home screen
```

### iPhone / Safari

Open the deployed link in Safari, tap the Share button, then choose:

```txt
Add to Home Screen
```

For the best fullscreen experience on iPhone, open the app from the Home Screen after installation.

---

## Case Study

A detailed product case study is available in:

```txt
CASE_STUDY.md
```

The case study covers:

- Problem statement
- Target users
- User pain points
- Design direction
- Feature decisions
- Iteration from V1 to V2
- Future improvements

---

## Development Notes

FocusFlow stores data locally using `localStorage`, including:

- Tasks
- Focus sessions
- Mood check-ins
- User settings
- Onboarding status

This means the app can be used without a backend, but data is stored only on the current device and browser.

---

## Future Improvements

- Cloud sync
- User authentication
- More detailed analytics
- Calendar integration
- Custom focus session presets
- Task reminder notifications
- Dark and light theme switcher
- Export productivity report
- Multi-device synchronization

---

## Author

Created by **I Komang Elian Triananda Kusuma**

- GitHub: [komangeliann](https://github.com/komangeliann)

---

## License

This project was created for learning, portfolio, and personal productivity purposes.