# Digital Menu Management System

A responsive digital menu with an administrative panel for managing products and menu categories.

## Features

### Customer Menu
- Browse products by category.
- View product images, descriptions, and prices.
- Explore grouped product selections.
- Select available flavour options for applicable products.

### Admin Panel
- Sign in using Firebase Authentication.
- Add, edit, and delete menu products.
- Toggle product availability.
- Search products by name.
- Manage product details and flavour options.

## Technologies

- HTML5
- CSS3
- JavaScript (ES Modules)
- Firebase Authentication
- Cloud Firestore

## Setup

1. Clone or download this repository.
2. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
3. Enable **Authentication** and configure the sign-in method used by the application.
4. Create a Cloud Firestore database.
5. Configure the Firebase web app settings in `firebase.js`.
6. Configure Firestore Security Rules to protect your data.
7. Serve the project through a local web server or suitable hosting environment.

## Project Structure

- `index.html` — customer-facing digital menu.
- `script.js` — menu functionality and data handling.
- `style.css` — customer menu styles.
- `admin.html` — administrative panel.
- `admin.js` — admin authentication and product management.
- `style_admin.css` — administrative panel styles.
- `firebase.js` — Firebase initialization.
- `images/` — product images.

