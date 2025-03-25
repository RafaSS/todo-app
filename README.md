# To-Do App

A modern to-do application built with Vue.js and Supabase authentication. This app allows users to create accounts, log in, and manage their personal to-do lists.

## Features

- User authentication (register, login, logout) via Supabase
- Create, read, update, and delete to-do items
- Mark tasks as complete/incomplete
- User-specific to-do lists (each user only sees their own tasks)
- Responsive design with Tailwind CSS

## Tech Stack

- **Frontend:** Vue.js 3 with Composition API
- **Routing:** Vue Router
- **State Management:** Pinia
- **Styling:** Tailwind CSS
- **Authentication & Database:** Supabase
- **Form Validation:** VeeValidate & Zod
- **Build Tool:** Vite

## Setup Instructions

### Prerequisites
- Node.js (v16 or later)
- Supabase account (free tier works fine)

### Supabase Setup

1. Create a new project in Supabase
2. Create a table called `todos` with the following schema:
   - `id` (uuid, primary key)
   - `user_id` (uuid, references auth.users.id)
   - `title` (text, not null)
   - `description` (text)
   - `completed` (boolean, default: false)
   - `created_at` (timestamp with time zone, default: now())
3. Set up Row Level Security (RLS) for the `todos` table:
   - Enable RLS on the `todos` table
   - Create a policy that allows users to select/insert/update/delete only their own todos
   - Sample policy: `auth.uid() = user_id`

### Local Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on the provided `.env.example` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the development server:
   ```
   npm run dev
   ```
5. Open your browser and navigate to the URL shown in the terminal

## Deployment

This application can be easily deployed to Vercel. Connect your repository and Vercel will automatically build and deploy your application.
