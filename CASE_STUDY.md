# FocusFlow Case Study

## Project Overview

**FocusFlow** is a mood-aware productivity app designed to help users build healthier focus habits by combining a focus timer, task management, mood check-in, and progress analytics.

The app is built as a mobile-first productivity tool for students, developers, and creators who want to manage their tasks more intentionally while considering their current mood and energy level.

---

## Background

Many students, developers, and creators struggle to stay focused consistently. The issue is not always caused by laziness or poor discipline. In many cases, productivity is affected by mood, energy, task difficulty, and lack of clear starting points.

Traditional productivity tools usually focus on either task lists or timers. However, they often do not help users understand how their emotional state affects their ability to focus.

FocusFlow was created to explore a more human-centered productivity experience by connecting three important elements:

- What the user needs to do
- How the user currently feels
- How much focused work the user has completed

---

## Problem Statement

Many users want to be productive but often feel overwhelmed when starting their tasks. A normal to-do list can show what needs to be done, but it does not guide users on how to start or how long they should focus based on their current condition.

At the same time, a basic Pomodoro timer helps users work in time blocks, but it does not connect focus sessions to task progress or mood patterns.

**FocusFlow aims to solve this gap by helping users manage tasks, start focus sessions, track mood, and visualize progress in one simple mobile-first app.**

---

## Target Users

FocusFlow is designed for:

- Students working on assignments or personal projects
- Junior developers learning or building portfolio projects
- Digital creators managing creative tasks
- Users who want a simple productivity tool without complex setup
- Users who need a more mindful way to stay focused

---

## User Pain Points

The main pain points identified for this project are:

1. Users often do not know where to start when they have many tasks.
2. Users may feel pressured by productivity tools that ignore mood and energy.
3. To-do lists do not show how much focused effort has been spent on each task.
4. Timer apps usually do not connect completed sessions to task progress.
5. Users need simple feedback to feel motivated after completing a focus session.
6. Users want a mobile-friendly productivity tool that feels lightweight and modern.

---

## Product Goals

The goals of FocusFlow are:

- Help users start a focus session more easily
- Connect focus sessions with real task progress
- Encourage users to check in with their mood before working
- Provide visual feedback after completing a session
- Make productivity tracking simple and understandable
- Create a mobile-first app experience that can be installed as a PWA

---

## Solution

FocusFlow combines several productivity features into one experience:

1. **Mood Check-In**  
   Users can record how they feel before starting a session. The app gives a session suggestion based on the selected mood.

2. **Focus Timer**  
   Users can choose between 25, 45, and 60-minute focus sessions.

3. **Task Connection**  
   Users can select a task before starting the timer. When the session ends, the selected task progress is automatically updated.

4. **Task Progress Tracking**  
   Each task can have a target number of focus sessions. Once the target is reached, the task can be automatically marked as completed.

5. **Break System**  
   The app supports short breaks, long breaks, and automatic break start after a focus session.

6. **Analytics**  
   Users can view focus minutes, completed sessions, task completion, and mood-session patterns.

7. **Settings**  
   Users can customize their name, default focus duration, break duration, long break interval, sound, and notification preferences.

8. **PWA Support**  
   The app includes a manifest and service worker, making it ready to be installed on supported devices after deployment.

---

## Key Features

### 1. Onboarding

The onboarding introduces the app's main purpose to new users:

- Focus with intention
- Mood-aware productivity
- Track focus rhythm

This helps users understand the value of the app before entering the main screen.

---

### 2. Mood Check-In

Users can choose their current mood from five options:

- Stressed
- Tired
- Neutral
- Good
- Pumped

Each mood provides a different session suggestion. This creates a more personalized focus experience.

---

### 3. Focus Timer

The timer supports:

- 25-minute session
- 45-minute session
- 60-minute session
- Pause and reset
- Short break
- Long break
- Auto-start break
- Sound alert
- Browser notification

The timer is designed to be simple and focused, with a large countdown display and clear session status.

---

### 4. Task Management

Users can:

- Add tasks
- Edit tasks
- Delete tasks
- Mark tasks as completed
- Set category
- Set priority
- Set due date
- Set target focus sessions

This makes the task system more useful than a basic checklist.

---

### 5. Task and Timer Integration

A key feature of FocusFlow is the connection between tasks and the timer.

When a user completes a focus session, the selected task automatically receives progress. If the task reaches its target session count, it is marked as completed.

This helps users see that progress is not only about finishing a task, but also about the focused effort spent on it.

---

### 6. Analytics

The analytics page displays:

