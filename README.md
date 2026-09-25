# 🏥 AI Medical Assistance Bot

A comprehensive, modern React application designed to provide users with a clean, trustworthy, and premium healthcare portal. It features an interactive AI symptom checker, health chat, a medical tips library, and an emergency response protocol.

## ✨ Features

- 💬 **AI Symptom & Health Chat:** Chat with a simulated AI bot to ask health questions or get simple explanations for complex medical terms. Includes a real-time keyword scanner to escalate potential emergencies.
- 🩺 **Interactive Symptom Checker:** Select symptoms from a structured catalog to receive home-care advice, urgency levels, or clinic suggestions.
- 📚 **Health Tips Library:** Browse or search categorized articles about daily habits, mental wellness, and common illnesses. Includes an Admin CMS for creating and managing articles.
- 👤 **Manage Profile:** Users can update their age, gender, allergies, and current medications to help MedBot customize answers.
- 🚑 **Emergency Protocol:** A dedicated safety screen that provides national support hotlines (Poison Control, Mental Health Crisis) and a nearby hospital locator using GPS or Zip Code simulation.
- 🔔 **Reminders Dashboard:** Track daily medication schedules and upcoming doctor appointments directly from the home screen.

## 🏗️ System Architecture

MedBot is built using a **4-Tier Clean Modular Architecture** (UI Presentation Layer → React Context State Layer → Domain Service Layer → Data & Storage Layer).

For visual flowcharts, data lifecycle diagrams, and comprehensive file maps, see [ARCHITECTURE.md](file:///c:/Sakshi%20coding/AI%20Medical%20Assistance%20Bot/ARCHITECTURE.md).

## 🎨 Design System

The application features a **Premium Healthcare Design Refresh**:
- **Clean Aesthetic:** Modern, trustworthy white layout with rounded corners (`20px` border-radius) and soft, blue-tinted drop shadows.
- **Subtle Gradients:** The main background features a soothing linear gradient blending white, Sky Blue, and Pastel Lavender.
- **Pastel Feature Cards:** Key utilities are highlighted using distinct semantic pastel backgrounds:
  - `Lavender (#EDE7FF)` for Health Chat
  - `Mint Green (#E8F8F1)` for Symptom Checker
  - `Sky Blue (#DFF1FF)` for Health Library
  - `Blush Pink (#FCEDEE)` for Profile Management
- **Typography:** High readability utilizing `Dark Navy (#1E293B)` for headings and `Soft Gray (#6B7280)` for body text.

## 🚀 Getting Started

This project is built using **Vite** and **React**.

### Prerequisites
Make sure you have Node.js and `npm` installed on your machine.

### Installation

1. Clone this repository or download the source code.
2. Navigate to the project directory:
   ```bash
   cd "AI Medical Assistance Bot"
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the local development server:
```bash
npm run dev
```
Alternatively, if your system restricts PowerShell scripts, you can run:
```bash
npm.cmd run dev
```

Open your browser and navigate to `http://localhost:5173` (or the URL provided in your terminal) to view the application.

## 🛡️ Medical Disclaimer

**This application is for educational and informational purposes only.** It does not replace professional medical advice, diagnosis, or treatment. Always seek the advice of a physician or other qualified health provider with any questions regarding a medical condition. In case of a severe medical emergency (e.g., chest pain, severe breathing difficulty), call 911 or your local emergency number immediately.
