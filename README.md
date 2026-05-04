# Amrita University Food Feedback System

Next.js app for anonymous mess feedback and live analytics. Uses **PostgreSQL** via **Docker Compose** for local development.

## Prerequisites

- Node.js 20+
- npm
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (running)

## Docker not connecting (Windows)

If you see **`failed to connect to the docker API at npipe://.../docker_engine`** or **“The system cannot find the file specified”**, the Docker **daemon is not running** or is still starting.

1. **Start Docker Desktop** from the Start menu and wait until the whale icon in the system tray says **“Docker Desktop is running”** (not “Starting…”).
2. Open **Docker Desktop → Settings → General** and ensure **“Use the WSL 2 based engine”** is enabled if you use WSL2 (recommended on Windows).
3. In a **new** PowerShell window, run `docker version`. You should see **Server** details, not only Client. If Server errors, Docker is still down.
4. After it works, run `docker compose up -d` again from the `web` folder.

## Run locally

```powershell
cd web
npm install
docker compose up -d
copy .env.example .env.local
npx prisma db push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`DATABASE_URL` in **`.env`** or **`.env.local`** must match the Postgres service in `docker-compose.yml` (see **`.env.example`**).

**Important:** If your `.env` contains **`prisma+postgres://...`** (from `prisma dev` or Prisma Postgres), the app will call that HTTP service instead of Docker. Unless that service is running, you will see **“Cannot fetch data from service”**. For Docker Compose here, use **`postgresql://postgres:postgres@127.0.0.1:5432/amrita_feedback?schema=public`** (`127.0.0.1` avoids some Windows `localhost` / IPv6 issues).

## Prisma: “Cannot fetch data from service” / `fetch failed`

Dev mode uses **webpack** by default (`npm run dev`) so Prisma’s query engine loads reliably with Next.js. If you use **`npm run dev:turbo`** and see database errors, switch back to **`npm run dev`**.

Also confirm Postgres is up (`docker compose ps`) and `DATABASE_URL` points at `localhost:5432`.

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Development server (webpack; recommended with Prisma) |
| `npm run dev:turbo` | Development with Turbopack (faster HMR; Prisma may misbehave) |
| `npm run build` | Production build |
| `npm start` | Run production server |
| `docker compose up -d` | Start Postgres |
| `npx prisma db push` | Apply schema to the database |
| `npm run db:seed` | Seed demo feedback |
| `npm run db:studio` | Open Prisma Studio |

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
