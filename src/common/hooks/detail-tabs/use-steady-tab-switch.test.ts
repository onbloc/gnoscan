import { getSteadyContentMinHeight } from "./use-steady-tab-switch";

describe("getSteadyContentMinHeight", () => {
  it("pads a shorter tab by exactly the height the scroll position needs", () => {
    // At scrollY 931 with a 900px viewport, the document must stay 1831px tall.
    expect(getSteadyContentMinHeight(931, 900, 1460, 300)).toBe(300 + 371);
  });

  it("pads an empty tab the same way", () => {
    expect(getSteadyContentMinHeight(931, 900, 1200, 40)).toBe(40 + 631);
  });

  it("leaves a tab that is already tall enough unpadded", () => {
    expect(getSteadyContentMinHeight(931, 900, 2605, 1500)).toBeNull();
    expect(getSteadyContentMinHeight(931, 900, 1831, 1500)).toBeNull();
  });

  it("never pads at the top of the page", () => {
    expect(getSteadyContentMinHeight(0, 900, 900, 100)).toBeNull();
  });
});
