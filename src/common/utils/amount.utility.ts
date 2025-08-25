import { Amount } from "@/types";

export const AmountUtils = {
  /**
   * Check if this is a valid Amount object.
   */
  isValid(amount: Amount | null | undefined): amount is Amount {
    return !!amount && typeof amount.value === "string" && typeof amount.denom === "string";
  },

  /**
   * Create a basic Amount object.
   */
  zero(denom = ""): Amount {
    return { value: "0", denom };
  },

  /**
   * Checks if two Amount objects have the same denom.
   * @throws an error if they are different.
   */
  checkSameDenom(a: Amount, b: Amount, operation: string): void {
    if (a.denom !== b.denom) {
      throw new Error(`Cannot ${operation} amounts with different denoms: ${a.denom} and ${b.denom}`);
    }
  },

  /**
   * Adds the values of two Amount objects.
   * @param a the first Amount object
   * @param b the second Amount object
   * @returns a new Amount object representing the sum of the two Amounts
   * @throws an error if the denom of the two Amounts is different.
   */
  add(a: Amount | null | undefined, b: Amount | null | undefined): Amount {
    if (!this.isValid(a) && !this.isValid(b)) {
      return this.zero();
    }

    if (this.isValid(a) && !this.isValid(b)) {
      return { ...a };
    }

    if (!this.isValid(a) && this.isValid(b)) {
      return { ...b };
    }

    this.checkSameDenom(a!, b!, "add");

    const sum = BigInt(a!.value) + BigInt(b!.value);
    return {
      value: sum.toString(),
      denom: a!.denom,
    };
  },

  /**
   * Subtracts the second Amount from the first Amount.
   * @param a the first Amount object
   * @param b the second Amount object
   * @returns a new Amount object representing the difference between the two Amounts
   * @throws an error if the denom of the two Amounts is different.
   */
  subtract(a: Amount | null | undefined, b: Amount | null | undefined): Amount {
    if (!this.isValid(a) && !this.isValid(b)) {
      return this.zero();
    }

    if (this.isValid(a) && !this.isValid(b)) {
      return { ...a };
    }

    if (!this.isValid(a) && this.isValid(b)) {
      return {
        value: (-BigInt(b!.value)).toString(),
        denom: b!.denom,
      };
    }

    this.checkSameDenom(a!, b!, "subtract");

    const diff = BigInt(a!.value) - BigInt(b!.value);
    return {
      value: diff.toString(),
      denom: a!.denom,
    };
  },
};
