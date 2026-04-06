# study-viser

A study management platform for students, instructors, and TAs.

## Tech Stack

- **Next.js** (React, TypeScript)
- **Prisma** ORM with **PostgreSQL**
- **Tailwind CSS**

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env and set DATABASE_URL to your PostgreSQL connection string
```

### 3. Set up the database

Run the migration to create tables and enums:

```bash
npm run db:migrate
```

Seed the database with demo users and courses:

```bash
npm run db:seed
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The database includes the following models and enums:

### Enums

| Enum   | Values                        |
|--------|-------------------------------|
| `Role` | `STUDENT`, `INSTRUCTOR`, `TA` |

### Models

| Model        | Description                                         |
|--------------|-----------------------------------------------------|
| `User`       | Platform user with a system-level role              |
| `Course`     | A course owned by an instructor                     |
| `Enrollment` | Links a user to a course with a course-specific role |

## Database Scripts

| Command           | Description                          |
|-------------------|--------------------------------------|
| `npm run db:generate` | Regenerate the Prisma client     |
| `npm run db:migrate`  | Apply pending migrations         |
| `npm run db:seed`     | Seed demo users and courses      |
