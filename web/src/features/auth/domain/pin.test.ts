import { describe, expect, it } from "vitest";

import { validatePin } from "./pin";

describe("validatePin", () => {
  it("accepts exactly six digits", () => {
    expect(validatePin("482913", "482913")).toBeNull();
  });

  it("rejects short and non-numeric PINs", () => {
    expect(validatePin("12345")).toBe("PIN harus terdiri dari 6 angka.");
    expect(validatePin("12a456")).toBe("PIN harus terdiri dari 6 angka.");
  });

  it("rejects a mismatched confirmation", () => {
    expect(validatePin("482913", "482914")).toBe(
      "Konfirmasi PIN belum sama.",
    );
  });
});
