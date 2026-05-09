/**
 * API Client Utility for Automation Exercise API Testing
 *
 * This class provides a reusable interface for making API calls
 * with consistent error handling and response validation.
 */

import { APIRequestContext, APIResponse, expect } from "@playwright/test";

export class ApiClient {
  private baseUrl: string = "https://automationexercise.com/api";

  constructor(private request: APIRequestContext) {}

  /**
   * Performs a GET request to the specified endpoint
   * @param endpoint - API endpoint path (e.g., '/productsList')
   * @param params - Optional query parameters
   * @returns APIResponse object
   */
  async get(
    endpoint: string,
    params?: Record<string, string>,
  ): Promise<APIResponse> {
    const url = `${this.baseUrl}${endpoint}`;
    return await this.request.get(url, { params });
  }

  /**
   * Performs a POST request to the specified endpoint
   * @param endpoint - API endpoint path
   * @param data - Request payload (form data)
   * @returns APIResponse object
   */
  async post(
    endpoint: string,
    data?: Record<string, any>,
  ): Promise<APIResponse> {
    const url = `${this.baseUrl}${endpoint}`;
    return await this.request.post(url, {
      form: data,
    });
  }

  /**
   * Performs a PUT request to the specified endpoint
   * @param endpoint - API endpoint path
   * @param data - Request payload (form data)
   * @returns APIResponse object
   */
  async put(
    endpoint: string,
    data?: Record<string, any>,
  ): Promise<APIResponse> {
    const url = `${this.baseUrl}${endpoint}`;
    return await this.request.put(url, {
      form: data,
    });
  }

  /**
   * Performs a DELETE request to the specified endpoint
   * @param endpoint - API endpoint path
   * @param data - Request payload (form data)
   * @returns APIResponse object
   */
  async delete(
    endpoint: string,
    data?: Record<string, any>,
  ): Promise<APIResponse> {
    const url = `${this.baseUrl}${endpoint}`;
    return await this.request.delete(url, {
      form: data,
    });
  }

  /**
   * Validates response status code
   * @param response - API response
   * @param expectedStatus - Expected HTTP status code
   */
  async validateStatusCode(
    response: APIResponse,
    expectedStatus: number,
  ): Promise<void> {
    expect(response.status()).toBe(expectedStatus);
  }

  /**
   * Validates response contains specific text
   * @param response - API response
   * @param expectedText - Expected text in response body
   */
  async validateResponseText(
    response: APIResponse,
    expectedText: string,
  ): Promise<void> {
    const responseText = await response.text();
    expect(responseText).toContain(expectedText);
  }

  /**
   * Parses response as JSON and returns the body
   * @param response - API response
   * @returns Parsed JSON object
   */
  async parseJsonResponse<T = any>(response: APIResponse): Promise<T> {
    return await response.json();
  }

  /**
   * Validates that response code field in JSON matches expected value
   * @param responseBody - Parsed JSON response body
   * @param expectedCode - Expected response code
   */
  validateResponseCode(responseBody: any, expectedCode: number): void {
    expect(responseBody.responseCode).toBe(expectedCode);
  }

  /**
   * Validates that response message field in JSON matches expected value
   * @param responseBody - Parsed JSON response body
   * @param expectedMessage - Expected response message
   */
  validateResponseMessage(responseBody: any, expectedMessage: string): void {
    expect(responseBody.message).toBe(expectedMessage);
  }

  /**
   * Validates that an array field is not empty
   * @param array - Array to validate
   * @param fieldName - Name of the field (for error messages)
   */
  validateArrayNotEmpty(array: any[], fieldName: string = "array"): void {
    expect(array, `${fieldName} should not be empty`).toBeTruthy();
    expect(
      array.length,
      `${fieldName} should have at least one item`,
    ).toBeGreaterThan(0);
  }

  /**
   * Validates that an object has all required properties
   * @param obj - Object to validate
   * @param requiredProperties - Array of required property names
   */
  validateObjectProperties(obj: any, requiredProperties: string[]): void {
    requiredProperties.forEach((prop) => {
      expect(obj).toHaveProperty(prop);
    });
  }

  /**
   * Soft assertion for response code (non-blocking)
   * @param responseBody - Parsed JSON response body
   * @param expectedCode - Expected response code
   */
  softValidateResponseCode(responseBody: any, expectedCode: number): void {
    expect.soft(responseBody.responseCode).toBe(expectedCode);
  }

  /**
   * Soft assertion for response message (non-blocking)
   * @param responseBody - Parsed JSON response body
   * @param expectedMessage - Expected response message
   */
  softValidateResponseMessage(
    responseBody: any,
    expectedMessage: string,
  ): void {
    expect.soft(responseBody.message).toBe(expectedMessage);
  }
}
