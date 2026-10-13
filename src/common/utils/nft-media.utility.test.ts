import { nftArtwork, nftMediaUrl } from "./nft-media.utility";

it("resolves IPFS artwork without duplicating its gateway prefix", () => {
  expect(nftMediaUrl("ipfs://ipfs/bafy/image.png")).toBe("https://ipfs.io/ipfs/bafy/image.png");
  expect(nftMediaUrl("ipfs://bafy/image.png")).toBe("https://ipfs.io/ipfs/bafy/image.png");
});

it("rejects executable and non-image data URLs", () => {
  expect(nftMediaUrl("javascript:alert(1)")).toBeUndefined();
  expect(nftMediaUrl("data:text/html,<script>alert(1)</script>")).toBeUndefined();
  expect(nftMediaUrl("file:///etc/passwd")).toBeUndefined();
});

it("preserves inline SVG characters and gives on-chain image data precedence", () => {
  const svg = "<svg xmlns='http://www.w3.org/2000/svg'><text># & ?</text></svg>";
  const artwork = nftArtwork({ imageData: svg, image: "https://example.com/image.png" });
  expect(artwork).toBe(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
  expect(nftArtwork({ image: "https://example.com/image.png" })).toBe("https://example.com/image.png");
});

it("uses the TokenURI image when on-chain metadata is unavailable", () => {
  const uri = "data:image/svg+xml;base64,PHN2Zy8+";
  expect(nftArtwork(null, uri)).toBe(uri);
  expect(nftArtwork({ image: "https://example.com/metadata.png" }, uri)).toBe("https://example.com/metadata.png");
  expect(nftArtwork({ image: "javascript:alert(1)" }, uri)).toBe(uri);
  expect(nftArtwork(null, "data:text/html,<script>alert(1)</script>")).toBeUndefined();
});
