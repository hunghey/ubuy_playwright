/**
 * Products Test Data
 *
 * Product search terms and product-related test data
 */

import { SearchProductRequest } from "../../utils/apiTypes";

/**
 * Search terms for data-driven product search testing
 */
export const searchTerms: string[] = [
  "top",
  "tshirt",
  "jean",
  "dress",
  "saree",
  "jeans",
  "shirt",
];

/**
 * Generates search product request data
 * @param searchTerm - The search term to use
 * @returns SearchProductRequest object
 */
export function generateSearchProductData(
  searchTerm: string,
): SearchProductRequest {
  return {
    search_product: searchTerm,
  };
}

/**
 * Search-related edge cases
 */
export const searchEdgeCases = {
  specialCharacters: "!@#$%^&*()",
  numericOnly: "12345",
  emptyString: "",
  veryLongTerm: "a".repeat(500),
};
