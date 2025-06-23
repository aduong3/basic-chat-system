import { isAlphaNumeric } from "./isAlphaNumeric";

//test cases: empty string, special characters, letters only, numbers only, alphanumeric, spaces/whitespace
describe("isAlphaNumeric", () => {
  // FALSE
  it("should return false for an empty string", () => {
    expect(isAlphaNumeric("")).toBe(false);
  });

  it("should return return false for a string with special characters", () => {
    expect(isAlphaNumeric("testing!@$")).toBe(false);
  });

  it("should return false for a string with only special characters", () => {
    expect(isAlphaNumeric("!@#$%^&*()")).toBe(false);
  });

  it("should return false for a string with whitespace", () => {
    expect(isAlphaNumeric("Testing is fun")).toBe(false);
  });

  // TRUE
  it("should return true for a string with only alphabetic letters", () => {
    expect(isAlphaNumeric("TestingIsFun")).toBe(true);
  });

  it("should return true for a string with only numbers", () => {
    expect(isAlphaNumeric("1234567890")).toBe(true);
  });

  it("should return true for a string with only alphabetic letters", () => {
    expect(isAlphaNumeric("testing12345")).toBe(true);
  });

  it("should return true for mixed upper and lowercase letters", () => {
    expect(isAlphaNumeric("TesTinG43iS2FuN1")).toBe(true);
  });

  // This is true because of the trim() function.
  it("should return true if there are any leading or trailing spaces", () => {
    expect(isAlphaNumeric(" test")).toBe(true);
    expect(isAlphaNumeric("test ")).toBe(true);
    // expect(isAlphaNumeric("te st")).toBe(true); // I wanted to see the output of the tests when you have a false tests mixed with true.
  });
});
