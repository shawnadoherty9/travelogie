import { describe, it, expect } from "vitest";
import {
  validateRequiredFields,
  validateAtLeastOneOffering,
  validateOfferingFields,
  clearOfferingErrors,
} from "./registrationValidation";

describe("validateRequiredFields", () => {
  it("returns no errors when all fields have values", () => {
    const errors = validateRequiredFields([
      { key: "firstName", value: "Ada", label: "First name" },
      { key: "email", value: "a@b.co", label: "Email" },
    ]);
    expect(errors).toEqual({});
  });

  it("returns an error for empty strings", () => {
    const errors = validateRequiredFields([
      { key: "firstName", value: "", label: "First name" },
    ]);
    expect(errors).toEqual({ firstName: "First name is required" });
  });

  it("treats whitespace-only values as missing", () => {
    const errors = validateRequiredFields([
      { key: "city", value: "   ", label: "City" },
    ]);
    expect(errors.city).toBe("City is required");
  });

  it("collects multiple missing fields", () => {
    const errors = validateRequiredFields([
      { key: "a", value: "", label: "A" },
      { key: "b", value: "ok", label: "B" },
      { key: "c", value: "", label: "C" },
    ]);
    expect(Object.keys(errors)).toEqual(["a", "c"]);
  });
});

describe("validateAtLeastOneOffering", () => {
  it("returns an error when array is empty", () => {
    expect(validateAtLeastOneOffering([], "tours", "tour")).toEqual({
      tours: "Please add at least one tour",
    });
  });

  it("returns no errors when at least one offering exists", () => {
    expect(validateAtLeastOneOffering([{ id: 1 }], "tours", "tour")).toEqual({});
  });
});

describe("validateOfferingFields", () => {
  it("delegates to validateRequiredFields", () => {
    expect(
      validateOfferingFields([{ key: "title", value: "", label: "Title" }]),
    ).toEqual({ title: "Title is required" });
  });
});

describe("clearOfferingErrors", () => {
  it("removes specified keys without mutating input", () => {
    const prev = { a: "x", b: "y", c: "z" };
    const next = clearOfferingErrors(prev, ["a", "c"]);
    expect(next).toEqual({ b: "y" });
    expect(prev).toEqual({ a: "x", b: "y", c: "z" });
  });

  it("is a no-op when keys are not present", () => {
    expect(clearOfferingErrors({ a: "x" }, ["b"])).toEqual({ a: "x" });
  });
});
