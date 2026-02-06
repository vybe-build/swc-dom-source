# Contributing to swc-dom-source

Thanks for your interest in contributing! This guide will help you get started.

## Prerequisites

- **Rust** (stable) — install via [rustup](https://rustup.rs/)
- **wasm32-wasip1 target** — `rustup target add wasm32-wasip1`
- **Node.js** (v18+) — for running `npm` scripts and integration testing

## Building locally

```bash
# Clone the repo
git clone https://github.com/vybe-build/swc-dom-source.git
cd swc-dom-source

# Build the WASM plugin
npm run build
```

This runs `cargo build --release --target wasm32-wasip1` and copies the `.wasm` artifact to the project root.

## Code style

Please ensure your code passes these checks before submitting:

```bash
cargo fmt --check
cargo clippy --target wasm32-wasip1 -- -D warnings
```

## Pull request process

1. **Fork** the repository and create a feature branch from `main`
2. Make your changes
3. Run `cargo fmt` and `cargo clippy` to ensure code quality
4. Build the project with `npm run build` to verify it compiles
5. Open a **pull request** against `main` with a clear description of the change
6. A maintainer will review your PR — please be patient and responsive to feedback

## Commit message conventions

Use clear, imperative-mood commit messages:

```
feat: Add support for custom attribute prefixes
fix: Handle empty JSX fragments correctly
docs: Update compatibility table for Next.js 16
chore: Bump swc_core to v36
```

Prefix with a type: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`.

## Reporting issues

Found a bug or have a feature idea? Please [open an issue](https://github.com/vybe-build/swc-dom-source/issues/new/choose) using one of our templates.
