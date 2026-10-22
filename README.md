# @vybe-adk/swc-dom-source

[![npm version](https://img.shields.io/npm/v/@vybe-adk/swc-dom-source)](https://www.npmjs.com/package/@vybe-adk/swc-dom-source)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/vybe-build/swc-dom-source/actions/workflows/ci.yml/badge.svg)](https://github.com/vybe-build/swc-dom-source/actions/workflows/ci.yml)

SWC plugin that injects source location data attributes into DOM elements.

## Installation

```bash
npm install @vybe-adk/swc-dom-source@^0.2.0
```

## Usage

Add the plugin to your Next.js config:

```js
// next.config.js
module.exports = {
  experimental: {
    swcPlugins: [
      ["@vybe-adk/swc-dom-source", { attr: "data-source", exclude: ["components/ui"] }],
    ],
  },
};
```

## Options

| Option    | Type       | Default         | Description                                      |
|-----------|------------|-----------------|--------------------------------------------------|
| `attr`    | `string`   | `"data-source"` | The attribute name to inject                     |
| `exclude` | `string[]` | `[]`            | File path patterns to exclude from transformation |

## Output

The plugin adds a data attribute to host JSX elements (lowercase tags like `div`, `span`, etc.) with the format:

```
filename:line:column
```

Example output:
```html
<div data-source="src/components/Button.tsx:15:4">Click me</div>
```

## Compatibility

This plugin must match the `swc_core` version used by your framework. Using a mismatched version will cause runtime errors.

| Plugin version | `swc_core` version | Next.js version |
|----------------|--------------------|-----------------|
| 0.1.x          | 35.0.0             | 15.4.x          |
| 0.2.x          | 77.0.0             | 16.4.2          |

Version 0.2.0 pins `swc_core` to 77.0.0. The [SWC compatibility table](https://plugins.swc.rs/versions/range/3012) lists `>=77.0.0 <78.0.0` for Next.js 16.4.0-canary.15 through canary.20; stable 16.4.2 was not listed when this upgrade was checked. Next.js 16.4.2's [release lockfile](https://github.com/vercel/next.js/blob/v16.4.2/Cargo.lock) uses `swc_common` 26.0.0 and `swc_plugin_runner` 34.0.0. Compatibility with 16.4.2 is covered by the Turbopack integration test below.

Keep Next.js 15.4 apps on `^0.1.1`. Version 0.2.0 changes the Wasm ABI and is intentionally outside that caret range.

## Building from source

Requires Rust with the `wasm32-wasip1` target:

```bash
rustup target add wasm32-wasip1
npm run build
```

## Testing

```bash
cargo test --locked
npm run build
npm run test:e2e
```

The integration test packs the local Wasm into a 0.2.0 npm tarball, installs it in a fresh Next.js 16.4.2 app, and checks HTML fetched with `curl`. It covers Turbopack development with default and custom attributes, excluded files, existing attributes, server and client components, and a production build/start with the plugin enabled. The temporary app, HTML responses, and logs are retained at the path printed by the test.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT
