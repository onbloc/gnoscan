import { getNextOptionIndex } from "./list-navigation.utility";

describe("getNextOptionIndex", () => {
  it("starts from the first option on Down and the last on Up", () => {
    expect(getNextOptionIndex(-1, 1, 3)).toBe(0);
    expect(getNextOptionIndex(-1, -1, 3)).toBe(2);
  });

  it("wraps around at both ends", () => {
    expect(getNextOptionIndex(2, 1, 3)).toBe(0);
    expect(getNextOptionIndex(0, -1, 3)).toBe(2);
  });

  it("moves one step inside the list", () => {
    expect(getNextOptionIndex(0, 1, 3)).toBe(1);
    expect(getNextOptionIndex(2, -1, 3)).toBe(1);
  });
});
