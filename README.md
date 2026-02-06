# @vybe-adk/swc-dom-source

[![npm version](https://img.shields.io/npm/v/@vybe-adk/swc-dom-source)](https://www.npmjs.com/package/@vybe-adk/swc-dom-source)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/vybe-build/swc-dom-source/actions/workflows/ci.yml/badge.svg)](https://github.com/vybe-build/swc-dom-source/actions/workflows/ci.yml)

SWC plugin that injects source location data attributes into DOM elements.

## Installation

```bash
npm install @vybe-adk/swc-dom-source
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

| `swc_core` version | Next.js version | Status      |
|---------------------|-----------------|-------------|
| 35.x                | 15.x            | Supported   |
| 36.x+               | 16.x            | Not yet supported |

This plugin currently uses `swc_core v35.0.0`, which aligns with **Next.js 15**. Next.js 16 ships a newer SWC version and is not yet supported.

## Building from source

Requires Rust with the `wasm32-wasip1` target:

```bash
rustup target add wasm32-wasip1
npm run build
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT
