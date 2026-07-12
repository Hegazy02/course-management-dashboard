# Course Management Dashboard

Angular application for managing courses in an educational platform. Built with Angular 21, PrimeNG, and json-server mock API.

## Technologies Used

- **Angular 21.2** — Standalone components, Signals, functional interceptors, control flow syntax
- **PrimeNG 21.1** — Table, Dialog, Card, Tag, Skeleton, Button, Toast, and more
- **PrimeIcons 7** — Icon set
- **Tailwind CSS 4** — Utility-first styling with PostCSS
- **json-server 1.0.0-beta.15** — Mock REST API
- **Vitest** — Unit test runner
- **RxJS** — Observable-based async operations
- **TypeScript 5.9**

## Features Implemented

### Core CRUD
- **List courses** — Server-side lazy loading with pagination, and search
- **Add course** — PrimeNG Dialog with reactive form and validation
- **Edit course** — Same dialog pre-populated with existing data
- **Delete course** — Confirmation dialog before deletion
- **View details** — Dedicated detail page with thumbnail, metadata, and video embed

### Search & Filtering
- **Search by course name** — Debounced (600ms) input with query param sync
- **Filter by status** — Active / Draft / Archived dropdown
- **URL query param sync** — Filters persist in the URL

### Reusable Components
- **GeneralTableComponent** — Generic PrimeNG table wrapper with configurable columns, skeleton loading, lazy load, pagination, scroll, selection, clickable cells
- **FormErrorComponent** — Displays first validation error for any form control
- **ConfirmationDialogComponent** — Reusable confirmation modal for destructive actions
- **ToastComponent** — Fixed-position notification toasts (success/error/warning/info)
- **LoaderComponent** — Full-screen overlay spinner during HTTP requests
- **PageNotFoundComponent** — 404 page

### Course Detail Page
- Thumbnail header, status tag with severity, formatted metadata grid
- YouTube URL detection with embedded iframe
- Direct video file support (mp4, webm, etc.)
- Invalid URL warning banner

### Other
- Loading, empty, and error states handled throughout
- HTTP interceptors for global loader, error toasts, and success messages
- Signals for reactive state management
- Responsive layout (Tailwind breakpoints)
- Lazy-loaded routes via `loadComponent`

## How to Run the Project

### Prerequisites

- [Node.js](https://nodejs.org/) >= 19
- npm (comes with Node.js)

### Setup

```bash
# Install dependencies
npm install

# json-server is already a dev dependency
```

### Running

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

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run api` | Start json-server on port 3000 |
| `ng serve` | Start Angular dev server on port 4200 |
| `ng build` | Production build |
| `ng test` | Run unit tests (Vitest) |

## Mock API

The application uses **json-server** as a mock REST API. The API runs on `http://localhost:3000` and is proxied through the Angular dev server via `proxy.conf.json`.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/courses?_page=&_per_page=&&courseName_contains=` | List courses (paginated) |
| `GET` | `/courses/:id` | Get course by ID |
| `POST` | `/courses` | Create a new course |
| `PUT` | `/courses/:id` | Update an existing course |
| `DELETE` | `/courses/:id` | Delete a course |

### Query Parameters

| Param | Description |
|-------|-------------|
| `_page` | Page number (1-based) |
| `_per_page` | Items per page |
| `courseName` | Full-text search |

The API returns a `PaginatedResponse<T>` envelope:

```json
{
  "first": 1,
  "prev": null,
  "next": 2,
  "last": 3,
  "pages": 3,
  "items": 20,
  "data": [...]
}
```

Mock data is stored in `db.json` with 50 courses across 10 categories.

## Bonus Features

- **Pagination** — Server-side with configurable page size
- **Confirmation modal** — Before deleting a course
- **Toast notifications** — Success / error toasts with auto-dismiss
- **Lazy-loaded routes** — Course list and detail pages use `loadComponent`
- **Reusable table component** — Generic `GeneralTableComponent<T>` with configurable columns
- **Loading skeleton** — Skeleton placeholders in table body and detail page
- **Clean folder structure** — Feature-based architecture (`core/`, `features/`, `shared/`)

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── interceptors/       # error, loader, success interceptors
│   │   ├── models/             # Shared models (PaginatedResponse, Toast)
│   │   ├── services/           # Shared services (HttpService, Toast, Loader, Confirmation)
│   │   ├── tokens/             # HttpContext tokens for interceptors
│   │   └── utils/              # Query params builder, URL helpers
│   ├── features/
│   │   └── courses/
│   │       ├── components/     # CourseDialogComponent
│   │       ├── models/         # Course, CourseRequest, CourseQuery
│   │       ├── pages/          # CourseListComponent, CourseDetailComponent
│   │       └── services/       # CoursesService
│   └── shared/
│       └── components/         # GeneralTable, Toast, Loader, ConfirmationDialog, FormError, PageNotFound
├── main.ts
└── styles.css
```

## Assumptions

- No authentication or route guards required — the app is fully public
- Course data is validated on the server side; client-side validation provides feedback but is not authoritative
- The `url` field is optional and can contain YouTube links, direct video file URLs, or any URL
- Categories are free-text (no fixed enum) to allow flexibility
- The `id` field is generated by json-server (or a UUID-based fallback) for new courses

## Testing

```bash
ng test
```

Unit tests use Vitest and are provided for core services, shared components, and feature components.
