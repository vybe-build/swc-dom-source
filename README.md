# @vybe-adk/swc-dom-source

SWC plugin that injects source location data attributes into DOM elements for debugging.

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

## Building from source

Requires Rust with the `wasm32-wasip1` target:

```bash
rustup target add wasm32-wasip1
npm run build
```

## License

MIT
