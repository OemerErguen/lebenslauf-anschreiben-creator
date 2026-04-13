<p align="center">
  <img src="https://img.shields.io/badge/Lebenslauf_%26_Anschreiben-Creator-0f172a?style=for-the-badge&labelColor=0f172a" alt="Lebenslauf & Anschreiben Creator" />
</p>

<h3 align="center">Free, open-source CV & cover letter creator</h3>

<p align="center">
  Build professional German-style resumes and cover letters — right in your browser, no sign-up required.
</p>

<p align="center">
  <a href="https://github.com/OemerErguen/lebenslauf-anschreiben-creator/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/OemerErguen/lebenslauf-anschreiben-creator/ci.yml?branch=main&style=flat-square&label=CI" alt="CI" /></a>
  <a href="https://github.com/OemerErguen/lebenslauf-anschreiben-creator/actions/workflows/deploy.yml"><img src="https://img.shields.io/github/actions/workflow/status/OemerErguen/lebenslauf-anschreiben-creator/deploy.yml?branch=main&style=flat-square&label=Deploy" alt="Deploy" /></a>
  <a href="https://github.com/OemerErguen/lebenslauf-anschreiben-creator/blob/main/LICENSE"><img src="https://img.shields.io/github/license/OemerErguen/lebenslauf-anschreiben-creator?style=flat-square" alt="License" /></a>
  <img src="https://img.shields.io/badge/node-%3E%3D22-brightgreen?style=flat-square" alt="Node >= 22" />
  <img src="https://img.shields.io/badge/pnpm-%3E%3D10-f69220?style=flat-square" alt="pnpm >= 10" />
</p>

<p align="center">
  <a href="https://oemererguen.github.io/lebenslauf-anschreiben-creator/">Live Demo</a> · <a href="docs/architecture.md">Architecture</a> · <a href="docs/contributing.md">Contributing</a>
</p>

---

## Why?

Too many simple tools cost money for no reason. This project exists because creating a CV or cover letter shouldn't require a subscription. It's free, it's open-source, and it always will be.

## Privacy & Security

This application runs **entirely in your browser**. There is no backend server, no database, and no cloud storage involved.

- **No data collection** — Your personal information, resume content, and cover letters are never transmitted to any server. Period.
- **No accounts, no sign-up** — There is nothing to register for. Open the page and start working.
- **Browser storage only** — All data is persisted in your browser's `localStorage`. It never leaves your device unless you explicitly export it.
- **No analytics, no tracking, no cookies** — The application does not use any third-party analytics, tracking scripts, or advertising cookies.
- **Fully auditable** — The entire source code is open. You can verify every line of what runs on your machine.

Your data belongs to you. This tool simply helps you format it.

## Features

- **German-style Lebenslauf & Anschreiben** — DIN 5008 compliant cover letters, German resume conventions built-in
- **Multiple layouts** — Sidebar left/right, full-width, top-header
- **Design presets** — Classic, modern, minimal — or fully customize colors, fonts, spacing
- **Live preview** — See changes instantly as you type
- **PDF export** — Print-ready PDF via Paged.js, pixel-perfect pagination
- **Cover letter builder** — Sender/recipient, salutation, paragraphs, signature (upload or draw)
- **Bilingual UI** — German and English interface
- **100% client-side** — Static site hosted on GitHub Pages, no server required
- **No sign-up, no paywall, no tracking**

## Use It Now

No installation needed — just open the app in your browser:

**[https://oemererguen.github.io/lebenslauf-anschreiben-creator/](https://oemererguen.github.io/lebenslauf-anschreiben-creator/)**

Everything runs client-side. Your data stays in your browser.

## Run It Locally

If you want to develop or self-host:

```bash
git clone https://github.com/OemerErguen/lebenslauf-anschreiben-creator.git
cd lebenslauf-anschreiben-creator
pnpm install
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command          | Description                          |
| ---------------- | ------------------------------------ |
| `pnpm dev`       | Start Vite dev server (port 5173)    |
| `pnpm build`     | Production build                     |
| `pnpm typecheck` | TypeScript check across all packages |
| `pnpm lint`      | ESLint (flat config, v9)             |
| `pnpm format`    | Prettier                             |
| `pnpm test`      | Run all tests (Vitest)               |
| `pnpm test:e2e`  | Playwright e2e tests                 |
| `pnpm clean`     | Remove dist/cache artifacts          |

## Tech Stack

| Layer     | Tech                                                        |
| --------- | ----------------------------------------------------------- |
| Framework | React 19, Vite 8                                            |
| State     | Zustand with localStorage persistence                       |
| Styling   | Tailwind CSS (app UI), CSS custom properties (CV rendering) |
| Rich text | TipTap                                                      |
| PDF       | Paged.js polyfill in isolated iframe                        |
| i18n      | i18next / react-i18next                                     |
| Schemas   | Zod (Extended JSON Resume)                                  |
| Monorepo  | pnpm workspaces, Turbo                                      |
| CI/CD     | GitHub Actions, GitHub Pages                                |

## Project Structure

```
packages/
├── core/            # Zod schemas, types, migrations, sample data
├── components/      # React CV components (Photo, SkillsList, etc.)
├── layouts/         # Layout definitions (sidebar-left, full-width, etc.)
├── layout-engine/   # Assembles layout + components + tokens → HTML + CSS
├── presets/         # Built-in design presets (classic, modern, minimal)
├── renderer/        # PagedRenderer: iframe + Paged.js → PDF
└── app/             # Vite + React editor UI
```

See [docs/architecture.md](docs/architecture.md) for the full architecture guide.

## Contributing

Contributions are welcome and encouraged! Whether it's a bug fix, new feature, translation, or layout — every PR matters.

See the [Contributing Guide](docs/contributing.md) to get started.

## Support the Project

This project is and always will be **free and open-source**. If you find it useful and want to support ongoing development, consider buying me a coffee.

<p align="center">
  <a href="https://buymeacoffee.com/4zdjzsf6r7p">
    <img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me a Coffee" />
  </a>
</p>

<p align="center">
  <a href="https://buymeacoffee.com/4zdjzsf6r7p">
    <img src="docs/assets/bmc_qr.png" alt="Buy Me a Coffee QR Code" width="200" />
  </a>
</p>

---

<p align="center">
  Made with care by <a href="https://github.com/OemerErguen">Ömer Ergün</a><br/>
  <sub>Essential tools should be free. Let's build them together.</sub>
</p>
