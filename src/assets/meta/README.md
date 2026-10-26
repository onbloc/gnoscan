# dapps.json

dApp labels shown under the Function column of transaction tables.

A realm gets its label from the first source that has it:

1. The GRC20 and GRC721 lists of [gno-token-resource](https://github.com/onbloc/gno-token-resource), matched by namespace
2. `dapps.json`
3. None, so only the realm path is shown

Add an entry here only for a dApp that the lists cannot cover, such as one in a shared namespace (`r/demo`, `r/gnoland`,
`r/sys`) or one without a token. An entry for a namespace the lists already cover is ignored.

```json
"r/gnoland/wugnot": {
  "name": "wGNOT",
  "logo": "/grc20/images/gno_land_r_demo_wugnot.svg",
  "url": "https://gno.land/r/gnoland/wugnot"
}
```

- Key: a namespace (`r/name`) or a full realm path. The longest matching key wins.
- `logo`: an image path in gno-token-resource, not in this repository.
- `url`: optional. Without it, the logo is shown without a link.
