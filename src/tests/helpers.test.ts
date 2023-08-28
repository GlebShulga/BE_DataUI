import { validateInput, shortenPublicHoliday } from "./helpers";
import { SUPPORTED_COUNTRIES } from "./config";

describe("validateInput", () => {
  it("should return true for valid input", () => {
    const result = validateInput({
      year: new Date().getFullYear(),
      country: SUPPORTED_COUNTRIES[0],
    });
    expect(result).toBe(true);
  });

  it("should throw an error for an unsupported country", () => {
    expect(() => {
      validateInput({ country: "InvalidCountry" });
    }).toThrowError(
      "Country provided is not supported, received: InvalidCountry"
    );
  });

  it("should throw an error for a non-current year", () => {
    expect(() => {
      validateInput({ year: 2000 });
    }).toThrowError("Year provided not the current, received: 2000");
  });
});

describe("shortenPublicHoliday", () => {
  it("should return a shortened holiday object", () => {
    const holiday = {
      name: "New Year",
      localName: "New Year",
      date: "2023-01-01",
      countryCode: "GB",
      fixed: true,
      global: true,
      counties: ["GB", "FR"],
      launchYear: 2020,
      types: ["Public"],
    };

    const result = shortenPublicHoliday(holiday);

    expect(result).toEqual({
      name: "New Year",
      localName: "New Year",
      date: "2023-01-01",
    });
  });
});
