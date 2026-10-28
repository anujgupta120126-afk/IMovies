# 🎬 IMovies — Book Movie Tickets

A sleek, dark-themed movie ticket booking app built with **TanStack Start** (React 19), **TypeScript**, and **Tailwind CSS v4**.

**Live demo:** [https://imovies-cinema.lovable.app](https://imovies-cinema.lovable.app)

> **Note:** This build runs entirely on sample data with a simulated checkout. Bookings are stored on the visitor's own device (localStorage) — there is no server-side database or shared seat state yet.

## ✨ Features

- **Browse movies** — cinematic hero section with a featured film, plus a filterable grid (search by title, filter by genre, language, city, and date)
- **Movie pages** — poster, rating, runtime, release date, cast, and synopsis for each title
- **Showtimes** — five days of showtimes across three theatres in Mumbai, Delhi, and Bengaluru
- **Seat selection** — interactive seat map with premium rows priced higher and a few "already booked" seats per show
- **Simulated checkout** — ticket price + convenience fee, fake payment flow, instant confirmation
- **My Bookings** — view past bookings and cancel up to **2 hours** before showtime for a full refund

## 🛠️ Tech stack

| Layer     | Tech                                                        |
| --------- | ----------------------------------------------------------- |
| Framework | TanStack Start v1 (full-stack React, SSR-ready, Vite 7)     |
| Routing   | TanStack Router (file-based, `src/routes/`)                  |
| UI        | React 19, Tailwind CSS v4, Radix UI primitives, lucide-react |
| State     | React Query for async state; localStorage for bookings       |
| Testing   | Vitest + React Testing Library                               |
| Linting   | ESLint + Prettier                                            |

## 🚀 Getting started

Prerequisites: **Node.js 20+** (install with [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

```sh
git clone <this-repository-url>
cd <repository-name>
npm install
npm run dev
