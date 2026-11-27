import { decodeGovernanceTitle, formatGovernanceNumber } from "./governance-util";

it("preserves fractional voting power and omits trailing zeros", () => {
  expect(formatGovernanceNumber(1.666666)).toBe("1.67");
  expect(formatGovernanceNumber(0.833333)).toBe("0.83");
  expect(formatGovernanceNumber(42.7)).toBe("42.7");
  expect(formatGovernanceNumber(3)).toBe("3");
  expect(formatGovernanceNumber(0)).toBe("0");
});

it("decodes escaped title characters as text without recursively interpreting references", () => {
  expect(decodeGovernanceTitle("A &amp; B &lt;script&gt; &#x1F600; &#39;Q&#39;")).toBe("A & B <script> 😀 'Q'");
  expect(decodeGovernanceTitle("&amp;lt;b&amp;gt;")).toBe("&lt;b&gt;");
  expect(decodeGovernanceTitle("그대로 plain title")).toBe("그대로 plain title");
});

it("replaces invalid numeric character references without throwing or overflowing", () => {
  expect(decodeGovernanceTitle("&#x110000; &#55296; &#0; &#99999999999999999999999999999999;")).toBe("� � � �");
});
