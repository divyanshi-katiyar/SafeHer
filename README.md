# 🛡️ SafeHer – Women's Safety Platform

SafeHer is a modern women's safety web application designed to provide users with essential safety tools and resources in one place. The platform includes emergency SOS functionality, journey tracking, emergency contact management, incident reporting, safety tips, and nearby safety resources.

## ✨ Features

- 🚨 **One-Tap Emergency SOS** – Quickly trigger an emergency alert and record location information.
- 📍 **Live Journey Tracking** – Track journeys with source, destination, and expected arrival details.
- 👥 **Emergency Contacts** – Add and manage trusted emergency contacts.
- ⚠️ **Incident Reporting** – Report safety incidents with relevant details and location information.
- 🗺️ **Nearby Safety Resources** – Explore nearby places and resources that may be useful during emergencies.
- 📚 **Safety Tips** – Access useful personal safety information and guidance.
- 🕐 **SOS History** – View previously triggered SOS alerts and related information.
- 🔔 **Notification Center** – Stay updated with important safety notifications.
- 👤 **User Profile** – Manage personal account and profile information.
- 🌙 **Dark Mode** – Switch between light and dark themes.
- 🔐 **Authentication** – Secure user registration and login using Firebase Authentication.

## 🛠️ Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React
- Motion

### Backend & Database
- Firebase
- Firebase Authentication
- Cloud Firestore

### Other Technologies
- Recharts
- Google GenAI

## 📂 Project Structure

    SafeHer/
    │
    ├── assets/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── firebase/
    │   ├── layouts/
    │   ├── pages/
    │   ├── services/
    │   ├── types/
    │   ├── App.tsx
    │   ├── index.css
    │   └── main.tsx
    │
    ├── firestore.rules
    ├── firebase-applet-config.json
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm

### Installation

1. Clone the repository:

       git clone YOUR_REPOSITORY_URL

2. Navigate to the project directory:

       cd SafeHer

3. Install dependencies:

       npm install

4. Configure the required environment variables using the provided `.env.example` file.

5. Start the development server:

       npm run dev

6. Open the local URL displayed in your terminal.

## 🔥 Firebase Setup

SafeHer uses Firebase services for authentication and data management.

To run the application with your own Firebase project:

1. Create a Firebase project.
2. Enable Firebase Authentication.
3. Set up Cloud Firestore.
4. Add your Firebase configuration details to the required environment variables.
5. Configure Firestore security rules as needed.

> ⚠️ Never commit API keys, private credentials, or `.env` files containing sensitive information to a public GitHub repository.

## 🎯 Purpose

The goal of SafeHer is to create an accessible digital safety companion that brings important safety features together in a simple and user-friendly platform.

The project demonstrates the use of modern frontend development technologies combined with Firebase services to build an interactive and responsive safety-focused web application.

## 🔮 Future Improvements

- Real-time GPS tracking
- Integration with maps and location APIs
- SMS and emergency contact notifications
- Direct emergency service integration
- Real-time incident heatmaps
- Push notifications
- AI-powered safety recommendations

## 👩‍💻 Author

**Divyanshi Katiyar**

## ⚠️ Disclaimer

SafeHer is a software project and should not be considered a replacement for official emergency services. Some emergency, tracking, and notification features may be simulated or require additional third-party API integrations for real-world use.

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
