/**
 * User Management API Test Suite
 *
 * This file contains tests for User Account Management API endpoints:
 * - API 11: POST Create Account (positive scenario)
 * - API 12: DELETE User Account (positive scenario)
 * - API 13: PUT Update Account (positive scenario)
 * - API 14: GET User Detail by Email (positive scenario)
 * - End-to-End User Lifecycle Tests
 */

import { test, expect } from "@playwright/test";
import { ApiClient } from "../../utils/apiClient";
import {
  AccountResponse,
  UserDetailResponse,
  ResponseCode,
  CreateAccountRequest,
} from "../../utils/apiTypes";
import { HTTP_STATUS, API_MESSAGES } from "../../test-data/shared/contants";
import {
  generateUserAccountData,
  generateMultipleUserAccounts,
  generateUniqueEmail,
} from "../../test-data/api/users.generator";

test.describe("User Management API Tests", () => {
  let apiClient: ApiClient;

  // Setup: Initialize API client before each test
  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });

  /**
   * API 11: POST Create Account
   * Positive Scenario: Create new user account with all required fields
   * Expected: 201 Created status code, "User created!" message
   */
  test("API 11 - POST Create Account - Should create new user successfully", async () => {
    // Generate unique user data
    const userData = generateUserAccountData();

    console.log("Creating user with email:", userData.email);

    // Make POST request to create account
    const response = await apiClient.post("/createAccount", userData);

    // Parse response body
    const responseBody: AccountResponse =
      await apiClient.parseJsonResponse(response);

    // Validate response code in JSON
    apiClient.validateResponseCode(responseBody, ResponseCode.CREATED);

    // Validate success message
    apiClient.validateResponseMessage(responseBody, API_MESSAGES.USER_CREATED);

    console.log("User created successfully:", userData.email);

    // Cleanup: Delete the created account
    await apiClient.delete("/deleteAccount", {
      email: userData.email,
      password: userData.password,
    });
  });

  /**
   * API 11 - POST Create Account - Data-Driven Test
   * Create multiple users with different data combinations
   */
  test("API 11 - POST Create Account - Should create users with various titles", async () => {
    const titles = ["Mr", "Mrs", "Miss"] as const;

    for (const title of titles) {
      const userData = generateUserAccountData({ title });

      const response = await apiClient.post("/createAccount", userData);
      const responseBody: AccountResponse =
        await apiClient.parseJsonResponse(response);

      // Use soft assertions to test all titles
      expect
        .soft(responseBody.responseCode, `Should create ${title} account`)
        .toBe(HTTP_STATUS.CREATED);
      expect.soft(responseBody.message).toBe(API_MESSAGES.USER_CREATED);

      console.log(`Created ${title} account:`, userData.email);

      // Cleanup
      await apiClient.delete("/deleteAccount", {
        email: userData.email,
        password: userData.password,
      });
    }
  });

  /**
   * API 11 - POST Create Account - Duplicate Email
   * Negative Scenario: Attempt to create account with existing email
   */
  test("API 11 - POST Create Account - Should reject duplicate email", async () => {
    const userData = generateUserAccountData();

    // Create account first time
    const firstResponse = await apiClient.post("/createAccount", userData);
    const firstResponseBody: AccountResponse =
      await apiClient.parseJsonResponse(firstResponse);
    expect(firstResponseBody.responseCode).toBe(HTTP_STATUS.CREATED);

    // Attempt to create account with same email
    const secondResponse = await apiClient.post("/createAccount", userData);
    const secondResponseBody: AccountResponse =
      await apiClient.parseJsonResponse(secondResponse);

    // Should fail (not 201)
    const statusCode = secondResponseBody.responseCode;
    console.log("Duplicate email attempt returned status:", statusCode);

    // Soft assertion - API might return 400 or custom error
    expect.soft(statusCode).not.toBe(HTTP_STATUS.CREATED);

    // Cleanup
    await apiClient.delete("/deleteAccount", {
      email: userData.email,
      password: userData.password,
    });
  });

  /**
   * API 12: DELETE User Account
   * Positive Scenario: Delete existing user account
   * Expected: 200 OK status code, "Account deleted!" message
   */
  test("API 12 - DELETE User Account - Should delete existing user successfully", async () => {
    // Create a user first
    const userData = generateUserAccountData();
    await apiClient.post("/createAccount", userData);

    console.log("Deleting user:", userData.email);

    // Delete the account
    const response = await apiClient.delete("/deleteAccount", {
      email: userData.email,
      password: userData.password,
    });

    // Validate HTTP status code is 200 OK
    await apiClient.validateStatusCode(response, HTTP_STATUS.OK);

    // Parse response body
    const responseBody: AccountResponse =
      await apiClient.parseJsonResponse(response);

    // Validate response code in JSON
    apiClient.validateResponseCode(responseBody, ResponseCode.OK);

    // Validate success message
    apiClient.validateResponseMessage(
      responseBody,
      API_MESSAGES.ACCOUNT_DELETED,
    );

    console.log("User deleted successfully");
  });

  /**
   * API 12 - DELETE User Account - Non-existent User
   * Negative Scenario: Attempt to delete user that doesn't exist
   */
  test("API 12 - DELETE User Account - Should handle non-existent user", async () => {
    const nonExistentUser = {
      email: generateUniqueEmail(),
      password: "SomePassword123",
    };

    const response = await apiClient.delete("/deleteAccount", nonExistentUser);
    const responseBody = await apiClient.parseJsonResponse(response);

    console.log("Delete non-existent user response:", responseBody);

    // API might return 404 or custom error
    // Using soft assertion to not block test suite
    expect.soft(responseBody.responseCode).not.toBe(HTTP_STATUS.OK);
  });

  /**
   * API 13: PUT Update Account
   * Positive Scenario: Update existing user account details
   * Expected: 200 OK status code, "User updated!" message
   */
  test("API 13 - PUT Update Account - Should update user details successfully", async () => {
    // Create a user first
    const userData = generateUserAccountData();
    await apiClient.post("/createAccount", userData);

    // Modify user data
    const updatedData: CreateAccountRequest = {
      ...userData,
      firstname: "UpdatedFirstName",
      lastname: "UpdatedLastName",
      company: "Updated Company Inc.",
      city: "Updated City",
    };

    console.log("Updating user:", userData.email);

    // Update the account
    const response = await apiClient.put("/updateAccount", updatedData);

    // Validate HTTP status code is 200 OK
    await apiClient.validateStatusCode(response, HTTP_STATUS.OK);

    // Parse response body
    const responseBody: AccountResponse =
      await apiClient.parseJsonResponse(response);

    // Validate response code in JSON
    apiClient.validateResponseCode(responseBody, ResponseCode.OK);

    // Validate success message
    apiClient.validateResponseMessage(responseBody, API_MESSAGES.USER_UPDATED);

    console.log("User updated successfully");

    // Cleanup
    await apiClient.delete("/deleteAccount", {
      email: userData.email,
      password: userData.password,
    });
  });

  /**
   * API 14: GET User Detail by Email
   * Positive Scenario: Retrieve user details by email
   * Expected: 200 OK status code, user detail object
   */
  test("API 14 - GET User Detail by Email - Should return user details", async () => {
    // Create a user first
    const userData = generateUserAccountData();
    await apiClient.post("/createAccount", userData);

    console.log("Getting user details for:", userData.email);

    // Get user details
    const response = await apiClient.get("/getUserDetailByEmail", {
      email: userData.email,
    });

    // Validate HTTP status code is 200 OK
    await apiClient.validateStatusCode(response, HTTP_STATUS.OK);

    // Parse response body
    const responseBody: UserDetailResponse =
      await apiClient.parseJsonResponse(response);

    // Validate response code in JSON
    apiClient.validateResponseCode(responseBody, ResponseCode.OK);

    // Validate user object exists
    expect(responseBody.user).toBeDefined();

    // Validate user details structure
    apiClient.validateObjectProperties(responseBody.user, [
      "name",
      "email",
      "title",
      "birth_day",
      "birth_month",
      "birth_year",
      "first_name",
      "last_name",
      "company",
      "address1",
      "country",
      "state",
      "city",
      "zipcode",
    ]);

    // Validate email matches
    expect(responseBody.user.email).toBe(userData.email);

    console.log("Retrieved user details:", responseBody.user);

    // Cleanup
    await apiClient.delete("/deleteAccount", {
      email: userData.email,
      password: userData.password,
    });
  });

  /**
   * API 14 - GET User Detail - Non-existent Email
   * Negative Scenario: Query for user that doesn't exist
   */
  test("API 14 - GET User Detail by Email - Should handle non-existent user", async () => {
    const nonExistentEmail = generateUniqueEmail();

    const response = await apiClient.get("/getUserDetailByEmail", {
      email: nonExistentEmail,
    });

    const responseBody = await apiClient.parseJsonResponse(response);
    console.log("Non-existent user query response:", responseBody);

    // API might return 404 or empty user object
    // Just validate response has proper structure
    expect(responseBody.responseCode).toBeDefined();
  });

  /**
   * End-to-End Test: Complete User Lifecycle
   * Test the full flow: Create → Get Details → Update → Get Details → Delete
   */
  test("E2E - Complete User Lifecycle - Should handle full CRUD operations", async () => {
    // 1. Create user
    const userData = generateUserAccountData();
    console.log("\n=== Step 1: Creating User ===");

    const createResponse = await apiClient.post("/createAccount", userData);
    const createBody: AccountResponse =
      await apiClient.parseJsonResponse(createResponse);

    expect(createBody.responseCode).toBe(HTTP_STATUS.CREATED);
    expect(createBody.message).toBe(API_MESSAGES.USER_CREATED);
    console.log("✓ User created:", userData.email);

    // 2. Get user details (verify creation)
    console.log("\n=== Step 2: Getting User Details ===");

    const getResponse1 = await apiClient.get("/getUserDetailByEmail", {
      email: userData.email,
    });
    const getBody1: UserDetailResponse =
      await apiClient.parseJsonResponse(getResponse1);

    expect(getResponse1.status()).toBe(HTTP_STATUS.OK);
    expect(getBody1.user.email).toBe(userData.email);
    expect(getBody1.user.first_name).toBe(userData.firstname);
    console.log(
      "✓ User details retrieved:",
      getBody1.user.first_name,
      getBody1.user.last_name,
    );

    // 3. Update user
    console.log("\n=== Step 3: Updating User ===");

    const updatedData: CreateAccountRequest = {
      ...userData,
      firstname: "Updated_" + userData.firstname,
      lastname: "Updated_" + userData.lastname,
      company: "New Company Ltd.",
    };

    const updateResponse = await apiClient.put("/updateAccount", updatedData);
    const updateBody: AccountResponse =
      await apiClient.parseJsonResponse(updateResponse);

    expect(updateResponse.status()).toBe(HTTP_STATUS.OK);
    expect(updateBody.message).toBe(API_MESSAGES.USER_UPDATED);
    console.log("✓ User updated");

    // 4. Get user details again (verify update)
    console.log("\n=== Step 4: Verifying Update ===");

    const getResponse2 = await apiClient.get("/getUserDetailByEmail", {
      email: userData.email,
    });
    const getBody2: UserDetailResponse =
      await apiClient.parseJsonResponse(getResponse2);

    expect(getResponse2.status()).toBe(HTTP_STATUS.OK);
    expect(getBody2.user.first_name).toBe(updatedData.firstname);
    expect(getBody2.user.last_name).toBe(updatedData.lastname);
    console.log(
      "✓ Update verified:",
      getBody2.user.first_name,
      getBody2.user.last_name,
    );

    // 5. Delete user
    console.log("\n=== Step 5: Deleting User ===");

    const deleteResponse = await apiClient.delete("/deleteAccount", {
      email: userData.email,
      password: userData.password,
    });
    const deleteBody: AccountResponse =
      await apiClient.parseJsonResponse(deleteResponse);

    expect(deleteResponse.status()).toBe(HTTP_STATUS.OK);
    expect(deleteBody.message).toBe(API_MESSAGES.ACCOUNT_DELETED);
    console.log("✓ User deleted");

    console.log("\n=== E2E Test Completed Successfully ===\n");
  });

  /**
   * Performance Test: Account Operations Response Time
   */
  test("Performance - User Management Operations - Should respond within acceptable time", async () => {
    const userData = generateUserAccountData();
    const timings: Record<string, number> = {};

    // Measure create time
    let startTime = Date.now();
    await apiClient.post("/createAccount", userData);
    timings.create = Date.now() - startTime;

    // Measure get time
    startTime = Date.now();
    await apiClient.get("/getUserDetailByEmail", { email: userData.email });
    timings.get = Date.now() - startTime;

    // Measure update time
    startTime = Date.now();
    await apiClient.put("/updateAccount", userData);
    timings.update = Date.now() - startTime;

    // Measure delete time
    startTime = Date.now();
    await apiClient.delete("/deleteAccount", {
      email: userData.email,
      password: userData.password,
    });
    timings.delete = Date.now() - startTime;

    // Log all timings
    console.log("Performance Timings:", timings);

    // All operations should complete within 5 seconds
    Object.entries(timings).forEach(([operation, time]) => {
      expect
        .soft(time, `${operation} should complete within 5s`)
        .toBeLessThan(5000);
    });
  });
});
