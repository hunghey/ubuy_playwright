import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./basePage";
import { SiteConfig } from "../config/environment";

/**
 * CartPage - Page Object for Shopping Cart functionality
 * URLs: /view_cart
 *
 * Covers:
 * - Add products to cart from Products page
 * - Verify cart contents (product name, price, quantity, total)
 * - Remove products from cart
 * - Verify empty cart state
 */
export class CartPage extends BasePage {
  // ─── Products Page - Add to Cart Locators ───────────────────
  private readonly productOverlays: Locator;
  private readonly addToCartButtons: Locator;
  private readonly continueShoppingButton: Locator;
  private readonly viewCartLink: Locator;

  // ─── Cart Page Locators ─────────────────────────────────────
  private readonly cartInfoTable: Locator;
  private readonly cartRows: Locator;
  private readonly cartProductNames: Locator;
  private readonly cartProductPrices: Locator;
  private readonly cartProductQuantities: Locator;
  private readonly cartProductTotals: Locator;
  private readonly cartDeleteButtons: Locator;
  private readonly emptyCartMessage: Locator;
  private readonly shoppingCartHeading: Locator;

  constructor(page: Page, siteConfig: SiteConfig) {
    super(page, siteConfig);

    // Products page overlay buttons
    this.productOverlays = page.locator(".product-overlay");
    this.addToCartButtons = page.locator(".product-overlay .add-to-cart");
    this.continueShoppingButton = page.getByRole("button", {
      name: "Continue Shopping",
    });
    this.viewCartLink = page.locator(".modal-body a[href='/view_cart']");

    // Cart page
    this.cartInfoTable = page.locator("#cart_info_table");
    this.cartRows = page.locator("#cart_info_table tbody tr");
    this.cartProductNames = page.locator(
      "#cart_info_table .cart_description h4 a",
    );
    this.cartProductPrices = page.locator("#cart_info_table .cart_price p");
    this.cartProductQuantities = page.locator(
      "#cart_info_table .cart_quantity button",
    );
    this.cartProductTotals = page.locator("#cart_info_table .cart_total_price");
    this.cartDeleteButtons = page.locator(".cart_quantity_delete");
    this.emptyCartMessage = page.locator("#empty_cart");
    this.shoppingCartHeading = page.locator("li.active", {
      hasText: "Shopping Cart",
    });
  }

  // ─── Navigation ─────────────────────────────────────────────

  async navigateToCart(): Promise<void> {
    await this.goto("/view_cart");
    await this.waitForPageLoad();
  }

  // ─── Add to Cart Actions (on Products page) ────────────────

  /**
   * Hover over a product card and click "Add to Cart" overlay button
   * @param index - 0-based index of the product
   */
  async addProductToCartByIndex(index: number): Promise<void> {
    const productCard = this.page
      .locator(".features_items .col-sm-4")
      .nth(index);
    const overlay = productCard.locator(".product-overlay");
    const addBtn = overlay.locator(".add-to-cart");

    await productCard.scrollIntoViewIfNeeded();
    await productCard.hover();
    await addBtn.click();
    console.log(`✓ Added product at index ${index} to cart`);
  }

  /**
   * Click "Continue Shopping" in the modal after adding to cart
   */
  async clickContinueShopping(): Promise<void> {
    await this.continueShoppingButton.waitFor({
      state: "visible",
      timeout: 10000,
    });
    await this.continueShoppingButton.click();
    // Wait for modal to close
    await this.page.waitForTimeout(500);
    console.log("✓ Clicked Continue Shopping");
  }

  /**
   * Click "View Cart" link in the modal after adding to cart
   */
  async clickViewCart(): Promise<void> {
    await this.viewCartLink.click();
    await this.waitForPageLoad();
    console.log("✓ Navigated to cart via modal link");
  }

  // ─── Cart Verifications ─────────────────────────────────────

