import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./basePage";
import { SiteConfig } from "../config/environment";
import { NavbarComponent } from "./components/NavbarComponent";

/**
 * ProductsPage - Page Object for Products & Product Detail pages
 * URL: /products
 *
 * Covers:
 * - View all products list
 * - Search products by keyword
 * - Verify search results
 * - Navigate to product detail
 * - Verify product detail information
 */
export class ProductsPage extends BasePage {
  readonly navbar: NavbarComponent;

  // ─── Products List Page Locators ────────────────────────────
  private readonly allProductsHeading: Locator;
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;
  private readonly searchedProductsHeading: Locator;
  private readonly productCards: Locator;
  private readonly productNames: Locator;
  private readonly productPrices: Locator;
  private readonly viewProductLinks: Locator;

  // ─── Product Detail Page Locators ───────────────────────────
  private readonly productDetailName: Locator;
  private readonly productDetailCategory: Locator;
  private readonly productDetailPrice: Locator;
  private readonly productDetailAvailability: Locator;
  private readonly productDetailCondition: Locator;
  private readonly productDetailBrand: Locator;

  constructor(page: Page, siteConfig: SiteConfig) {
    super(page, siteConfig);
    this.navbar = new NavbarComponent(page, siteConfig);

    // Products list page
    this.allProductsHeading = page.getByRole("heading", {
      name: "All Products",
    });
    this.searchInput = page.locator("#search_product");
    this.searchButton = page.locator("#submit_search");
    this.searchedProductsHeading = page.getByRole("heading", {
      name: "Searched Products",
    });
    this.productCards = page.locator(".features_items .col-sm-4");
    this.productNames = page.locator(".features_items .productinfo p");
    this.productPrices = page.locator(".features_items .productinfo h2");
    this.viewProductLinks = page.locator("a[href^='/product_details/']");

    // Product detail page
    this.productDetailName = page.locator(".product-information h2");
    this.productDetailCategory = page.locator(
      ".product-information p:has-text('Category')",
    );
    this.productDetailPrice = page.locator(".product-information span span");
    this.productDetailAvailability = page.locator(
      ".product-information p:has-text('Availability')",
    );
    this.productDetailCondition = page.locator(
      ".product-information p:has-text('Condition')",
    );
    this.productDetailBrand = page.locator(
      ".product-information p:has-text('Brand')",
    );
  }

  // ─── Navigation ─────────────────────────────────────────────

  /**
   * Navigate to Products page
   */
  async navigateToProducts(): Promise<void> {
    await this.goto("/products");
    await this.waitForPageLoad();
  }

  // ─── Products List Verifications ────────────────────────────

  /**
   * Verify "All Products" heading is visible
   */
  async verifyAllProductsVisible(): Promise<void> {
    await expect(this.allProductsHeading).toBeVisible();
    console.log('✓ "All Products" heading is visible');
  }

  /**
   * Verify "Searched Products" heading appears after search
   */
  async verifySearchedProductsVisible(): Promise<void> {
    await expect(this.searchedProductsHeading).toBeVisible();
    console.log('✓ "Searched Products" heading is visible');
  }

  /**
   * Verify products list is not empty
   */
  async verifyProductsListNotEmpty(): Promise<void> {
    const count = await this.productCards.count();
    expect(count).toBeGreaterThan(0);
    console.log(`✓ Found ${count} products on the page`);
  }

  /**
   * Get total number of product cards displayed
   */
  async getProductCount(): Promise<number> {
    return await this.productCards.count();
  }

  /**
   * Get all product names displayed on the page
   */
  async getAllProductNames(): Promise<string[]> {
    return await this.productNames.allTextContents();
  }

  /**
   * Verify search returned results and at least some contain the keyword.
   * Note: The website searches by category/tag too, so not every product name
   * will literally contain the keyword. We verify:
   * 1. Results exist (count > 0)
   * 2. At least one product name contains the keyword
   * @param keyword - The search term to validate against
   */
  async verifySearchResultsRelevant(keyword: string): Promise<void> {
    const names = await this.getAllProductNames();
    expect(names.length).toBeGreaterThan(0);

    const matchCount = names.filter((n) =>
      n.toLowerCase().includes(keyword.toLowerCase()),
    ).length;

    console.log(
      `✓ Search "${keyword}": ${names.length} results, ${matchCount} contain keyword in name`,
    );
    // At least one result should match the keyword in name
    expect(matchCount).toBeGreaterThan(0);
  }

  /**
   * Verify no products are displayed (empty results)
   */
  async verifyNoProductsFound(): Promise<void> {
    const count = await this.productCards.count();
    expect(count).toBe(0);
    console.log("✓ No products found (expected for invalid search)");
  }

  // ─── Search Actions ─────────────────────────────────────────

  /**
   * Search for a product by keyword
   * @param keyword - Search term
   */
  async searchProduct(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
    console.log(`✓ Searched for: "${keyword}"`);
  }

  /**
   * Clear search input
   */
  async clearSearch(): Promise<void> {
    await this.searchInput.clear();
  }

  // ─── Product Detail Actions ─────────────────────────────────

  /**
   * Click "View Product" for the first product in the list
   */
  async viewFirstProduct(): Promise<void> {
    await this.viewProductLinks.first().click();
    await this.waitForPageLoad();
    console.log("✓ Navigated to first product detail");
  }

  /**
   * Click "View Product" for a product at specific index (0-based)
   * @param index - Index of the product to view
   */
  async viewProductByIndex(index: number): Promise<void> {
    await this.viewProductLinks.nth(index).click();
    await this.waitForPageLoad();
    console.log(`✓ Navigated to product detail at index ${index}`);
  }

  // ─── Product Detail Verifications ───────────────────────────

  /**
   * Verify all product detail fields are visible
   */
  async verifyProductDetailVisible(): Promise<void> {
    await expect(this.productDetailName).toBeVisible();
    await expect(this.productDetailPrice).toBeVisible();
    await expect(this.productDetailAvailability).toBeVisible();
    await expect(this.productDetailCondition).toBeVisible();
    await expect(this.productDetailBrand).toBeVisible();
    console.log("✓ All product detail fields are visible");
  }

  /**
   * Get product detail information
   */
  async getProductDetail(): Promise<{
    name: string;
    price: string;
    availability: string;
    condition: string;
    brand: string;
  }> {
    return {
      name: (await this.productDetailName.textContent()) || "",
      price: (await this.productDetailPrice.textContent()) || "",
      availability: (await this.productDetailAvailability.textContent()) || "",
      condition: (await this.productDetailCondition.textContent()) || "",
      brand: (await this.productDetailBrand.textContent()) || "",
    };
  }

  /**
   * Verify product detail contains expected name
   * @param expectedName - Expected product name (partial match)
   */
  async verifyProductName(expectedName: string): Promise<void> {
    await expect(this.productDetailName).toContainText(expectedName);
    console.log(`✓ Product name contains: "${expectedName}"`);
  }
}
