# Employee Directory App

A small project I built to practice React, TypeScript, and Tailwind CSS. It's basically an employee management dashboard with filtering, sorting, and form validation.

## What it does

- Shows a table of employees with their name, email, department, and status
- Search bar that filters by name in real time
- Dropdown to filter by status (Active / On Leave)
- Click any column header to sort the table
- "Add Employee" button opens a popup form — name and email are validated before saving
- Hover over a row to see delete and toggle-status buttons
- Data is saved to localStorage so it persists on refresh

## Stack

- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Notes

- New employees are added as "Active" by default
- Email validation uses a regex — might switch to Zod later
- TODO: add pagination once the list gets long
- TODO: add an edit modal so you can update existing records

## Deployment

Hosted on Vercel.
