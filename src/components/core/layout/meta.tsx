import Head from 'next/head';

const Meta = () => (
  <>
    <Head>
      <title>Gnoscan - Gnoland Blockchain Explorer</title>
      <link rel="icon" href="/favicon.svg" />
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta property="author" content="onbloc" />
      <meta
        name="description"
        content="Gnoscan is a Gnoland blockchain explorer, making on-chain data readable and intuitive for everyone."
        key="desc"
      />
      <meta property="og:type" content="website" />
      <meta
        property="og:title"
        content="Gnoscan: A reliable Gnoland blockchain explorer"
        key="og:title"
      />
      <meta
        property="og:description"
        content="Gnoscan is a Gnoland blockchain explorer, making on-chain data readable and intuitive for everyone."
        key="og:desc"
      />
      <meta property="og:image" content="https://gnoscan.io/gnoscan-thumb.png" key="og:image" />
    </Head>
  </>
);

export default Meta;
