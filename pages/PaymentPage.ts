import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./basePage";
import { SiteConfig } from "../config/environment";

/**
 * PaymentPage - Page Object for Payment form
 * URL: /payment
 *
 * Covers:
 * - Fill payment card details
 * - Confirm payment
 * - Verify order success
 */
export class PaymentPage extends BasePage {
  // ─── Payment Form Locators ──────────────────────────────────
  private readonly nameOnCardInput: Locator;
  private readonly cardNumberInput: Locator;
  private readonly cvcInput: Locator;
  private readonly expiryMonthInput: Locator;
  private readonly expiryYearInput: Locator;
  private readonly payAndConfirmButton: Locator;

  // ─── Order Confirmation Locators ────────────────────────────
  private readonly orderPlacedHeading: Locator;
  private readonly continueButton: Locator;
  private readonly downloadInvoiceLink: Locator;

  constructor(page: Page, siteConfig: SiteConfig) {
    super(page, siteConfig);

    // Payment form
    this.nameOnCardInput = page.locator('[data-qa="name-on-card"]');
    this.cardNumberInput = page.locator('[data-qa="card-number"]');
    this.cvcInput = page.locator('[data-qa="cvc"]');
    this.expiryMonthInput = page.locator('[data-qa="expiry-month"]');
    this.expiryYearInput = page.locator('[data-qa="expiry-year"]');
    this.payAndConfirmButton = page.locator('[data-qa="pay-button"]');

    // Order confirmation
    this.orderPlacedHeading = page.getByText("Order Placed!", { exact: false });
    this.continueButton = page.getByRole("link", { name: "Continue" });
    this.downloadInvoiceLink = page.getByRole("link", {
      name: "Download Invoice",
    });
  }

  // ─── Actions ────────────────────────────────────────────────

  /**
   * Fill payment card details
   */
  async fillPaymentDetails(card: {
    nameOnCard: string;
    cardNumber: string;
    cvc: string;
    expiryMonth: string;
    expiryYear: string;
  }): Promise<void> {
    await this.nameOnCardInput.fill(card.nameOnCard);
    await this.cardNumberInput.fill(card.cardNumber);
    await this.cvcInput.fill(card.cvc);
    await this.expiryMonthInput.fill(card.expiryMonth);
    await this.expiryYearInput.fill(card.expiryYear);
    console.log(
      `✓ Filled payment details for card: ${card.cardNumber.slice(-4)}`,
    );
  }

  /**
   * Click "Pay and Confirm Order"
   */
  async clickPayAndConfirm(): Promise<void> {
    await this.payAndConfirmButton.click();
    await this.waitForPageLoad();
    console.log("✓ Clicked Pay and Confirm Order");
  }

  // ─── Verifications ──────────────────────────────────────────

  /**
   * Verify "Order Placed!" confirmation is visible
   */
  async verifyOrderPlaced(): Promise<void> {
    await expect(this.orderPlacedHeading).toBeVisible({ timeout: 10000 });
    console.log('✓ "Order Placed!" confirmation is visible');
  }

  /**
   * Verify "Download Invoice" link is available
   */
  async verifyDownloadInvoiceVisible(): Promise<void> {
    await expect(this.downloadInvoiceLink).toBeVisible();
    console.log("✓ Download Invoice link is available");
  }

  /**
   * Click Continue after order placed
   */
  async clickContinue(): Promise<void> {
    await this.continueButton.click();
    await this.waitForPageLoad();
    console.log("✓ Clicked Continue after order confirmation");
  }

  /**
   * Click Download Invoice
   */
  async clickDownloadInvoice(): Promise<void> {
    await this.downloadInvoiceLink.click();
    console.log("✓ Clicked Download Invoice");
  }
}
