# Releasing

ZITIKS uses semantic version tags to create GitHub releases.

## Release Checklist

1. Update `CHANGELOG.md`.
2. Update `src/frontend/package.json`.
3. Update `src/frontend/package-lock.json`.
4. Run the frontend build:

   ```powershell
   cd src/frontend
   npm.cmd run build
   ```

5. Commit the release changes.
6. Create and push a version tag:

   ```powershell
   git tag v0.2.0
   git push origin main
   git push origin v0.2.0
   ```

GitHub Actions will create the release from the tag.
