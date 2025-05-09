# 📝 Notes App

A sleek and secure note-taking app built with **React Native**, **TypeScript**, and **Expo Router**. It supports both public and private notes, offering a modern UI, gesture handling, and local storage via SQLite.

## 📱 Features

- 📂 Create, edit, and delete notes
- 🔐 Access secure **private notes** via password modal
- 🔍 Real-time search filtering
- 💾 Offline-first with local **SQLite** storage
- 🎨 Custom styling with reusable themes
- ⚡ Smooth navigation powered by **Expo Router**
- ✍️ Built using **TypeScript** for type safety

---

## 🔧 Tech Stack

- **React Native** (via Expo)
- **TypeScript**
- **Expo Router**
- **SQLite** via `expo-sqlite`
- **React Context API** for global state
- **react-native-safe-area-context**
- **react-native-gesture-handler**
- **Custom Components**: `Note`, `NoteScreen`, `SearchBar`, `Fab`, `PasswordModal`

---

## 🧠 Core Logic

- **SQLite Initialization**:
  - On app start, checks DB version
  - Creates `notes` table if missing
- **Note Creation**:
  - If `id = new`, creates a new note
  - Otherwise, loads existing note from SQLite and updates
- **Private Notes**:
  - Protected by password modal
  - Stored separately in `private_notes` table
- **State Management**:
  - Managed via `NotesContext` for both public/private notes
- **Navigation**:
  - Stack-based navigation with animated transitions
  - Tab layout for public/private access

---

## 🚀 Getting Started

### Prerequisites

- Node.js
- Expo CLI: `npm install -g expo-cli`

### Installation

```bash
git clone https://github.com/udayraj10/notes.git
cd notes
npm install


