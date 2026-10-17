# Creeper32767's Personal Website

<div align="center">

The source code for my personal portfolio and blog, hosted at [creeper32767.github.io](https://creeper32767.github.io).

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-Deployed-green.svg)](https://creeper32767.github.io/)

</div>

## About the project

This repository contains the source code for my personal website. It is a content-driven Nuxt application for sharing projects, writing, and other personal content.

The application uses Nuxt's file-based routing and Nuxt Content to render pages from the `content/` directory. The interface is built with Vue, Tailwind CSS, and shadcn-nuxt components, with VueUse providing client-side utilities such as responsive server-side rendering support.

## Built with

- [Nuxt 4](https://nuxt.com/)
- [Vue 3](https://vuejs.org/)
- [Nuxt Content](https://content.nuxt.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn-nuxt](https://www.shadcn-vue.com/)
- [Pinia](https://pinia.vuejs.org/)
- [VueUse](https://vueuse.org/)

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/)
- A modern web browser

This project uses pnpm and includes a `pnpm-workspace.yaml` file for workspace and build configuration.

### Installation

Clone the repository and install its dependencies:

```sh
git clone https://github.com/Creeper32767/creeper32767.github.io.git
cd creeper32767.github.io
pnpm install
```

### Development

Start the Nuxt development server:

```sh
pnpm dev
```

The site is available at [http://localhost:3000](http://localhost:3000).

### Production

Build the application:

```sh
pnpm build
```

Generate a static version of the site:

```sh
pnpm generate
```

Preview a production build locally:

```sh
pnpm preview
```

The available commands are defined in [`package.json`](./package.json).

## Deployment

The repository includes a GitHub Actions workflow for GitHub Pages deployment. Deployments are triggered by pushes to the `main` branch and can also be started manually from the Actions tab.

See the [Nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment) and [GitHub Pages documentation](https://docs.github.com/en/pages) for additional details.

## License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.

## Contact

Creeper32767 - [@Creeper32767](https://github.com/Creeper32767)

Project link: [https://github.com/Creeper32767/creeper32767.github.io](https://github.com/Creeper32767/creeper32767.github.io)
