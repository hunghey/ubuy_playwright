/**
 * Brand API Test Suite
 *
 * This file contains tests for Brand-related API endpoints:
 * - API 3: GET All Brands List (positive scenario)
 * - API 4: PUT to All Brands List (negative scenario - method not allowed)
 */

import { test, expect } from "@playwright/test";
import { ApiClient } from "../../utils/apiClient";
import { BrandsResponse, ResponseCode } from "../../utils/apiTypes";
import { HTTP_STATUS, API_MESSAGES } from "../../test-data/shared/contants";

test.describe("Brand API Tests", () => {
  let apiClient: ApiClient;

  // Setup: Initialize API client before each test
  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });

  /**
   * API 3: GET All Brands List
   * Positive Scenario: Retrieve all brands successfullyTC-CU-001: Should submit contact form successfully with file upload
   * Expected: 200 status code, valid brands array with brand details
   */
  test("API 3 - GET All Brands List - Should return all brands successfully", async () => {
    // Make GET request to brands list endpoint
    const response = await apiClient.get("/brandsList");

    // Validate HTTP status code is 200 OK
    await apiClient.validateStatusCode(response, HTTP_STATUS.OK);

    // Parse response body as JSON
    const responseBody: BrandsResponse =
      await apiClient.parseJsonResponse(response);

    // Validate response code field in JSON
    apiClient.validateResponseCode(responseBody, ResponseCode.OK);

    // Validate brands array exists and is not empty
    expect(responseBody.brands).toBeDefined();
    apiClient.validateArrayNotEmpty(responseBody.brands, "brands");

    // Validate first brand has required fields
    const firstBrand = responseBody.brands[0];
    apiClient.validateObjectProperties(firstBrand, ["id", "brand"]);

    // Validate brand ID is a number
    expect(typeof firstBrand.id).toBe("number");
    expect(firstBrand.id).toBeGreaterThan(0);

    // Validate brand name is not empty
    expect(firstBrand.brand).toBeTruthy();
    expect(firstBrand.brand.length).toBeGreaterThan(0);

    // Log number of brands retrieved
    console.log(`Total brands retrieved: ${responseBody.brands.length}`);
  });

  /**
   * API 3 - GET All Brands List - Additional Validation
   * Positive Scenario: Verify all brands have unique IDs and valid data
   */
  test("API 3 - GET All Brands List - Should have unique IDs and consistent data structure", async () => {
    const response = await apiClient.get("/brandsList");
    const responseBody: BrandsResponse =
      await apiClient.parseJsonResponse(response);

    // Collect all brand IDs to check for uniqueness
    const brandIds = responseBody.brands.map((brand) => brand.id);
    const uniqueBrandIds = new Set(brandIds);

    // Validate all IDs are unique
    expect(brandIds.length).toBe(uniqueBrandIds.size);

    // Validate every brand has required fields with soft assertions
    responseBody.brands.forEach((brand, index) => {
      expect
        .soft(brand.id, `Brand at index ${index} should have id`)
        .toBeDefined();
      expect
        .soft(brand.brand, `Brand at index ${index} should have brand name`)
        .toBeDefined();
      expect.soft(typeof brand.id, `Brand ID should be number`).toBe("number");
      expect
        .soft(typeof brand.brand, `Brand name should be string`)
        .toBe("string");
    });

    // Validate no empty brand names
    const emptyBrandNames = responseBody.brands.filter(
      (brand) => !brand.brand || brand.brand.trim().length === 0,
    );
    expect(emptyBrandNames.length).toBe(0);
  });

  /**
   * API 3 - GET All Brands List - Data Integrity
   * Verify brand names are properly formatted
   */
  test("API 3 - GET All Brands List - Should have properly formatted brand names", async () => {
    const response = await apiClient.get("/brandsList");
    const responseBody: BrandsResponse =
      await apiClient.parseJsonResponse(response);

    // Validate each brand name
    responseBody.brands.forEach((brand) => {
      // Brand name should not be excessively long
      expect.soft(brand.brand.length).toBeLessThan(100);

      // Brand name should not contain only whitespace
      expect.soft(brand.brand.trim().length).toBeGreaterThan(0);
    });

    // Log some sample brands
    console.log(
      "Sample brands:",
      responseBody.brands.slice(0, 5).map((b) => b.brand),
    );
  });

  /**
   * API 4: PUT to All Brands List
   * Negative Scenario: PUT method should not be allowed
   * Expected: 405 Method Not Allowed status code
   */
  test("API 4 - PUT to All Brands List - Should return 405 Method Not Allowed", async () => {
    // Make PUT request to brands list endpoint (should fail)
    const response = await apiClient.put("/brandsList");

    // Parse response body
    const responseBody = await apiClient.parseJsonResponse(response);

    // Validate response code in JSON
    apiClient.validateResponseCode(
      responseBody,
      ResponseCode.METHOD_NOT_ALLOWED,
    );

    // Validate error message
    apiClient.validateResponseMessage(
      responseBody,
      API_MESSAGES.METHOD_NOT_SUPPORTED,
    );
  });

  /**
   * API 4 - PUT to All Brands List - With Data
   * Negative Scenario: PUT method with data should still not be allowed
   */
  test("API 4 - PUT to All Brands List with data - Should return 405 Method Not Allowed", async () => {
    // Attempt PUT with dummy data
    const response = await apiClient.put("/brandsList", {
      id: "999",
      brand: "Test Brand",
    });

    const responseBody = await apiClient.parseJsonResponse(response);

    // Validate response code in JSON
    apiClient.validateResponseCode(
      responseBody,
      ResponseCode.METHOD_NOT_ALLOWED,
    );

    apiClient.validateResponseMessage(
      responseBody,
      API_MESSAGES.METHOD_NOT_SUPPORTED,
    );
  });

  /**
   * Performance Test: Response Time Validation
   * Verify API responds within acceptable timeframe
   */
  test("API 3 - GET All Brands List - Should respond within 5 seconds", async () => {
    const startTime = Date.now();

    const response = await apiClient.get("/brandsList");

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Validate response time is under 5 seconds
    expect(responseTime).toBeLessThan(5000);
    console.log(`Response time: ${responseTime}ms`);

    // Ensure request was still successful
    await apiClient.validateStatusCode(response, HTTP_STATUS.OK);
  });
});
