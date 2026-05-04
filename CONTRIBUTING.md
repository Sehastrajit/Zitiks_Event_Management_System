# Contributing

Thanks for your interest in contributing to ZITIKS.

## Development Setup

```powershell
cd src/frontend
npm install
npm.cmd run dev
```

Before submitting a pull request, run:

```powershell
npm.cmd run build
```

## Pull Request Guidelines

- Keep changes focused and easy to review.
- Use clear commit messages.
- Include screenshots for UI changes when possible.
- Avoid committing secrets, `.env` files, build output, or dependency folders.
- Update documentation when behavior or setup steps change.
- Link related issues in the pull request description when applicable.
- Make sure the GitHub Actions build passes before requesting review.

## Suggested Workflow

1. Fork the repository.
2. Create a branch from `main`.
3. Make your changes.
4. Run `npm.cmd run build` from `src/frontend`.
5. Open a pull request with a clear summary and testing notes.

## Code Style

- Follow the existing Next.js, TypeScript, and Tailwind patterns.
- Prefer small components and clear data flow.
- Keep UI text concise and user-facing.
- Use frontend API routes for app data unless a separate backend is intentionally required.

## Reporting Bugs

When filing a bug, include:

- What you expected to happen
- What actually happened
- Steps to reproduce
- Browser and OS, if relevant
- Screenshots or console errors, if useful
