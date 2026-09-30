# Devlog

Static page + Markdown files. No build step.

- Add posts as `devlog/YYYY-MM-DD-title.md` (first `# heading` becomes the title).
- Push to your default branch; the GitLab Pages job publishes it.
- Preview locally: `python -m http.server`, then open http://localhost:8000.
