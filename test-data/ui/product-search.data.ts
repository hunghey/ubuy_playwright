/**
 * Product Search UI Test Data
 *
 * Test data for product search and product detail functional testing
 */

/**
 * Valid search keywords that should return results
 * Based on known product categories on automationexercise.com
 */
export const VALID_SEARCH_KEYWORDS = {
  top: "Top",
  tshirt: "Tshirt",
  dress: "Dress",
  jeans: "Jeans",
  men: "Men",
  women: "Women",
} as const;

/**
 * Invalid search terms that should return zero results
 */
export const INVALID_SEARCH_KEYWORDS = {
  randomGibberish: "xyzabc12345nonexistent",
  specialChars: "!@#$%^&*()",
  veryLong: "a".repeat(200),
} as const;

/**
 * Edge case search terms
 */
export const EDGE_CASE_KEYWORDS = {
  singleChar: "T",
  withSpaces: " top ",
  caseMixed: "tOp",
  numeric: "123",
} as const;
