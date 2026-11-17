// ESM-only deps pulled in via @gnolang/tm2-js-client; they sit outside the root .babelrc scope.
const ESM_DEPS = "@noble/|@scure/|@gnolang/tm2-js-client/node_modules/uuid/";

/** @type {import('jest').Config} */
module.exports = {
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^public/(.*)$": "<rootDir>/public/$1",
  },
  transform: {
    [`/node_modules/(?:${ESM_DEPS}).+\\.js$`]: [
      "babel-jest",
      { babelrc: false, configFile: false, presets: ["next/babel"] },
    ],
    "\\.[jt]sx?$": "babel-jest",
  },
  transformIgnorePatterns: [`^(?!.*/(?:${ESM_DEPS})).*/node_modules/`],
};
