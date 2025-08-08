import { hasStorageDepositProperties, convertToStorageDeposit } from "./storage-deposit-util";
import { StorageDeposit } from "@/models/storage-deposit-model";

describe("storage-deposit-util", () => {
  describe("hasStorageDepositProperties", () => {
    // True
    it("should return true for object with numeric storage and deposit", () => {
      const input = { storage: 100, deposit: 200 };
      expect(hasStorageDepositProperties(input)).toBe(true);
    });

    it("should return true for object with string storage and deposit", () => {
      const input = { storage: "100", deposit: "200" };
      expect(hasStorageDepositProperties(input)).toBe(true);
    });

    it("should return true for object with zero values", () => {
      const input = { storage: 0, deposit: 0 };
      expect(hasStorageDepositProperties(input)).toBe(true);
    });

    it("should return true for object with null storage and deposit", () => {
      const input = { storage: null, deposit: null };
      expect(hasStorageDepositProperties(input)).toBe(true);
    });

    it("should return true for object with undefined storage and deposit", () => {
      const input = { storage: undefined, deposit: undefined };
      expect(hasStorageDepositProperties(input)).toBe(true);
    });

    it("should return true for object with extra properties", () => {
      const input = { storage: 100, deposit: 200, extraProp: "extra" };
      expect(hasStorageDepositProperties(input)).toBe(true);
    });

    // False
    it("should return false for null input", () => {
      expect(hasStorageDepositProperties(null)).toBe(false);
    });

    it("should return false for undefined input", () => {
      expect(hasStorageDepositProperties(undefined)).toBe(false);
    });

    it("should return false for empty object", () => {
      expect(hasStorageDepositProperties({})).toBe(false);
    });

    it("should return false for object missing storage property", () => {
      const input = { deposit: 200 };
      expect(hasStorageDepositProperties(input)).toBe(false);
    });

    it("should return false for object missing deposit property", () => {
      const input = { storage: 100 };
      expect(hasStorageDepositProperties(input)).toBe(false);
    });

    it("should return false for object with typo in storage property", () => {
      const input = { storge: 100, deposit: 200 };
      expect(hasStorageDepositProperties(input)).toBe(false);
    });

    it("should return false for object with case-sensitive property names", () => {
      const input = { STORAGE: 100, DEPOSIT: 200 };
      expect(hasStorageDepositProperties(input)).toBe(false);
    });

    it("should return false for string input", () => {
      expect(hasStorageDepositProperties("string")).toBe(false);
    });

    it("should return false for number input", () => {
      expect(hasStorageDepositProperties(123)).toBe(false);
    });

    it("should return false for array input", () => {
      expect(hasStorageDepositProperties([])).toBe(false);
    });
  });

  describe("convertToStorageDeposit", () => {
    it("should convert string values to StorageDeposit object", () => {
      const input = { storage: "100", deposit: "200" };
      const expected = { storage: 100, deposit: 200 };
      expect(convertToStorageDeposit(input)).toEqual(expected);
    });

    it("should handle numeric values correctly", () => {
      const input = { storage: 100, deposit: 200 };
      const expected = { storage: 100, deposit: 200 };
      expect(convertToStorageDeposit(input)).toEqual(expected);
    });

    it("should handle zero values correctly", () => {
      const input = { storage: 0, deposit: "0" };
      const expected = { storage: 0, deposit: 0 };
      expect(convertToStorageDeposit(input)).toEqual(expected);
    });

    it("should handle mixed types correctly", () => {
      const input = { storage: 100, deposit: "200" };
      const expected = { storage: 100, deposit: 200 };
      expect(convertToStorageDeposit(input)).toEqual(expected);
    });

    it("should ignore extra properties", () => {
      const input = { storage: 100, deposit: 200, extraProp: "should be ignored" };
      const expected = { storage: 100, deposit: 200 };
      expect(convertToStorageDeposit(input)).toEqual(expected);
    });

    it("should return null for invalid storage string", () => {
      const input = { storage: "abc", deposit: "200" };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null for invalid deposit string", () => {
      const input = { storage: "100", deposit: "xyz" };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null for empty storage string", () => {
      const input = { storage: "", deposit: "200" };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null for empty deposit string", () => {
      const input = { storage: "100", deposit: "" };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null for whitespace storage string", () => {
      const input = { storage: "   ", deposit: "200" };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null for whitespace deposit string", () => {
      const input = { storage: "100", deposit: "   " };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null for null storage value", () => {
      const input = { storage: null, deposit: 200 };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null for undefined deposit value", () => {
      const input = { storage: 100, deposit: undefined };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null for boolean storage value", () => {
      const input = { storage: true, deposit: 200 };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null for boolean deposit value", () => {
      const input = { storage: 100, deposit: false };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null for object storage value", () => {
      const input = { storage: {}, deposit: 200 };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null for array deposit value", () => {
      const input = { storage: 100, deposit: [] };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    // Cases of missing fields
    it("should return null for empty object", () => {
      const input = {};
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null when storage field is missing", () => {
      const input = { deposit: 200 };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null when deposit field is missing", () => {
      const input = { storage: 100 };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null when both fields are missing", () => {
      const input = { someOtherField: "value" };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    // Typo cases
    it("should return null for storage field typo (storge)", () => {
      const input = { storge: 100, deposit: 200 };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null for storage field typo (storag)", () => {
      const input = { storag: 100, deposit: 200 };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null for deposit field typo (deposite)", () => {
      const input = { storage: 100, deposite: 200 };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null for deposit field typo (depost)", () => {
      const input = { storage: 100, depost: 200 };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null for both fields with typos", () => {
      const input = { storge: 100, deposite: 200 };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    // Case sensitivity
    it("should return null for uppercase STORAGE field", () => {
      const input = { STORAGE: 100, deposit: 200 };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null for uppercase DEPOSIT field", () => {
      const input = { storage: 100, DEPOSIT: 200 };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null for both fields in uppercase", () => {
      const input = { STORAGE: 100, DEPOSIT: 200 };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null for camelCase Storage field", () => {
      const input = { Storage: 100, deposit: 200 };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null for camelCase Deposit field", () => {
      const input = { storage: 100, Deposit: 200 };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null for mixed case fields", () => {
      const input = { sToRaGe: 100, dEpOsIt: 200 };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    // Underscores/Hyphenated Cases
    it("should return null for snake_case storage_field", () => {
      const input = { storage_field: 100, deposit: 200 };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null for kebab-case storage-field", () => {
      const input = { "storage-field": 100, deposit: 200 };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null for storage with underscore", () => {
      const input = { storage_: 100, deposit: 200 };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null for deposit with underscore", () => {
      const input = { storage: 100, deposit_: 200 };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    // Existing invalid value tests...
    it("should return null for invalid storage string", () => {
      const input = { storage: "abc", deposit: "200" };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null for invalid deposit string", () => {
      const input = { storage: "100", deposit: "xyz" };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null for empty storage string", () => {
      const input = { storage: "", deposit: "200" };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null for empty deposit string", () => {
      const input = { storage: "100", deposit: "" };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null for whitespace storage string", () => {
      const input = { storage: "   ", deposit: "200" };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null for whitespace deposit string", () => {
      const input = { storage: "100", deposit: "   " };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null for null storage value", () => {
      const input = { storage: null, deposit: 200 };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null for undefined deposit value", () => {
      const input = { storage: 100, deposit: undefined };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null for boolean storage value", () => {
      const input = { storage: true, deposit: 200 };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null for boolean deposit value", () => {
      const input = { storage: 100, deposit: false };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null for object storage value", () => {
      const input = { storage: {}, deposit: 200 };
      expect(convertToStorageDeposit(input)).toBeNull();
    });

    it("should return null for array deposit value", () => {
      const input = { storage: 100, deposit: [] };
      expect(convertToStorageDeposit(input)).toBeNull();
    });
  });
});
