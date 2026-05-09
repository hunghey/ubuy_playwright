/**
 * Product API Test Suite
 *
 * This file contains tests for Product-related API endpoints:
 * - API 1: GET All Products List (positive scenario)
 * - API 2: POST to All Products List (negative scenario - method not allowed)
 */

import { test, expect } from "@playwright/test";
import { ApiClient } from "../../utils/apiClient";
import {
  ProductsResponse,
  ResponseCode,
  ResponseMessage,
} from "../../utils/apiTypes";
import { HTTP_STATUS, API_MESSAGES } from "../../test-data/shared/contants";

test.describe("Product API Tests", () => {
  let apiClient: ApiClient;

  // Setup: Initialize API client before each test
  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });

  /**
   * API 1: GET All Products List
   * Positive Scenario: Retrieve all products successfully
   * Expected: 200 status code, valid products array with product details
   */
  test("API 1 - GET All Products List - Should return all products successfully", async () => {
    // Make GET request to products list endpoint
    const response = await apiClient.get("/productsList");

    // Validate HTTP status code is 200 OK
    await apiClient.validateStatusCode(response, HTTP_STATUS.OK);

    // Parse response body as JSON
    const responseBody: ProductsResponse =
      await apiClient.parseJsonResponse(response);

    // Validate response code field in JSON
    apiClient.validateResponseCode(responseBody, ResponseCode.OK);

    // Validate products array exists and is not empty
    expect(responseBody.products).toBeDefined();
    apiClient.validateArrayNotEmpty(responseBody.products, "products");

    // Validate first product has all required fields
    const firstProduct = responseBody.products[0];
    apiClient.validateObjectProperties(firstProduct, [
      "id",
      "name",
      "price",
      "brand",
      "category",
    ]);

    // Validate product ID is a number
    expect(typeof firstProduct.id).toBe("number");
    expect(firstProduct.id).toBeGreaterThan(0);

    // Validate product name is not empty
    expect(firstProduct.name).toBeTruthy();
    expect(firstProduct.name.length).toBeGreaterThan(0);

    // Validate price format (should contain currency symbol or number)
    expect(firstProduct.price).toBeTruthy();

    // Validate brand exists
    expect(firstProduct.brand).toBeTruthy();

    // Validate category structure
    expect(firstProduct.category).toBeDefined();
    expect(firstProduct.category.usertype).toBeDefined();
    expect(firstProduct.category.category).toBeDefined();

    // Log number of products retrieved
    console.log(`Total products retrieved: ${responseBody.products.length}`);
  });

  /**
   * API 1 - GET All Products List - Additional Validation
   * Positive Scenario: Verify all products have consistent data structure
   */
  test("API 1 - GET All Products List - Should have consistent data structure for all products", async () => {
    const response = await apiClient.get("/productsList");
    const responseBody: ProductsResponse =
      await apiClient.parseJsonResponse(response);

    // Validate every product has required fields
    responseBody.products.forEach((product, index) => {
      // Use soft assertions to check all products even if one fails
      expect
        .soft(product.id, `Product at index ${index} should have id`)
        .toBeDefined();
      expect
        .soft(product.name, `Product at index ${index} should have name`)
        .toBeDefined();
      expect
        .soft(product.price, `Product at index ${index} should have price`)
        .toBeDefined();
      expect
        .soft(product.brand, `Product at index ${index} should have brand`)
        .toBeDefined();
      expect
        .soft(
          product.category,
          `Product at index ${index} should have category`,
        )
        .toBeDefined();
    });
  });

  /**
   * API 2: POST to All Products List
   * Negative Scenario: POST method should not be allowed
   * Expected: 405 Method Not Allowed status code
   */
  test("API 2 - POST to All Products List - Should return 405 Method Not Allowed", async () => {
    // Make POST request to products list endpoint (should fail)
    const response = await apiClient.post("/productsList");

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
   * API 2 - POST to All Products List - With Data
   * Negative Scenario: POST method with data should still not be allowed
   */
  test("API 2 - POST to All Products List with data - Should return 405 Method Not Allowed", async () => {
    // Attempt POST with dummy data
    const response = await apiClient.post("/productsList", {
      name: "Test Product",
      price: "100",
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
  test("API 1 - GET All Products List - Should respond within 5 seconds", async () => {
    const startTime = Date.now();

    const response = await apiClient.get("/productsList");

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Validate response time is under 5 seconds (5000ms)
    expect(responseTime).toBeLessThan(5000);
    console.log(`Response time: ${responseTime}ms`);

    // Ensure request was still successful
    await apiClient.validateStatusCode(response, HTTP_STATUS.OK);
  });
});
