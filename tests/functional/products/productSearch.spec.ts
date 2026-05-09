import { test, expect } from "../../../fixtures/pomFixtures";
import {
  VALID_SEARCH_KEYWORDS,
  INVALID_SEARCH_KEYWORDS,
  EDGE_CASE_KEYWORDS,
} from "../../../test-data/ui/product-search.data";

/**
 * Functional Test: Product Search (UI)
 *
 * URL: https://automationexercise.com/products
 *
 * Test Coverage:
 * ── Positive Tests ──────────────────────────────────────────
 * TC-PS-001: Navigate to Products page & verify All Products visible
 * TC-PS-002: Search with valid keyword & verify results match
 * TC-PS-003: View first product detail & verify all fields
 * TC-PS-004: Search multiple keywords (data-driven)
 *
 * ── Negative Tests ──────────────────────────────────────────
 * TC-PS-005: Search with non-existent keyword
 * TC-PS-006: Search with special characters
 *
 * ── Edge Case Tests ─────────────────────────────────────────
 * TC-PS-007: Search with mixed case keyword
 */

test.describe("Product Search - Positive Tests", () => {
  // ─────────────────────────────────────────────────────────────
  // TC-PS-001: Navigate to Products & verify page
  // ─────────────────────────────────────────────────────────────
  test("TC-PS-001: Should navigate to Products page and display all products", async ({
    homePage,
    productsPage,
  }) => {
    await test.step("Step 1: Navigate to Home page", async () => {
      await homePage.navigateToHome();
      await homePage.verifyTitle();
    });

    await test.step("Step 2: Click Products in navbar", async () => {
      await homePage.navbar.clickProducts();
    });

    await test.step("Step 3: Verify All Products page loaded", async () => {
      await productsPage.verifyAllProductsVisible();
      await productsPage.verifyProductsListNotEmpty();
    });

    await test.step("Step 4: Verify products count > 0", async () => {
      const count = await productsPage.getProductCount();
      expect(count).toBeGreaterThan(0);
      console.log(`✓ Total products displayed: ${count}`);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // TC-PS-002: Search with valid keyword & verify results
  // ─────────────────────────────────────────────────────────────
  test("TC-PS-002: Should search products and display matching results", async ({
    productsPage,
  }) => {
    const keyword = VALID_SEARCH_KEYWORDS.top;
    await test.step("Step 1: Navigate to Products page", async () => {
      await productsPage.navigateToProducts();
      await productsPage.verifyAllProductsVisible();
    });

    await test.step(`Step 2: Search for "${keyword}"`, async () => {
      await productsPage.searchProduct(keyword);
    });

    await test.step("Step 3: Verify 'Searched Products' heading appears", async () => {
      await productsPage.verifySearchedProductsVisible();
    });

    await test.step("Step 4: Verify all results contain keyword", async () => {
      await productsPage.verifySearchResultsRelevant(keyword);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // TC-PS-003: View Product Detail
  // ─────────────────────────────────────────────────────────────
  test("TC-PS-003: Should view first product detail with all information", async ({
    productsPage,
  }) => {
    await test.step("Step 1: Navigate to Products page", async () => {
      await productsPage.navigateToProducts();
      await productsPage.verifyAllProductsVisible();
    });

    await test.step("Step 2: Click 'View Product' on first product", async () => {
      await productsPage.viewFirstProduct();
    });

    await test.step("Step 3: Verify all product detail fields are visible", async () => {
      await productsPage.verifyProductDetailVisible();
    });

    await test.step("Step 4: Verify product detail has content", async () => {
      const detail = await productsPage.getProductDetail();

      expect(detail.name.trim()).not.toBe("");
      expect(detail.price.trim()).not.toBe("");
      expect(detail.availability).toContain("Availability:");
      expect(detail.condition).toContain("Condition:");
      expect(detail.brand).toContain("Brand:");

      console.log(`✓ Product: "${detail.name}" | Price: ${detail.price}`);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // TC-PS-004: Data-driven search with multiple keywords
  // ─────────────────────────────────────────────────────────────
  for (const [key, keyword] of Object.entries(VALID_SEARCH_KEYWORDS)) {
    test(`TC-PS-004-${key}: Should return results for keyword "${keyword}"`, async ({
      productsPage,
    }) => {
      await productsPage.navigateToProducts();
      await productsPage.searchProduct(keyword);
      await productsPage.verifySearchedProductsVisible();

      const count = await productsPage.getProductCount();
      expect(count).toBeGreaterThan(0);
      console.log(`✓ "${keyword}" → ${count} products found`);
    });
  }
});

test.describe("Product Search - Negative Tests", () => {
  // ─────────────────────────────────────────────────────────────
  // TC-PS-005: Search with non-existent keyword
  // ─────────────────────────────────────────────────────────────
  test("TC-PS-005: Should show no results for non-existent product", async ({
    productsPage,
  }) => {
    const keyword = INVALID_SEARCH_KEYWORDS.randomGibberish;

    await test.step("Step 1: Navigate to Products page", async () => {
      await productsPage.navigateToProducts();
      await productsPage.verifyAllProductsVisible();
    });

    await test.step(`Step 2: Search for "${keyword}"`, async () => {
      await productsPage.searchProduct(keyword);
    });

    await test.step("Step 3: Verify 'Searched Products' heading appears", async () => {
      await productsPage.verifySearchedProductsVisible();
    });

    await test.step("Step 4: Verify no products displayed", async () => {
      await productsPage.verifyNoProductsFound();
    });
  });

  // ─────────────────────────────────────────────────────────────
  // TC-PS-006: Search with special characters
  // ─────────────────────────────────────────────────────────────
  test("TC-PS-006: Should handle special characters in search without crash", async ({
    productsPage,
  }) => {
    const keyword = INVALID_SEARCH_KEYWORDS.specialChars;

    await test.step("Step 1: Navigate to Products page", async () => {
      await productsPage.navigateToProducts();
    });

    await test.step(`Step 2: Search for special characters`, async () => {
      await productsPage.searchProduct(keyword);
    });

    await test.step("Step 3: Verify page doesn't crash (heading still visible)", async () => {
      await productsPage.verifySearchedProductsVisible();
    });

    await test.step("Step 4: Verify no results or empty state", async () => {
      await productsPage.verifyNoProductsFound();
    });
  });
});

test.describe("Product Search - Edge Case Tests", () => {
  // ─────────────────────────────────────────────────────────────
  // TC-PS-007: Case insensitive search
  // ─────────────────────────────────────────────────────────────
  test("TC-PS-007: Should return same results regardless of case", async ({
    productsPage,
  }) => {
    const lowercaseKeyword = "top";
    const mixedCaseKeyword = EDGE_CASE_KEYWORDS.caseMixed; // "tOp"

    await test.step("Step 1: Search with lowercase", async () => {
      await productsPage.navigateToProducts();
      await productsPage.searchProduct(lowercaseKeyword);
      await productsPage.verifySearchedProductsVisible();
    });

    const lowercaseCount = await productsPage.getProductCount();
    const lowercaseNames = await productsPage.getAllProductNames();

    await test.step("Step 2: Search with mixed case", async () => {
      await productsPage.navigateToProducts();
      await productsPage.searchProduct(mixedCaseKeyword);
      await productsPage.verifySearchedProductsVisible();
    });

    const mixedCaseCount = await productsPage.getProductCount();

    await test.step("Step 3: Compare results", async () => {
      expect(mixedCaseCount).toBe(lowercaseCount);
      console.log(
        `✓ "${lowercaseKeyword}" → ${lowercaseCount} results, "${mixedCaseKeyword}" → ${mixedCaseCount} results (match!)`,
      );
    });
  });
});
