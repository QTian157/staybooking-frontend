# StayBooking Frontend

A React-based frontend application for **StayBooking**, a full-stack accommodation booking platform.  
The frontend communicates with a Spring Boot backend via REST APIs and supports both **Guest** and **Host** user roles.

This project demonstrates a complete booking workflow, role-based UI, and integration with a cloud-backed backend system.

---

## Features

### Authentication
- Register and login as **Guest** or **Host**
- JWT-based authentication
- Logout support
- Role-based UI rendering

---

### Guest Experience
- Search stays by:
  - Check-in date
  - Check-out date
  - Number of guests
- View stay list with images
- View stay detail page
- Book a reservation via popup form
- Reservation data persisted in backend
- View reservation list
- Cancel reservation

> Note: Location-based filtering is **not implemented on the frontend**.  
> Location data is stored and indexed in the backend (Elasticsearch).

---

### Host Experience
- View owned stay list with images
- View stay detail page
- View reservation list for owned stays

---

### Image Handling
- Stay images are uploaded via backend APIs
- Images are stored in **Google Cloud Storage**
- Image URLs are persisted in **MySQL** and rendered by the frontend

---

## Tech Stack
- React (Create React App)
- Ant Design
- JavaScript (ES6+)
- Fetch API
- JWT Authentication

---

## Project Structure

```bash
src/
components/ # Reusable UI components
pages/ # Guest / Host pages
services/ # API request helpers
utils/ # Auth utilities and config
App.js
```

---

## Environment Variables


Do NOT commit `.env.local` to GitHub.

```bash
REACT_APP_API_BASE_URL=http://localhost:8080
```
---

## Run Locally

```bash

npm install
npm start
Open in browser: http://localhost:3000
```





