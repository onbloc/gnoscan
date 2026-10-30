# dapps.json

dApp labels shown under the Function column of transaction tables.

A realm gets its label from the longest key that matches its path, looked up in:

1. The GRC20 and GRC721 lists of [gno-token-resource](https://github.com/onbloc/gno-token-resource), keyed by namespace, or by the first realm under an address namespace (`r/g1.../gnomi`)
2. `dapps.json`

gno-token-resource wins when both have the same key. A project that registers there also replaces its entry here
when its path falls under the entry's key or its website matches the entry's `url`. A realm with no match shows only
its path.

Add an entry here for a dApp that the lists do not cover, such as one without a token, one in a shared namespace
(`r/demo`, `r/gnoland`, `r/sys`), or another realm of a dApp in an address namespace.

```json
"r/g1ecsuj0q572jr0dhu29q9njtnmw03hyu7tyyvv6/kourt": {
  "name": "Kourt",
  "logo": "/images/dapps/kourt.svg",
  "url": "https://kourt.xyz"
}
```

- Key: a namespace (`r/name`) or a realm path.
- `logo`: an image URL, or a file under `public/images/dapps/`.
- `url`: optional. Without it, the logo is shown without a link.
