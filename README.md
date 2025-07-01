# MarkHoster

MarkHoster is self-hosted platform for publishing Markdown pages with ease. Whether you want to share documentation, guides, or personal notes, MarkHoster provides a seamless workflow for managing content and assets.

## ✨ Features

- 🌐 **Clean URLs** — Friendly slugs like `/pages/my-first-page`
- ✏️ **Live Preview & Editing** — Instant Markdown preview and easy editing
- 🔒 **Access Control** — Set pages as public/private, toggle active status
- 👁️ **View Tracking** — Track page views at a glance
- 🚀 **SEO Ready** — Meta tags and descriptions for discoverability
- 💡 **Syntax Highlighting & Alerts** — Beautiful code blocks and callouts

## 🚀 Getting Started

1. **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/markhoster.git
    cd markhoster
    ```

2. **Install dependencies**
    ```bash
    pnpm install
    ```

3. **Run the development server**
    ```bash
    pnpm dev
    ```

4. **Access the admin panel**  
    Visit `http://localhost:5173/admin` to upload Markdown files, manage assets, and configure your pages.

> **Tip:** For self-hosting, you can use the provided [distroless Docker image](./Dockerfile.distroless) for a minimal and secure deployment—no need to build locally! See the Docker section below for details.

## 🖼️ Example

```markdown
# My First Markdown Page

Welcome to my awesome markdown page hosted on MarkHoster!

## Example Image

![My Image](example-image.jpg)
```

## 🛠️ Tech Stack

- [SvelteKit](https://kit.svelte.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Marked](https://marked.js.org/) with [Shiki](https://shiki.matsu.io/) for code highlighting

## 📦 Docker Support

MarkHoster can be built and deployed as a Docker image. For self-hosting, a [distroless Docker build](./Dockerfile.distroless) is available for a lightweight, production-ready container. See `.github/workflows/main.yaml` for CI/CD details.

## 📄 License

MIT

---

*Powered by MarkHoster – Making markdown hosting simple and beautiful.*