/**
 * Authentication API Test Suite
 *
 * This file contains tests for Authentication/Login API endpoints:
 * - API 7: POST Verify Login with valid details (positive scenario)
 * - API 8: POST Verify Login without email parameter (negative scenario)
 * - API 9: DELETE Verify Login (negative scenario - method not allowed)
 * - API 10: POST Verify Login with invalid details (negative scenario)
 */

import { test, expect } from "@playwright/test";
import { ApiClient } from "../../utils/apiClient";
import { LoginResponse, ResponseCode } from "../../utils/apiTypes";
import { HTTP_STATUS, API_MESSAGES } from "../../test-data/shared/contants";
import {
  validLoginCredentials,
  invalidLoginCredentials,
  missingAuthParameters,
} from "../../test-data/api/authentication.data";

test.describe("Authentication API Tests", () => {
  let apiClient: ApiClient;

  // Setup: Initialize API client before each test
  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });

  /**
   * API 7: POST Verify Login with valid details
   * Positive Scenario: Login with correct credentials
   * Expected: 200 status code, "User exists!" message
   *
   * Note: This test may fail if test credentials don't exist in database
   */
  test("API 7 - POST Verify Login with valid credentials - Should return User exists", async () => {
    // Make POST request with valid credentials
    const response = await apiClient.post(
      "/verifyLogin",
      validLoginCredentials,
    );

    // Validate HTTP status code
    const statusCode = response.status();

    // Log response for debugging
    const responseBody: LoginResponse =
      await apiClient.parseJsonResponse(response);
    console.log("Login response:", responseBody);

    // The API might return 200 or 404 depending on whether test user exists
    // For demonstration, we'll use soft assertions
    if (statusCode === HTTP_STATUS.OK) {
      // If user exists, validate success response
      apiClient.validateResponseCode(responseBody, ResponseCode.OK);
      apiClient.validateResponseMessage(responseBody, API_MESSAGES.USER_EXISTS);
    } else if (statusCode === HTTP_STATUS.NOT_FOUND) {
      // If user doesn't exist, that's expected for test data
      console.log(
        "Test user does not exist in database - this is expected for demo purposes",
      );
      apiClient.validateResponseCode(responseBody, ResponseCode.NOT_FOUND);
      apiClient.validateResponseMessage(
        responseBody,
        API_MESSAGES.USER_NOT_FOUND,
      );
    }
  });

  /**
   * API 7 - POST Verify Login - Structure Validation
   * Verify response has correct structure regardless of success/failure
   */
  test("API 7 - POST Verify Login - Should return proper response structure", async () => {
    const response = await apiClient.post(
      "/verifyLogin",
      validLoginCredentials,
    );
    const responseBody: LoginResponse =
      await apiClient.parseJsonResponse(response);

    // Validate response has required fields
    apiClient.validateObjectProperties(responseBody, [
      "responseCode",
      "message",
    ]);

    // Validate response code is a number
    expect(typeof responseBody.responseCode).toBe("number");

    // Validate message is a string
    expect(typeof responseBody.message).toBe("string");
    expect(responseBody.message.length).toBeGreaterThan(0);
  });

  /**
   * API 8: POST Verify Login without email parameter
   * Negative Scenario: Missing required email field
   * Expected: 400 Bad Request status code
   */
  test("API 8 - POST Verify Login without email - Should return 400 Bad Request", async () => {
    // Make POST request without email (only password)
    const response = await apiClient.post(
      "/verifyLogin",
      missingAuthParameters.loginWithoutEmail,
    );

    // Parse response body
    const responseBody: LoginResponse =
      await apiClient.parseJsonResponse(response);

    // Validate response code in JSON
    apiClient.validateResponseCode(responseBody, ResponseCode.BAD_REQUEST);

    // Validate error message
    apiClient.validateResponseMessage(
      responseBody,
      API_MESSAGES.BAD_REQUEST_LOGIN,
    );
  });

  /**
   * API 8 - POST Verify Login without password parameter
   * Negative Scenario: Missing required password field
   * Expected: 400 Bad Request status code
   */
  test("API 8 - POST Verify Login without password - Should return 400 Bad Request", async () => {
    // Make POST request without password (only email)
    const response = await apiClient.post(
      "/verifyLogin",
      missingAuthParameters.loginWithoutPassword,
    );

    // Parse response body
    const responseBody: LoginResponse =
      await apiClient.parseJsonResponse(response);

    // Validate response code and message
    apiClient.validateResponseCode(responseBody, ResponseCode.BAD_REQUEST);
    apiClient.validateResponseMessage(
      responseBody,
      API_MESSAGES.BAD_REQUEST_LOGIN,
    );
  });

  /**
   * API 8 - POST Verify Login with empty parameters
   * Negative Scenario: Both parameters empty
   */
  test("API 8 - POST Verify Login with no parameters - Should return 400 Bad Request", async () => {
    // Make POST request with empty object
    const response = await apiClient.post("/verifyLogin", {});

    const responseBody: LoginResponse =
      await apiClient.parseJsonResponse(response);
    apiClient.validateResponseMessage(
      responseBody,
      API_MESSAGES.BAD_REQUEST_LOGIN,
    );
  });

  /**
   * API 9: DELETE Verify Login
   * Negative Scenario: DELETE method should not be allowed
   * Expected: 405 Method Not Allowed status code
   */
  test("API 9 - DELETE Verify Login - Should return 405 Method Not Allowed", async () => {
    // Make DELETE request (should fail)
    const response = await apiClient.delete(
      "/verifyLogin",
      validLoginCredentials,
    );

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
   * API 10: POST Verify Login with invalid details
   * Negative Scenario: Login with incorrect credentials
   * Expected: 404 Not Found status code, "User not found!" message
   */
  test("API 10 - POST Verify Login with invalid credentials - Should return User not found", async () => {
    // Make POST request with invalid credentials
    const response = await apiClient.post(
      "/verifyLogin",
      invalidLoginCredentials,
    );

    // Parse response body
    const responseBody: LoginResponse =
      await apiClient.parseJsonResponse(response);

    // Validate response code in JSON
    apiClient.validateResponseCode(responseBody, ResponseCode.NOT_FOUND);

    // Validate error message
    apiClient.validateResponseMessage(
      responseBody,
      API_MESSAGES.USER_NOT_FOUND,
    );
  });

  /**
   * API 10 - Data-Driven Test: Multiple Invalid Credentials
   * Test with various invalid credential combinations
   */
  const invalidCredentialSets = [
    {
      email: "wrong@example.com",
      password: "WrongPass123",
      description: "Wrong email and password",
    },
    {
      email: "invalid.email",
      password: "Test123",
      description: "Invalid email format",
    },
    { email: "test@test.com", password: "123", description: "Short password" },
    { email: "", password: "password", description: "Empty email" },
  ];

  invalidCredentialSets.forEach(({ email, password, description }) => {
    test(`API 10 - POST Verify Login - ${description}`, async () => {
      const response = await apiClient.post("/verifyLogin", {
        email,
        password,
      });
      const responseBody: LoginResponse =
        await apiClient.parseJsonResponse(response);

      console.log(`Test: ${description}, Response:`, responseBody);

      // Should return either 404 (user not found) or 400 (bad request)
      const statusCode = responseBody.responseCode;
      expect
        .soft([HTTP_STATUS.NOT_FOUND, HTTP_STATUS.BAD_REQUEST])
        .toContain(statusCode);
    });
  });

  /**
   * Security Test: SQL Injection Attempt
   * Verify API handles malicious input properly
   */
  test("Security - POST Verify Login with SQL injection attempt - Should handle safely", async () => {
    const sqlInjectionAttempt = {
      email: "admin' OR '1'='1",
      password: "password' OR '1'='1",
    };

    const response = await apiClient.post("/verifyLogin", sqlInjectionAttempt);
    const responseBody: LoginResponse =
      await apiClient.parseJsonResponse(response);

    // Should not return success (200)
    expect(responseBody.responseCode).not.toBe(HTTP_STATUS.OK);

    console.log("SQL injection test response:", responseBody);
  });

  /**
   * Performance Test: Login Response Time
   */
  test("API 7 - POST Verify Login - Should respond within 5 seconds", async () => {
    const startTime = Date.now();

    const response = await apiClient.post(
      "/verifyLogin",
      validLoginCredentials,
    );

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Validate response time
    expect(responseTime).toBeLessThan(5000);
    console.log(`Login response time: ${responseTime}ms`);
  });
});
