# Implementation Details

This document provides a technical overview of the implementation for the Discussion Platform project. It covers the main architectural decisions, key modules, and patterns used throughout the codebase.

---

## 1. Project Structure

- **Feature-based organization:**
  - Each major domain (protocols, threads, reviews, profile, etc.) is a folder in `src/features`.
  - Shared UI components are in `src/components/ui`.
  - Global state is managed in `src/store`.
  - API logic is colocated with features (e.g., `features/protocols/pages/one-protocol/api/`).

---

## 2. State Management

- **Zustand** is used for global state (auth, review highlights, dialog state, etc.).
  - Example: `useAuthStore`, `useReviewStore`.
- **React Query** manages server state, caching, and async data (protocols, reviews, threads).
  - Infinite queries are used for paginated lists.

---

## 3. Forms & Validation

- **React Hook Form** is used for all forms (login, register, create/edit protocol, review, etc.).
- **Zod** provides schema validation, integrated via `@hookform/resolvers/zod`.
- Forms are reset with async data using `useEffect` and `form.reset`.

---

## 4. API Layer

- **Axios** is used for HTTP requests, with a shared instance in `src/api/axios-instance.ts`.
- API modules are colocated with features for separation of concerns.
- All API calls are wrapped in React Query hooks for caching and error handling.
- Toast notifications (via `sonner`) provide user feedback for async actions.

---

## 5. UI & Styling

- **shadcn/ui** and **Radix UI** provide accessible, composable UI primitives.
- **Tailwind CSS** is used for utility-first styling.
- **Lucide Icons** are used for consistent iconography.
- Responsive layouts are achieved with Tailwind's grid and flex utilities.
- **Mobile-first approach:** All layouts and components are designed with mobile usability as the primary focus, ensuring a seamless experience on all device sizes.

---

## 6. Routing

- **React Router** is used for client-side routing.
- Route definitions are in `src/routes` and feature entry points.
- Protected routes are implemented using auth state from Zustand.

---

## 7. Highlight & Scroll Logic

- Comments, replies, and reviews can be highlighted and scrolled into view using refs and state from stores.
- Highlights auto-clear after navigation or a timeout (e.g., 5 seconds).
- Event propagation is managed to prevent unwanted navigation (e.g., delete button inside a clickable card).

---

## 8. Infinite Loading & Pagination

- Lists (protocols, threads, reviews) use React Query's `useInfiniteQuery` for infinite scroll and load-more patterns.
- The `LoadMoreButton` component is used for manual pagination.

---

## 9. Authentication

- Registration and login flows are implemented with forms and API calls.
- Auth state is stored in Zustand and tokens are managed via Axios.
- Protected actions and routes check auth state before proceeding.

---

## 10. Documentation & Standards

- JSDoc is used for documenting components, hooks, and API functions.
- The codebase follows a consistent style, with ESLint and Prettier for formatting and linting.
- The README provides a high-level overview; this file provides technical implementation details.

---

## 11. Testing & Debugging

- Toast notifications and error boundaries are used for runtime feedback.
- Manual testing is supported by clear UI feedback and error handling.

---

## 12. Extensibility

- The feature-based structure and modular API/hooks make it easy to add new features (e.g., notifications, user settings, admin panel).
- Shared UI and utility modules promote code reuse.

---

For further questions or to contribute, see the README or open an issue/pull request.
