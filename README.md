# Onze Bedrijf Mobility Platform

A professional MVVM PWA for requesting cars from multiple providers.

## Tech Stack

- **Client**: React, Vite, TypeScript, MobX (State Management), Leaflet (Maps).
- **Server**: Node.js, Express, TypeScript.
- **Architecture**: Monorepo, MVVM (Client), Repository Pattern (Server).

## Architecture Overview

### MVVM (Client)
- **Models**: Plain Data Transfer Objects (DTOs) shared with the server.
- **ViewModels**: MobX classes that handle UI logic, state, and API communication. Views are "dumb" observers.
- **Views**: React components that observe ViewModels.

### Server
- **Services**: Business logic (e.g., `MatchingService` filters cars based on criteria).
- **Repositories**: Data access layer (currently in-memory, easily swappable for DB).
- **Providers**: `ICarProvider` interface allows plugging in real APIs (GreenWheels, MyWheels) without changing core logic.

## Getting Started

**Prerequisites**:
- Node.js v20.0.0 or higher (LTS recommended).

1.  **Install Dependencies**:
    ```bash
    cd client && npm install
    cd ../server && npm install
    ```

2.  **Run Server**:
    ```bash
    cd server
    npm run dev
    ```

3.  **Run Client**:
    ```bash
    cd client
    npm run dev
    ```

4.  **Access App**:
    Open `http://localhost:5173` (or port shown by Vite).

## Features

- **Request a Car**: Filter by location, passengers, luggage.
- **Matching**: Smart matching logic (distance, capacity).
- **Admin Panel**: Manage cars, charging points, and users.
- **PWA**: Installable on mobile devices.
