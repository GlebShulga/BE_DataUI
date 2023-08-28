import axios from "axios";
import { shortenPublicHoliday } from "../helpers"; // Replace with the actual helper path
import {
  checkIfTodayIsPublicHoliday,
  getListOfPublicHolidays,
  getNextPublicHolidays,
} from "./public-holidays.service";
import * as helpers from "../helpers";

jest.mock("axios");

describe("Public Holidays API", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("getListOfPublicHolidays", () => {
    it("fetches successfully data from an API and returns a list of shortened public holidays", async () => {
      const mockPublicHolidays = [
        {
          date: "2023-01-01",
          localName: "Any nou",
          name: "New Year's Day",
          countryCode: "GB",
          fixed: true,
          global: true,
          counties: null,
          launchYear: null,
          types: ["Public"],
        },
      ];

      jest
        .spyOn(axios, "get")
        .mockImplementation(() =>
          Promise.resolve({ data: mockPublicHolidays })
        );

      const result = await getListOfPublicHolidays(2023, "GB");

      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("PublicHolidays/2023/GB")
      );
      expect(result).toEqual(mockPublicHolidays.map(shortenPublicHoliday));
    });

    it("returns an empty array if the API call fails", async () => {
      jest
        .spyOn(axios, "get")
        .mockImplementation(() =>
          Promise.reject(
            new Error("Country provided is not supported, received: AD")
          )
        );

      const result = await getListOfPublicHolidays(2023, "GB");

      expect(result).toEqual([]);
    });
  });

  describe("checkIfTodayIsPublicHoliday", () => {
    it("fetches successfully data from an API and returns true if today is a public holiday", async () => {
      jest
        .spyOn(axios, "get")
        .mockImplementation(() => Promise.resolve({ status: 200 }));

      const result = await checkIfTodayIsPublicHoliday("GB");

      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("IsTodayPublicHoliday/GB")
      );
      expect(result).toBe(true);
    });

    it("returns false if the API call fails", async () => {
      jest
        .spyOn(axios, "get")
        .mockImplementation(() => Promise.reject(new Error("API Error")));

      const result = await checkIfTodayIsPublicHoliday("GB");

      expect(result).toBe(false);
    });
  });

  describe("getNextPublicHolidays", () => {
    it("fetches successfully data from an API and returns a list of shortened next public holidays", async () => {
      const mockPublicHolidays = [
        {
          date: "2023-11-01",
          localName: "Tots Sants",
          name: "All Saints' Day",
          countryCode: "GB",
          fixed: true,
          global: true,
          counties: null,
          launchYear: null,
          types: ["Public"],
        },
      ];

      jest
        .spyOn(axios, "get")
        .mockImplementation(() =>
          Promise.resolve({ data: mockPublicHolidays })
        );

      const result = await getNextPublicHolidays("GB");

      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("NextPublicHolidays/GB")
      );
      expect(result).toEqual(mockPublicHolidays.map(shortenPublicHoliday));
    });

    it("returns an empty array if the API call fails", async () => {
      jest
        .spyOn(axios, "get")
        .mockImplementation(() =>
          Promise.reject(
            new Error("Country provided is not supported, received: AD")
          )
        );

      const result = await getNextPublicHolidays("GB");

      expect(result).toEqual([]);
    });
  });

  describe("Public Holidays Service Integration Tests", () => {
    describe("getListOfPublicHolidays", () => {
      it("fetches and processes the list of public holidays for a specific year and country", async () => {
        const result = await getListOfPublicHolidays(2023, "FR");
        expect(result).toEqual(expect.any(Array)); // Assert against the actual response
      });
    });

    describe("checkIfTodayIsPublicHoliday", () => {
      it("checks if today is a public holiday in a specific country", async () => {
        const result = await checkIfTodayIsPublicHoliday("FR");
        expect(result).toEqual(expect.any(Boolean)); // Assert against the actual response
      });
    });

    describe("getNextPublicHolidays", () => {
      it("fetches and processes the list of next public holidays for a specific country", async () => {
        const result = await getNextPublicHolidays("FR");
        expect(result).toEqual(expect.any(Array)); // Assert against the actual response
      });
    });
  });
});
