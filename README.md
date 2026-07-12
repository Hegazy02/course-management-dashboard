# Course Management Dashboard

Angular application for managing courses in an educational platform.

## Prerequisites

- [Node.js](https://nodejs.org/) >= 19
- npm (comes with Node.js)

## Setup

```bash
# Install dependencies
npm install

# Install json-server for the mock API
npm install -D json-server
```

## Running the project

Open **two terminals**.

**Terminal 1 — Mock API:**
```bash
npm run api
```

**Terminal 2 — Angular dev server:**
```bash
ng serve
```

Open `http://localhost:4200` in your browser.

## Project structure

```
src/
├── app/
│   ├── core/           # Services, interceptors, tokens
│   ├── features/       # Feature modules (courses)
│   └── shared/         # Reusable components (table, toast, loader, dialog)
├── main.ts
└── styles.css
```

## Available scripts

| Command          | Description                    |
| ---------------- | ------------------------------ |
| `npm run api`    | Start json-server on :3000     |
| `ng serve`       | Start dev server on :4200      |
| `ng build`       | Production build                |
| `ng test`        | Run unit tests (Vitest)        |
