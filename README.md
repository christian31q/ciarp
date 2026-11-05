# ciarp

## Figma MCP

This repository configures the hosted Figma MCP server in [`.mcp.json`](./.mcp.json).
Open the repository in a compatible MCP client such as VS Code, start or refresh the
Figma server, and complete Figma sign-in when prompted. Your Figma account must have
access to the files you want to use.

The remote server does not require the Figma desktop app. See [Figma's MCP server
guide](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server)
for setup details and access requirements.

## Figma agent skills

Figma's 16 official MCP agent skills are installed under [`.agents/skills/`](./.agents/skills/).
They cover design-to-code, creating and editing Figma files, Code Connect, FigJam,
Slides, and other Figma workflows. The skills are sourced from Figma's
[`mcp-server-guide` repository](https://github.com/figma/mcp-server-guide/tree/19be8d51c6a2f8ca949d33e5cd8e9662c5d243e8/skills)
at commit `19be8d51c6a2f8ca949d33e5cd8e9662c5d243e8`. Review Figma's
[Developer Terms](https://www.figma.com/legal/developer-terms/) when using them.

## Next.js App Router folder structure

For a Next.js project using the App Router, one organized option is:

```text
my-nextjs-app/
├── public/                    # Static files served from the site root
│   ├── images/
│   └── favicon.ico
├── src/
│   ├── app/                    # Routes, layouts, and route-specific UI
│   │   ├── api/
│   │   │   └── hello/
│   │   │       └── route.ts    # API route handler
│   │   ├── error.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   └── page.tsx
│   ├── components/             # Reusable UI components
│   ├── lib/                    # Shared utilities and service clients
│   ├── styles/                 # Additional stylesheets
│   └── types/                  # Shared TypeScript types
├── .env.local                  # Local environment variables (do not commit)
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

`src/app` is the App Router root in this layout; use it instead of creating a
second top-level `app/` directory. Add route folders under `src/app` as needed,
with a `page.tsx` for UI routes or a `route.ts` for API handlers. The `src/`,
`components/`, `lib/`, `styles/`, and `types/` folders are organizational
choices; Next.js does not require them.