  /**
   * Verify the Shopping Cart page is displayed
   */
  async verifyCartPageVisible(): Promise<void> {
    await expect(this.cartInfoTable).toBeVisible();
    console.log("✓ Cart page is visible");
  }

  /**
   * Verify the number of items in cart
   * @param expectedCount - Expected number of cart rows
   */
  async verifyCartItemCount(expectedCount: number): Promise<void> {
    const count = await this.cartRows.count();
    expect(count).toBe(expectedCount);
    console.log(`✓ Cart has ${count} item(s) (expected: ${expectedCount})`);
  }

  /**
   * Get cart item count
   */
  async getCartItemCount(): Promise<number> {
    return await this.cartRows.count();
  }

  /**
   * Verify a product exists in cart by name (partial match)
   * @param productName - Expected product name
   */
  async verifyProductInCart(productName: string): Promise<void> {
    const names = await this.cartProductNames.allTextContents();
    const found = names.some((n) =>
      n.toLowerCase().includes(productName.toLowerCase()),
    );
    expect(found).toBeTruthy();
    console.log(`✓ Product "${productName}" found in cart`);
  }

  /**
   * Get all cart item details
   */
  async getCartItems(): Promise<
    Array<{ name: string; price: string; quantity: string; total: string }>
  > {
    const count = await this.cartRows.count();
    const items = [];

    for (let i = 0; i < count; i++) {
      const row = this.cartRows.nth(i);
      items.push({
        name: (
          (await row.locator(".cart_description h4 a").textContent()) || ""
        ).trim(),
        price: (
          (await row.locator(".cart_price p").textContent()) || ""
        ).trim(),
        quantity: (
          (await row.locator(".cart_quantity button").textContent()) || ""
        ).trim(),
        total: (
          (await row.locator(".cart_total_price").textContent()) || ""
        ).trim(),
      });
    }

    return items;
  }

  /**
   * Verify product quantity in cart at specific row
   * @param rowIndex - 0-based row index
   * @param expectedQty - Expected quantity string
   */
  async verifyProductQuantity(
    rowIndex: number,
    expectedQty: string,
  ): Promise<void> {
    const qtyButton = this.cartRows
      .nth(rowIndex)
      .locator(".cart_quantity button");
    await expect(qtyButton).toHaveText(expectedQty);
    console.log(`✓ Product at row ${rowIndex} has quantity: ${expectedQty}`);
  }

  /**
   * Verify price and total match for a cart row
   */
  async verifyPriceTotalConsistency(rowIndex: number): Promise<void> {
    const row = this.cartRows.nth(rowIndex);
    const price = (
      (await row.locator(".cart_price p").textContent()) || ""
    ).trim();
    const qty = (
      (await row.locator(".cart_quantity button").textContent()) || ""
    ).trim();
    const total = (
      (await row.locator(".cart_total_price").textContent()) || ""
    ).trim();

    // Extract numeric values (e.g., "Rs. 500" → 500)
    const priceNum = parseInt(price.replace(/[^0-9]/g, ""));
    const qtyNum = parseInt(qty);
    const totalNum = parseInt(total.replace(/[^0-9]/g, ""));

    expect(totalNum).toBe(priceNum * qtyNum);
    console.log(`✓ Row ${rowIndex}: ${price} × ${qty} = ${total} (correct)`);
  }

  // ─── Remove from Cart ──────────────────────────────────────

  /**
   * Remove a product from cart by row index
   * @param rowIndex - 0-based row index
   */
  async removeProductByIndex(rowIndex: number): Promise<void> {
    await this.cartDeleteButtons.nth(rowIndex).click();
    // Wait for row to disappear
    await this.page.waitForTimeout(1000);
    console.log(`✓ Removed product at row ${rowIndex}`);
  }

  /**
   * Verify cart is empty
   */
  async verifyCartIsEmpty(): Promise<void> {
    await expect(this.emptyCartMessage).toBeVisible();
    console.log("✓ Cart is empty");
  }
}
