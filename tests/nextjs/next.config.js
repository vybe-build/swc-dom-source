module.exports = {
  turbopack: { root: __dirname },
  experimental: {
    swcPlugins: [
      [
        "@vybe-adk/swc-dom-source",
        {
          attr: process.env.SOURCE_ATTR || "data-source",
          exclude: ["components/ui"],
        },
      ],
    ],
  },
};
