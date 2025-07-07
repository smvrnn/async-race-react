# 🏎️ Async Race - Score: 400/400 pts

> **Live SPA Demo:** [Async Race App (SPA)](https://smvrnn.github.io/async-race-react/)
> **Live API Demo:** [Async Race App (API)](https://crimson-block-9a4c.smvrnn.workers.dev/)

A Single Page Application (SPA) for managing a collection of cars, operating their engines, and showcasing race statistics. Built with React 18+, TypeScript, Redux Toolkit, and modern CSS animations.

## 🚀 UI Deployment

- [x] **Deployment Platform:** Successfully deploy the UI on one of the following platforms: GitHub Pages, Netlify, Vercel, Cloudflare Pages, or a similar service.

## ✅ Requirements to Commits and Repository

- [x] **Commit guidelines compliance:** Ensure that all commits follow the specified commit guidelines, thereby promoting a clear and consistent commit history. This includes using meaningful commit messages that accurately describe the changes made.

- [x] **Checklist included in README.md:** Include the project's checklist in the README.md file. Mark all implemented features to provide a clear overview of the project's completion status.

- [x] **Score calculation:** Use this checklist to calculate your score. Check all implemented features, then calculate your score and put it at the top of the `README.md`.

- [x] **UI Deployment link in README.md**: Place the link to the deployed UI at the top of the README.md file, alongside the calculated score.

## Basic Structure (80 points)

- [x] **Two Views (10 points):** Implement two primary views: "Garage" and "Winners".
- [x] **Garage View Content (30 points):** The "Garage" view must display:
  - [x] Name of view
  - [x] Car creation and editing panel
  - [x] Race control panel
  - [x] Garage section
- [x] **Winners View Content (10 points):** The "Winners" view should display:
  - [x] Name of view ("Winners")
  - [x] Winners table
  - [x] Pagination
- [x] **Persistent State (30 points):** Ensure the view state remains consistent when navigating between views. This includes preserving page numbers and input states. For example, page number shouldn't be reset, input controls should contain that they contained before switching, etc.

## Garage View (90 points)

- [x] **Car Creation And Editing Panel. CRUD Operations (20 points):** Enable users to create, update, and delete cars. A car has two attributes: "name" and "color". Empty and too long names should be handled. For "delete"-operation car should be deleted from "garage" table as well as from "winners".
- [x] **Color Selection (10 points):** Allow color selection from an RGB palette, displaying the selected color on the car's image along with its name.
- [x] **Random Car Creation (20 points):** There should be a button to create random cars (100 cars per click). Name should be assembled from two random parts, for example "Tesla" + "Model S", or "Ford" + "Mustang" (At least 10 different names for each part). Color should be also generated randomly.
- [x] **Car Management Buttons (10 points):** Provide buttons near each car's image for updating its attributes or deleting it.
- [x] **Pagination (10 points):** Implement pagination for the "Garage" view, displaying 7 cars per page.
- [x] **EXTRA POINTS (20 points):**
  - [x] **Empty Garage** Handle empty garage with user friendly message "No Cars" or something like this. Do it at your discretion.
  - [x] **Empty Garage Page** If you remove the last one car on the page, you should be moved on the previous page, to hide the empty one.

## 🏆 Winners View (50 points)

- [x] **Display Winners (15 points):** After some car wins it should be displayed at the "Winners view" table.
- [x] **Pagination for Winners (10 points):** Implement pagination for the "Winners" view, with 10 winners per page.
- [x] **Winners Table (15 points):** The table should include columns for the car's №, image, name, number of wins, and best time in seconds. If the same car wins more than once the number of wins should be incremented while best time should be saved only if it's better than the stored one.
- [x] **Sorting Functionality (10 points):** Allow users to sort the table by the number of wins and best time, in ascending or descending order.

## 🚗 Race (170 points)

- [x] **Start Engine Animation (20 points):** User clicks to the engine start button near each car -> UI is waiting for car's velocity answer -> animate the car and makes another request to drive. In case api returned 500 error car animation should be stopped.
- [x] **Stop Engine Animation (20 points):** User clicks to the engine stop button near each car -> UI is waiting for answer for stopping engine -> car returned to it's initial place.
- [x] **Responsive Animation (30 points):** Ensure car animations are fluid and responsive on screens as small as 500px.
- [x] **Start Race Button (10 points):** Start button should start the race for all cars on the current page.
- [x] **Reset Race Button (15 points):** Reset button should return all cars to their starting positions.
- [x] **Winner Announcement (5 points):** After some car finishes first user should see the message contains car's name that shows which one has won.
- [x] **Button States (20 points):** Start engine button should be disabled in case car is already in driving mode. As well as stop engine button should be disabled when car is on it's initial place.
- [x] **Actions during the race (50 points):** Control over actions during a running race. Such as, deleting or editing a car, changing a page or view. Adding new cars. You can block buttons and stop the race. The main thing is to ensure predictable operation of the application.

## 🎨 Prettier and ESLint Configuration (10 points)

- [x] **Prettier Setup (5 points):** Prettier is correctly set up with two scripts in `package.json`: `format` for auto-formatting and `ci:format` for checking issues.
- [x] **ESLint Configuration (5 points):** ESLint is configured with the [Airbnb style guide](https://www.npmjs.com/package/eslint-config-airbnb). A `lint` script in `package.json` runs ESLint checks. Configuration files should reflect strict TypeScript settings as per `tsconfig.json`.

## 🌟 Overall Code Quality. (100 points) _Skip during self-check_

- [x] **(Up to 100 points)** Discretionary points awarded by the reviewer based on overall code quality, readability
  - [x] **Modular Design** The application should be clearly divided into logical modules or layers, such as API interaction, UI rendering, and state management.
  - [x] **Function Modularization** Code should be organized into small, clearly named functions with specific purposes. Common functions moved to helper. Each function should not exceed 40 lines.
  - [x] **Code Duplication and Magic Numbers** Minimize code duplication and maintain readability by avoiding the use of magic numbers or strings throughout the codebase.
  - [x] **Readability** Clear, readable code. Understandable names of variables, functions, modules
  - [x] **Extra features** Custom hooks, Redux Toolkit, TypeScript strict mode, Responsive design, Modern CSS animations

## 🛠️ Tech Stack

- **Frontend:** React 18+, TypeScript (strict mode)
- **State Management:** Redux Toolkit
- **Styling:** CSS3 with CSS Grid/Flexbox, CSS Animations
- **Build Tool:** Vite
- **Code Quality:** ESLint (Airbnb config), Prettier
- **API:** Mock JSON Server (provided)

## 🚀 Getting Started

### Prerequisites

- Node.js 14.x or higher
- bun (package manager)

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd async-race-react
```

2. Install dependencies:

```bash
bun install
```

3. Start the API server:

```bash
cd ../async-race-api
bun install
bun start
```

4. Start the development server:

```bash
cd ../async-race-react
bun run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── CarControls.tsx
│   ├── CarTrack.tsx
│   ├── GarageView.tsx
│   ├── Navigation.tsx
│   ├── Pagination.tsx
│   ├── WinnerBanner.tsx
│   └── WinnersView.tsx
├── hooks/              # Custom React hooks
│   └── redux.ts
├── services/           # API service layer
│   └── api.ts
├── store/              # Redux store and slices
│   ├── index.ts
│   └── slices/
│       ├── garageSlice.ts
│       ├── raceSlice.ts
│       └── winnersSlice.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions and constants
│   ├── constants.ts
│   └── helpers.ts
├── App.tsx
├── main.tsx
├── App.css
└── index.css
```

## 🎯 Features

### 🏠 Garage View

- Create, edit, and delete cars
- RGB color picker for car customization
- Generate 100 random cars with realistic names
- Individual car engine controls (start/stop)
- Pagination (7 cars per page)
- Real-time car animations during races

### 🏆 Winners View

- Display race winners with statistics
- Sortable table by wins and best time
- Pagination (10 winners per page)
- Car icons with original colors

### 🏁 Racing System

- Start/stop individual car engines
- Animated car movements with realistic physics
- Race all cars simultaneously
- Winner detection and announcement
- Race reset functionality
- Handle engine failures (500 errors)

### 🎨 UI/UX

- Modern, responsive design
- Smooth CSS animations
- Mobile-friendly (works on 500px+ screens)
- Consistent state management
- Error handling and user feedback
- Loading states

## 🎮 How to Use

1. **Garage Management:**
   - Use the top form to create new cars or edit existing ones
   - Generate random cars with the "Generate Cars" button
   - Select cars to edit their properties
   - Delete cars using the remove button

2. **Racing:**
   - Start individual car engines with the ▶️ button
   - Click on cars to make them drive (after starting engine)
   - Use "Race" button to start all cars simultaneously
   - Use "Reset" button to return all cars to starting position

3. **Winners:**
   - Switch to "Winners" view to see race statistics
   - Click column headers to sort by wins or time
   - Navigate through pages using pagination

## 🔧 Development Scripts

```bash
# Development
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Linting
bun run lint

# Code formatting
bun run format
bun run ci:format
```

## 📝 API Documentation

The app uses a mock JSON server running on `http://localhost:3000`. See the [API documentation](../async-race-api/README.md) for detailed endpoint information.

## 🤝 Contributing

1. Follow [Conventional Commits](https://www.conventionalcommits.org/) format
2. Use lowercase for commit types (`feat`, `fix`, `refactor`, etc.)
3. Ensure all tests pass and linting is clean
4. Keep functions under 40 lines
5. Avoid magic numbers/strings

## 📄 License

This project is part of the EPAM Systems educational program.
