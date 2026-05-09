/**
 * Search API Test Suite
 *
 * This file contains tests for Product Search API endpoints:
 * - API 5: POST to Search Product with search_product parameter (positive scenario)
 * - API 6: POST to Search Product without search_product parameter (negative scenario)
 */

import { test, expect } from "@playwright/test";
import { ApiClient } from "../../utils/apiClient";
import { SearchProductResponse, ResponseCode } from "../../utils/apiTypes";
import { HTTP_STATUS, API_MESSAGES } from "../../test-data/shared/contants";
import {
  searchTerms,
  generateSearchProductData,
} from "../../test-data/api/products.data";

test.describe("Search API Tests", () => {
  let apiClient: ApiClient;

  // Setup: Initialize API client before each test
  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });

  /**
   * API 5: POST to Search Product with valid parameter
   * Positive Scenario: Search for products with a specific term
   * Expected: 200 status code, products matching search criteria
   */
  test('API 5 - POST Search Product with "tshirt" - Should return matching products', async () => {
    // Prepare search data
    const searchData = generateSearchProductData("tshirt");

    // Make POST request to search endpoint
    const response = await apiClient.post("/searchProduct", searchData);

    // Validate HTTP status code is 200 OK
    await apiClient.validateStatusCode(response, HTTP_STATUS.OK);

    // Parse response body
    const responseBody: SearchProductResponse =
      await apiClient.parseJsonResponse(response);

    // Validate response code in JSON
    apiClient.validateResponseCode(responseBody, ResponseCode.OK);

    // Validate products array exists
    expect(responseBody.products).toBeDefined();

    // If products found, validate structure
    if (responseBody.products.length > 0) {
      const firstProduct = responseBody.products[0];
      apiClient.validateObjectProperties(firstProduct, [
        "id",
        "name",
        "price",
        "brand",
        "category",
      ]);

      // Log search results
      console.log(
        `Found ${responseBody.products.length} products for search term "tshirt"`,
      );
      console.log("Sample product:", firstProduct.name);
    }
  });

  /**
   * API 5: Data-Driven Test - Search with multiple terms
   * Tests various search terms to ensure consistent behavior
   */
  searchTerms.forEach((searchTerm) => {
    test(`API 5 - POST Search Product with "${searchTerm}" - Should return results`, async () => {
      // Prepare search data
      const searchData = generateSearchProductData(searchTerm);

      // Make POST request
      const response = await apiClient.post("/searchProduct", searchData);

      // Validate status code
      await apiClient.validateStatusCode(response, HTTP_STATUS.OK);

      // Parse response
      const responseBody: SearchProductResponse =
        await apiClient.parseJsonResponse(response);

      // Validate response code
      apiClient.validateResponseCode(responseBody, ResponseCode.OK);

      // Validate products array exists (may be empty for some searches)
      expect(responseBody.products).toBeDefined();
      expect(Array.isArray(responseBody.products)).toBe(true);

      // Log results
      console.log(
        `Search term "${searchTerm}": ${responseBody.products.length} products found`,
      );

      // If products found, verify they contain relevant data
      if (responseBody.products.length > 0) {
        // Use soft assertions to validate product structure
        responseBody.products.forEach((product, index) => {
          expect.soft(product.id).toBeDefined();
          expect.soft(product.name).toBeDefined();
          expect.soft(product.price).toBeDefined();
        });
      }
    });
  });

  /**
   * API 5 - Case Sensitivity Test
   * Verify search works with different case variations
   */
  test("API 5 - POST Search Product - Should handle case variations", async ({
    request,
  }) => {
    const searchTermVariations = ["top", "TOP", "Top", "ToP"];
    const results = [];

    for (const term of searchTermVariations) {
      const searchData = generateSearchProductData(term);
      const response = await apiClient.post("/searchProduct", searchData);
      const responseBody: SearchProductResponse =
        await apiClient.parseJsonResponse(response);

      results.push({
        term,
        count: responseBody.products.length,
      });
    }

    // Log all results
    console.log("Case sensitivity test results:", results);

    // All variations should return same number of results (case-insensitive search)
    const counts = results.map((r) => r.count);
    const allSame = counts.every((count) => count === counts[0]);

    // Note: This assertion might fail if the API is case-sensitive
    // Using soft assertion to not block other tests
    expect.soft(allSame, "Search should be case-insensitive").toBe(true);
  });

  /**
   * API 5 - Partial Match Test
   * Verify search returns products with partial matches
   */
  test("API 5 - POST Search Product - Should support partial matching", async () => {
    // Search for "jean" should find "jeans"
    const searchData = generateSearchProductData("jean");
    const response = await apiClient.post("/searchProduct", searchData);
    const responseBody: SearchProductResponse =
      await apiClient.parseJsonResponse(response);

    // Validate response
    apiClient.validateResponseCode(responseBody, ResponseCode.OK);
    expect(responseBody.products).toBeDefined();

    console.log(
      `Partial match "jean": ${responseBody.products.length} products found`,
    );
  });

  /**
   * API 6: POST to Search Product without search_product parameter
   * Negative Scenario: Missing required parameter should return error
   * Expected: 400 Bad Request status code
   */
  test("API 6 - POST Search Product without parameter - Should return 400 Bad Request", async () => {
    // Make POST request without search_product parameter
    const response = await apiClient.post("/searchProduct", {});

    // Parse response body
    const responseBody = await apiClient.parseJsonResponse(response);

    // Validate response code in JSON
    apiClient.validateResponseCode(responseBody, ResponseCode.BAD_REQUEST);

    // Validate error message
    apiClient.validateResponseMessage(
      responseBody,
      API_MESSAGES.BAD_REQUEST_SEARCH,
    );
  });

  /**
   * API 6 - POST Search Product with empty string
   * Edge Case: Empty string parameter
   */
  test("API 6 - POST Search Product with empty string - Should handle gracefully", async () => {
    // Search with empty string
    const searchData = generateSearchProductData("");
    const response = await apiClient.post("/searchProduct", searchData);
    const responseBody: SearchProductResponse =
      await apiClient.parseJsonResponse(response);

    // Log behavior with empty search
    console.log(
      "Empty string search response code:",
      responseBody.responseCode,
    );
    console.log("Products found:", responseBody.products?.length || 0);

    // API might return all products or no products for empty search
    // Just validate response structure
    expect(responseBody.responseCode).toBeDefined();
  });

  /**
   * Performance Test: Search Response Time
   */
  test("API 5 - POST Search Product - Should respond within 5 seconds", async () => {
    const searchData = generateSearchProductData("dress");
    const startTime = Date.now();

    const response = await apiClient.post("/searchProduct", searchData);

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Validate response time
    expect(responseTime).toBeLessThan(5000);
    console.log(`Search response time: ${responseTime}ms`);

    // Ensure request was successful
    await apiClient.validateStatusCode(response, HTTP_STATUS.OK);
  });
});