- Total focus sessions
- Total focus minutes
- Completed tasks
- Weekly focus activity
- Mood and session relationship
- Task progress by category

An empty state is also shown when there is no session data yet.

---

### 7. Settings

Users can customize:

- User name
- Default focus duration
- Short break duration
- Long break duration
- Long break interval
- Default task target
- Auto-start break
- Sound alert
- Browser notification

The settings page gives users control over their own productivity flow.

---

### 8. PWA Support

FocusFlow includes:

- Web app manifest
- Service worker
- App icons
- Mobile-first responsive behavior

After deployment, the app can be installed on supported browsers and opened from the home screen.

---

## Design Direction

FocusFlow uses a **modern dark glassmorphism** visual style.

The design direction focuses on:

- Calm dark background
- Soft gradients
- Glass-like cards
- Rounded corners
- Subtle borders
- Clear visual hierarchy
- Mobile-first layout

The goal is to make the app feel modern, focused, and comfortable to use for long periods.

---

## UI/UX Considerations

Several UX decisions were made to improve the user experience:

### Mobile-First Layout

The app is designed primarily for mobile use. On desktop, the app appears inside a phone mockup. On mobile, it becomes fullscreen for a more native-like experience.

### Clear Starting Point

The home screen gives users a quick way to start a focus session and see their current task progress.

### Mood-Based Recommendation

The mood check-in encourages users to choose a session length that fits their current condition.

### Visual Feedback

Confetti and toast messages provide positive reinforcement after a completed focus session.

### Empty States

Empty states help users understand what to do when there is no data yet.

### Customization

Settings allow users to adjust the app according to their preferred working style.

---

## Development Process

The development process focused on turning FocusFlow into a complete and usable productivity app.

Several important improvements were added during development:

- Persistent data storage using `localStorage`
- Add, edit, and delete task functionality
- Task priority and due date
- Target focus sessions for each task
- Timer integration with task progress
- Automatic task completion when the focus target is reached
- Short break and long break system
- Auto-start break option
- Sound alert and browser notification
- Confetti animation after completing a focus session
- Onboarding for new users
- Settings page for personalization
- Empty state for analytics
- PWA support with manifest and service worker
- Fullscreen mobile layout with safe-area handling for iPhone screens

These refinements helped make the app more complete, practical, and suitable as a portfolio project.

---

## Technical Implementation

FocusFlow was built using:

- React
- Vite
- JavaScript
- LocalStorage
- CSS-in-JS
- Web Notification API
- Web Audio API
- PWA manifest
- Service worker

The app currently uses local storage instead of a backend, which keeps the project lightweight and easy to run.

---

## Data Persistence

The app stores user data locally using `localStorage`.

Stored data includes:

- Tasks
- Focus sessions
- Mood check-in
- Settings
- Onboarding status

This allows the app to keep user data even after refreshing the browser.

---

## Challenges

Some challenges during development included:

### 1. Making the App Feel Native on Mobile

The app needed to look like a phone mockup on desktop but become fullscreen on mobile. This required responsive layout handling and safe-area adjustment for iPhone screens.

### 2. Connecting Timer and Task Progress

The timer needed to update the selected task after a completed session. This required a clear relationship between task data and session data.

### 3. Handling Mood Data Per Day

Mood data should not reset on every refresh, but it should still be treated as daily data. This was solved by saving the mood together with the current date.

### 4. Making the App PWA-Ready

To make the app installable, manifest and service worker files were added.

---

## What I Learned

Through this project, I learned how to:

- Build a complete React app with multiple screens
- Manage state across different features
- Store persistent data using LocalStorage
- Connect timer logic with task progress
- Design a mobile-first user experience
- Create a PWA-ready project structure
- Improve a product through feature refinement
- Think about productivity from a more human-centered perspective

---

## Future Improvements

Future improvements that can be added include:

- User authentication
- Cloud sync
- Multi-device synchronization
- Calendar integration
- Task reminder notifications
- Custom focus presets
- More detailed analytics
- Productivity report export
- Dark and light theme switcher
- AI-based focus recommendation
- Real user testing and usability feedback

---

## Conclusion

FocusFlow is a productivity app that combines task management, focus sessions, mood awareness, and analytics into one mobile-first experience.

The project demonstrates how productivity tools can be more personal and supportive by considering not only what users need to do, but also how they feel when doing it.

FocusFlow was built as a portfolio project to explore product thinking, UI/UX design, React development, and PWA implementation.

---

## Author

Created by **I Komang Elian Triananda Kusuma**

GitHub: [komangeliann](https://github.com/komangeliann)