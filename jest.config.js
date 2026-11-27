// These dependencies ship ESM outside the root .babelrc scope.
const ESM_DEPS = [
  "@noble/|@scure/|uuid/",
  "(?:react-markdown|rehype-sanitize|remark-parse|remark-rehype|unified|micromark|vfile|vfile-message)/",
  "(?:unist|hast|mdast|micromark|estree)-[^/]+/",
  "(?:bail|ccount|devlop|trough|zwitch|trim-lines|longest-streak|is-plain-obj)/",
  "(?:property-information|html-url-attributes|comma-separated-tokens|space-separated-tokens)/",
  "(?:decode-named-character-reference|character-entities|character-reference-invalid|parse-entities|stringify-entities)/",
].join("|");

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
