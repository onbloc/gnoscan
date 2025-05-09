import Head from "next/head";

const Meta = () => (
  <>
    <Head>
      <title>GnoScan - Gno.land Blockchain Explorer</title>
      <link rel="icon" href="/favicon.svg" />
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta property="author" content="onbloc" />
      <meta
        name="description"
        content="GnoScan is a Gno.land blockchain explorer, making on-chain data readable and intuitive for everyone."
        key="desc"
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="GnoScan: A reliable Gno.land blockchain explorer" key="og:title" />
      <meta
        property="og:description"
        content="GnoScan is a Gno.land blockchain explorer, making on-chain data readable and intuitive for everyone."
        key="og:desc"
      />
      <meta property="og:image" content="https://gnoscan.io/gnoscan-thumb.png" key="og:image" />
    </Head>
  </>
);

export default Meta;
