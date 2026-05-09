import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./basePage";
import { SiteConfig } from "../config/environment";

/**
 * CheckoutPage - Page Object for Checkout flow
 * URL: /checkout
 *
 * Covers:
 * - Verify delivery address details
 * - Verify order summary (products, prices)
 * - Add order comment
 * - Proceed to payment
 */
export class CheckoutPage extends BasePage {
  // ─── Address Locators ───────────────────────────────────────
  private readonly deliveryAddressSection: Locator;
  private readonly deliveryFirstLastName: Locator;
  private readonly deliveryCompany: Locator;
  private readonly deliveryAddress1: Locator;
  private readonly deliveryAddress2: Locator;
  private readonly deliveryCityStateZip: Locator;
  private readonly deliveryCountry: Locator;
  private readonly deliveryPhone: Locator;

  // ─── Order Summary Locators ─────────────────────────────────
  private readonly cartItems: Locator;
  private readonly cartProductNames: Locator;
  private readonly totalAmount: Locator;

  // ─── Actions Locators ───────────────────────────────────────
  private readonly commentTextarea: Locator;
  private readonly placeOrderButton: Locator;

  constructor(page: Page, siteConfig: SiteConfig) {
    super(page, siteConfig);

    // Delivery address — website renders multiple <li> with same classes:
    // [0] = company, [1] = address1, [2] = address2
    this.deliveryAddressSection = page.locator("#address_delivery");
    this.deliveryFirstLastName = page.locator(
      "#address_delivery .address_firstname.address_lastname",
    );
    this.deliveryCompany = page
      .locator("#address_delivery li.address_address1.address_address2")
      .nth(0);
    this.deliveryAddress1 = page
      .locator("#address_delivery li.address_address1.address_address2")
      .nth(1);
    this.deliveryAddress2 = page
      .locator("#address_delivery li.address_address1.address_address2")
      .nth(2);
    this.deliveryCityStateZip = page.locator(
      "#address_delivery .address_city.address_state_name.address_postcode",
    );
    this.deliveryCountry = page.locator(
      "#address_delivery .address_country_name",
    );
    this.deliveryPhone = page.locator("#address_delivery .address_phone");

    // Order summary on checkout — cart product rows only (exclude total row)
    this.cartItems = page.locator("#cart_info table tbody tr[id^='product-']");
    this.cartProductNames = page.locator("#cart_info .cart_description h4 a");
    this.totalAmount = page.locator(".cart_total_price").last();

    // Actions
    this.commentTextarea = page.locator("textarea[name='message']");
    this.placeOrderButton = page.getByRole("link", { name: "Place Order" });
  }

  // ─── Verifications ──────────────────────────────────────────

  /**
   * Verify checkout page is loaded with delivery address section
   */
  async verifyCheckoutPageVisible(): Promise<void> {
    await expect(this.deliveryAddressSection).toBeVisible();
    console.log("✓ Checkout page is visible with delivery address");
  }

  /**
   * Verify delivery address contains expected user data
   */
  async verifyDeliveryAddress(data: {
    fullName: string;
    address: string;
    cityStateZip: string;
    country: string;
    phone: string;
  }): Promise<void> {
    await expect(this.deliveryFirstLastName).toContainText(data.fullName);
    await expect(this.deliveryAddress1).toContainText(data.address);
    await expect(this.deliveryCityStateZip).toContainText(data.cityStateZip);
    await expect(this.deliveryCountry).toContainText(data.country);
    await expect(this.deliveryPhone).toContainText(data.phone);
    console.log(`✓ Delivery address verified for: ${data.fullName}`);
  }

  /**
   * Verify cart items count on checkout page
   */
  async verifyCartItemCount(expectedCount: number): Promise<void> {
    const count = await this.cartItems.count();
    expect(count).toBe(expectedCount);
    console.log(`✓ Checkout has ${count} item(s)`);
  }

  /**
   * Get all product names in checkout order summary
   */
  async getOrderProductNames(): Promise<string[]> {
    return await this.cartProductNames.allTextContents();
  }

  // ─── Actions ────────────────────────────────────────────────

  /**
   * Add a comment/description for the order
   */
  async addComment(comment: string): Promise<void> {
    await this.commentTextarea.fill(comment);
    console.log(`✓ Added order comment: "${comment}"`);
  }

  /**
   * Click "Place Order" to proceed to payment
   */
  async clickPlaceOrder(): Promise<void> {
    await this.placeOrderButton.click();
    await this.waitForPageLoad();
    console.log("✓ Clicked Place Order");
  }
}
