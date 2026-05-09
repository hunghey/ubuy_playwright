/**
 * Authentication Test Data
 *
 * Static credentials and authentication-related test data
 */

import { LoginRequest } from "../../utils/apiTypes";

/**
 * Valid credentials for login testing
 * Note: This is a test account that should exist on the server
 */
export const validLoginCredentials: LoginRequest = {
  email: "Betsy_OKeefe@yahoo.com",
  password: "K4cgz3XL51TQ",
};

/**
 * Invalid credentials for negative testing
 */
export const invalidLoginCredentials: LoginRequest = {
  email: "Betsy_OKeefe@yahoo.com",
  password: "WrongPassword123",
};

/**
 * Dataset for missing parameter scenarios
 */
export const missingAuthParameters = {
  loginWithoutEmail: {
    password: "SomePassword123",
  },
  loginWithoutPassword: {
    email: "test@example.com",
  },
};
