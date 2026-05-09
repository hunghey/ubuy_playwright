/**
 * Shared Test Data Constants
 *
 * Response codes, messages, and boundary values used across all tests
 */

/**
 * Expected HTTP response codes for validation
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
} as const;

/**
 * Expected API response messages for validation
 */
export const API_MESSAGES = {
  USER_EXISTS: "User exists!",
  USER_NOT_FOUND: "User not found!",
  USER_CREATED: "User created!",
  ACCOUNT_DELETED: "Account deleted!",
  USER_UPDATED: "User updated!",
  METHOD_NOT_SUPPORTED: "This request method is not supported.",
  BAD_REQUEST_SEARCH:
    "Bad request, search_product parameter is missing in POST request.",
  BAD_REQUEST_LOGIN:
    "Bad request, email or password parameter is missing in POST request.",
} as const;

/**
 * Boundary value test data
 */
export const BOUNDARY_VALUES = {
  email: {
    maxLength: `${"a".repeat(50)}@${"b".repeat(50)}.com`,
    minLength: "a@b.c",
  },
  password: {
    minLength: "P@ss1",
    maxLength: "P@ss" + "w".repeat(100),
  },
  text: {
    empty: "",
    single: "a",
    long: "a".repeat(1000),
  },
} as const;
