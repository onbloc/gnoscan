import { parseABCIKeyValueResponse, stringToBase64 } from "./utility";

describe("parseABCIKeyValueResponse", () => {
  it("should return empty object for null input", () => {
    expect(parseABCIKeyValueResponse(null)).toEqual({});
  });

  it("should correctly parse key-value pairs with single digit values", () => {
    const inputString = "storage: 5\ndeposit: 7";
    const base64Input = stringToBase64(inputString);

    const result = parseABCIKeyValueResponse(base64Input);

    expect(result).toEqual({
      storage: "5",
      deposit: "7",
    });
  });

  it("should correctly parse key-value pairs with multi-digit values", () => {
    const inputString = "storage: 1234\ndeposit: 5678";
    const base64Input = stringToBase64(inputString);

    const result = parseABCIKeyValueResponse(base64Input);

    expect(result).toEqual({
      storage: "1234",
      deposit: "5678",
    });
  });

  it("should handle various whitespace formats", () => {
    const inputString = "  storage:  100 \n deposit:200\nusage:  300  ";
    const base64Input = stringToBase64(inputString);

    const result = parseABCIKeyValueResponse(base64Input);

    expect(result).toEqual({
      storage: "100",
      deposit: "200",
      usage: "300",
    });
  });

  it("should handle keys with underscores and alphanumeric characters", () => {
    const inputString = "total_storage: 100\nuser123_deposit: 200";
    const base64Input = stringToBase64(inputString);

    const result = parseABCIKeyValueResponse(base64Input);

    expect(result).toEqual({
      total_storage: "100",
      user123_deposit: "200",
    });
  });

  it("should return empty object when no matches are found", () => {
    const inputString = "no key-value pairs here";
    const base64Input = stringToBase64(inputString);

    const result = parseABCIKeyValueResponse(base64Input);

    expect(result).toEqual({});
  });

  it("should handle empty string input", () => {
    const inputString = "";
    const base64Input = stringToBase64(inputString);

    const result = parseABCIKeyValueResponse(base64Input);

    expect(result).toEqual({});
  });

  it("should handle invalid base64 input by returning empty object", () => {
    const invalidBase64 = "!@#$%^&*()";

    const result = parseABCIKeyValueResponse(invalidBase64);

    expect(result).toEqual({});
  });

  it("should handle zero values", () => {
    const inputString = "storage: 0\ndeposit: 0";
    const base64Input = stringToBase64(inputString);

    const result = parseABCIKeyValueResponse(base64Input);

    expect(result).toEqual({
      storage: "0",
      deposit: "0",
    });
  });

  it("should handle very large numbers", () => {
    const inputString = "storage: 999999999999999\ndeposit: 123456789012345";
    const base64Input = stringToBase64(inputString);

    const result = parseABCIKeyValueResponse(base64Input);

    expect(result).toEqual({
      storage: "999999999999999",
      deposit: "123456789012345",
    });
  });

  it("should handle keys starting with uppercase letters", () => {
    const inputString = "Storage: 100\nDeposit: 200\nUSER_ID: 300";
    const base64Input = stringToBase64(inputString);

    const result = parseABCIKeyValueResponse(base64Input);

    expect(result).toEqual({
      Storage: "100",
      Deposit: "200",
      USER_ID: "300",
    });
  });

  it("should handle mixed case keys", () => {
    const inputString = "totalStorage: 100\nUserDeposit: 200\nmaxUsage: 300";
    const base64Input = stringToBase64(inputString);

    const result = parseABCIKeyValueResponse(base64Input);

    expect(result).toEqual({
      totalStorage: "100",
      UserDeposit: "200",
      maxUsage: "300",
    });
  });

  it("should handle keys with numbers at the end", () => {
    const inputString = "user1: 100\nuser2: 200\nuser123: 300";
    const base64Input = stringToBase64(inputString);

    const result = parseABCIKeyValueResponse(base64Input);

    expect(result).toEqual({
      user1: "100",
      user2: "200",
      user123: "300",
    });
  });

  it("should handle keys with numbers in the middle", () => {
    const inputString = "user1Storage: 100\nuser2Deposit: 200";
    const base64Input = stringToBase64(inputString);

    const result = parseABCIKeyValueResponse(base64Input);

    expect(result).toEqual({
      user1Storage: "100",
      user2Deposit: "200",
    });
  });

  it("should ignore keys starting with numbers", () => {
    const inputString = "1storage: 100\n2deposit: 200\nstorage: 300";
    const base64Input = stringToBase64(inputString);

    const result = parseABCIKeyValueResponse(base64Input);

    expect(result).toEqual({
      storage: "300",
    });
  });

  it("should ignore keys starting with special characters", () => {
    const inputString = "_storage: 100\n-deposit: 200\n$amount: 300\nstorage: 400";
    const base64Input = stringToBase64(inputString);

    const result = parseABCIKeyValueResponse(base64Input);

    expect(result).toEqual({
      storage: "400",
    });
  });

  it("should ignore keys with special characters (except underscore)", () => {
    const inputString = "storage-test: 100\nstorage@test: 200\nstorage_test: 300";
    const base64Input = stringToBase64(inputString);

    const result = parseABCIKeyValueResponse(base64Input);

    expect(result).toEqual({
      storage_test: "300",
    });
  });

  it("should handle both numeric and non-numeric values", () => {
    const inputString = "storage: abc\ndeposit: 123\nusage: 456def\namount: 789";
    const base64Input = stringToBase64(inputString);

    const result = parseABCIKeyValueResponse(base64Input);

    expect(result).toEqual({
      deposit: "123",
      amount: "789",
      storage: "abc",
      usage: "456def",
    });
  });

  it("should handle negative numbers", () => {
    const inputString = "storage: -100\ndeposit: 200\nusage: -300";
    const base64Input = stringToBase64(inputString);

    const result = parseABCIKeyValueResponse(base64Input);

    expect(result).toEqual({
      deposit: "200",
      storage: "-100",
      usage: "-300",
    });
  });

  it("should handle decimal numbers", () => {
    const inputString = "storage: 100.5\ndeposit: 200\nusage: 300.99";
    const base64Input = stringToBase64(inputString);

    const result = parseABCIKeyValueResponse(base64Input);

    expect(result).toEqual({
      deposit: "200",
      storage: "100.5",
      usage: "300.99",
    });
  });

  it("should handle different line separators", () => {
    const inputString = "storage: 100\r\ndeposit: 200\rusage: 300";
    const base64Input = stringToBase64(inputString);

    const result = parseABCIKeyValueResponse(base64Input);

    expect(result).toEqual({
      storage: "100",
      deposit: "200",
      usage: "300",
    });
  });

  it("should handle tabs and mixed whitespace", () => {
    const inputString = "storage:\t100\ndeposit: \t200\nusage:\t\t300";
    const base64Input = stringToBase64(inputString);

    const result = parseABCIKeyValueResponse(base64Input);

    expect(result).toEqual({
      storage: "100",
      deposit: "200",
      usage: "300",
    });
  });

  it("should handle duplicate keys (last one wins)", () => {
    const inputString = "storage: 100\ndeposit: 200\nstorage: 300";
    const base64Input = stringToBase64(inputString);

    const result = parseABCIKeyValueResponse(base64Input);

    expect(result).toEqual({
      storage: "300", // Last value retained
      deposit: "200",
    });
  });

  it("should ignore lines without colon", () => {
    const inputString = "storage 100\ndeposit: 200\nusage 300\namount: 400";
    const base64Input = stringToBase64(inputString);

    const result = parseABCIKeyValueResponse(base64Input);

    expect(result).toEqual({
      deposit: "200",
      amount: "400",
    });
  });

  it("should handle single key-value pair", () => {
    const inputString = "storage: 100";
    const base64Input = stringToBase64(inputString);

    const result = parseABCIKeyValueResponse(base64Input);

    expect(result).toEqual({
      storage: "100",
    });
  });

  it("should handle only whitespace input", () => {
    const inputString = "   \n\t\r\n   ";
    const base64Input = stringToBase64(inputString);

    const result = parseABCIKeyValueResponse(base64Input);

    expect(result).toEqual({});
  });

  it("should handle input with only invalid patterns", () => {
    const inputString = "invalid format\n123: abc\n_key: 456\nkey-name: 789";
    const base64Input = stringToBase64(inputString);

    const result = parseABCIKeyValueResponse(base64Input);

    expect(result).toEqual({});
  });

  it("should handle mixed valid and invalid patterns", () => {
    const inputString = "valid: 100\ninvalid format\n123: 200\nstorage: 300\n_invalid: 400";
    const base64Input = stringToBase64(inputString);

    const result = parseABCIKeyValueResponse(base64Input);

    expect(result).toEqual({
      valid: "100",
      storage: "300",
    });
  });
});
