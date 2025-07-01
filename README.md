# MarkHoster

<p align="center">
    <img src="src/lib/assets/logo.png" alt="MarkHoster Logo" width="200" />
</p>
A self-hosted platform for publishing Markdown pages with clean URLs, live editing, access control, and more.

## Features

- 🌐 **Clean URLs** — Friendly slugs like `/pages/my-first-page`
- ✏️ **Live Preview & Editing** — Instant Markdown preview and easy editing
- 🔒 **Access Control** — Set pages as public/private, toggle active status
- 👁️ **View Tracking** — Track page views at a glance
- 🚀 **SEO Ready** — Meta tags and descriptions for discoverability
- 💡 **Syntax Highlighting & Alerts** — Beautiful code blocks and callouts

## Quick Start

1. Start the Postgres database in `docker-compose.yml`:

   ```bash
   docker compose up -d
   ```

2. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/yourusername/markhoster.git
   cd markhoster
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open your browser:
   - App: [http://localhost:5173](http://localhost:5173)
   - Admin panel: [http://localhost:5173/admin](http://localhost:5173/admin)

## Docker (Self-Hosting)

### Pre-built Docker Image

For quick self-hosting, use the pre-built Docker image:

1. Copy and edit env file:

   ```bash
   cp docker/.env.example docker/.env
   # Edit docker/.env
   ```

2. Start with Docker Compose:

   ```bash
   cd docker
   docker compose up -d
   ```

   - App: [http://localhost:3000](http://localhost:3000)
   - Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

### Build Your Own Image

For more control, build your own Docker image:

1. Build the image:

   ```bash
   docker build -t markhoster .
   ```

2. Run the container:

   ```bash
   docker run -p 3000:3000 --env-file docker/.env -v /srv/docker/markhoster/app/files:/app/files markhoster
   ```

> [!NOTE]
> For HTTPS/Traefik, see `docker/docker-compose-traefik.yml`.

## License

MIT
