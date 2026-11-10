import { toCsv } from "./csv.utility";

describe("toCsv", () => {
  it("writes the header and rows with CRLF line ends", () => {
    expect(
      toCsv(
        ["a", "b"],
        [
          [1, "x"],
          [true, null],
        ],
      ),
    ).toBe("a,b\r\n1,x\r\ntrue,\r\n");
  });

  it("quotes a cell with a comma, a quote or a line break, doubling the quotes", () => {
    expect(toCsv(["h"], [["a,b"], ['say "hi"'], ["two\nlines"]])).toBe(
      'h\r\n"a,b"\r\n"say ""hi"""\r\n"two\nlines"\r\n',
    );
  });

  it("neutralizes text a spreadsheet would run as a formula, but not a number", () => {
    const csv = toCsv(["h"], [["=SUM(A1)"], ["+1"], ["-1"], ["@x"], ["\tx"], [-5], ["safe=1"]]);

    expect(csv).toBe("h\r\n'=SUM(A1)\r\n'+1\r\n'-1\r\n'@x\r\n'\tx\r\n-5\r\nsafe=1\r\n");
  });

  it("quotes a formula cell that also needs quoting", () => {
    expect(toCsv(["h"], [["=a,b"]])).toBe('h\r\n"\'=a,b"\r\n');
  });
});
