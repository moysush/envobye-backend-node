# Envobyte Backend Intern Assignment

**Author:** Mahmud Hossain Sushmoy

**Tech Stack:** Node.js, Express, TypeScript, MongoDB, Mongoose, Jest

## Overview

This repository contains the backend API implementation for the Monica CRM Contact module extension.

As authorized by HR on July 6th, this was built using Node.js/MongoDB instead of Laravel/PHP.

---

## Setup Instructions

### Prerequisites

- Node.js (v25.9)
- A MongoDB connection string (Local or MongoDB Atlas)

### Installation

1. Clone the repository:

   ```bash
   git clone <your-repository-url>
   cd <your-repository-directory>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory and add the following:

   ```env
   PORT=8080
   NODE_ENV=development
   DATABASE_URI=<mongodb-uri>
   ```

4. Seed the database with data:

   ```bash
   npm run seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Running Tests

The test suite uses `mongodb-memory-server` to run fully isolated integration tests in RAM without affecting the physical database.

```bash
npm test
```

---

## Implementation Approach

- **Architecture:** API built using a standard MVC pattern.
- **Database Design:** Extended the `Contact` schema with `is_favorite` and `personal_note`. Added an indexed `user_id` to enforce strict multi-tenant data isolation.
- **Search & Filtering:** Dynamic query building is handled in the `getContacts` controller, applying `$or` regex searching across names and emails, seamlessly combined with pagination and boolean filters.
- **Performance:** The `/stats` endpoint uses a native MongoDB Aggregation Pipeline to calculate metrics efficiently without loading documents into memory.

---

## Assumptions & Trade-offs

- **Authentication (Assumption)** To fit the 5-hour time constraint, a full JWT flow was bypassed. The app simulates an authenticated session using a global `MOCK_USER_ID` to demonstrate data isolation.
- **Pagination (Trade-off)** Utilized offset-based pagination (`skip`/`limit`). Cursor-based pagination would be more performant for enterprise-scale data, but offset is highly effective for this scope.

---

## Estimated Time Spent

**Total Time:** 5 hours (Setup: 1h / Controllers & DB: 2h / Search Logic: 1h / Testing & Docs: 1h)
