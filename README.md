# HIVE Interiors - Meeting Scheduler

A modern meeting scheduling mobile application developed for **HIVE Interiors**.

The application allows users to securely log in, create and manage meetings, and store meeting information in MongoDB. The project follows a mobile frontend + REST API backend architecture.

---

## 📱 Project Overview

**HIVE Interiors Meeting Scheduler** is designed to simplify the process of scheduling and managing meetings within the organization.

The application provides a clean, premium dark-themed interface where authenticated users can create meetings by entering details such as:

- Meeting title
- Date
- Start time
- End time
- Location
- Description
- Meeting type

Meeting information is sent to the backend API and stored in **MongoDB**.

---

## ✨ Features

### Authentication

- User login
- Email and password authentication
- JWT-based authentication
- Protected API requests
- Secure authentication flow

### Meeting Management

- Create a new meeting
- Enter meeting title
- Select meeting date
- Enter start and end times
- Add meeting location
- Add meeting description
- Select meeting type
  - In Person
  - Online
- Store meetings in MongoDB

### User Interface

- Premium black/dark UI
- Minimal and modern design
- Responsive mobile layout
- Clean typography
- Smooth navigation
- Mobile-friendly forms
- Loading states
- Validation and error messages

---

## 🛠️ Technologies Used

### Frontend

- React Native
- Expo
- Expo Router
- TypeScript
- Axios
- AsyncStorage

### Backend

- Node.js
- Express.js
- REST API
- JWT Authentication
- bcrypt

### Database

- MongoDB
- MongoDB Atlas
- Mongoose

### Development Tools

- Visual Studio Code
- Git
- GitHub
- Expo Go
- Postman

---

## 🏗️ Project Architecture

```text
HIVE Interiors Meeting Scheduler
│
├── backend
│   │
│   ├── controllers
│   │
│   ├── middleware
│   │
│   ├── models
│   │
│   ├── routes
│   │
│   ├── server.js
│   │
│   ├── package.json
│   │
│   └── .env
│
├── mobile
│   │
│   ├── src
│   │   ├── app
│   │   ├── components
│   │   ├── constants
│   │   ├── hooks
│   │   └── services
│   │
│   ├── assets
│   ├── package.json
│   └── app.json
│
├── .gitignore
└── README.md
