import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./basePage";
import { SiteConfig } from "../config/environment";

/**
 * ContactUsPage - Page Object for Contact Us form
 * URL: /contact_us
 *
 * Covers:
 * - Fill and submit contact form
 * - Upload file attachment
 * - Handle browser confirmation dialog
 * - Verify success/error messages
 */
export class ContactUsPage extends BasePage {
  // ─── Locators ───────────────────────────────────────────────
  private readonly getInTouchHeading: Locator;
  private readonly nameInput: Locator;
  private readonly emailInput: Locator;
  private readonly subjectInput: Locator;
  private readonly messageTextarea: Locator;
  private readonly uploadFileInput: Locator;
  private readonly submitButton: Locator;
  private readonly successMessage: Locator;
  private readonly homeButton: Locator;

  constructor(page: Page, siteConfig: SiteConfig) {
    super(page, siteConfig);

    this.getInTouchHeading = page.getByRole("heading", {
      name: "Get In Touch",
    });
    this.nameInput = page.getByPlaceholder("Name");
    this.emailInput = page.locator('[data-qa="email"]');
    this.subjectInput = page.getByPlaceholder("Subject");
    this.messageTextarea = page.getByPlaceholder("Your Message Here");
    this.uploadFileInput = page.locator('input[name="upload_file"]');
    this.submitButton = page.getByRole("button", { name: "Submit" });
    this.successMessage = page.locator(".status.alert.alert-success");
    this.homeButton = page.getByRole("link", { name: " Home" }).first();
  }

  // ─── Element Visibility Checks ──────────────────────────────

  /**
   * Verify all form elements are visible and ready for interaction
   */
  async verifyFormElementsVisible(): Promise<void> {
    await expect(this.nameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.subjectInput).toBeVisible();
    await expect(this.messageTextarea).toBeVisible();
    await expect(this.submitButton).toBeVisible();
    await expect(this.submitButton).toBeEnabled();
    console.log("✓ All form elements are visible and enabled");
  }

  // ─── Navigation ─────────────────────────────────────────────

  /**
   * Navigate to Contact Us page
   */
  async navigateToContactUs(): Promise<void> {
    await this.goto("/contact_us");
    await this.waitForPageLoad();
  }

  // ─── Verifications ──────────────────────────────────────────

  /**
   * Verify "Get In Touch" heading is visible
   */
  async verifyGetInTouchVisible(): Promise<void> {
    await expect(this.getInTouchHeading).toBeVisible();
    console.log('✓ "Get In Touch" heading is visible');
  }

  /**
   * Verify success message after form submission
   * Use specific selector to avoid conflict with newsletter success message
   * Wait for the element to not have 'hidden' style
   */
  async verifySuccessMessage(): Promise<void> {
    const successLocator = this.page.locator(
      "#contact-page .status.alert.alert-success",
    );

    // Wait for element to exist
    await successLocator.waitFor({ state: "attached", timeout: 10000 });

    // Wait for it to become visible (remove hidden class/style)
    await expect(successLocator).not.toHaveCSS("display", "none", {
      timeout: 10000,
    });

    // Finally verify it contains the expected text
    await expect(successLocator).toContainText(
      "Success! Your details have been submitted successfully.",
    );

    console.log("✓ Success message is displayed");
  }

  // ─── Actions ────────────────────────────────────────────────

  /**
   * Fill all fields of the contact form
   * @param name - Sender's name
   * @param email - Sender's email
   * @param subject - Message subject
   * @param message - Message body
   */
  async fillContactForm(
    name: string,
    email: string,
    subject: string,
    message: string,
  ): Promise<void> {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.subjectInput.fill(subject);
    await this.messageTextarea.fill(message);
    console.log(`✓ Filled contact form for: ${name} (${email})`);
  }

  /**
   * Upload a file attachment
   * @param filePath - Absolute or relative path to the file
   */
  async uploadFile(filePath: string): Promise<void> {
    await this.uploadFileInput.setInputFiles(filePath);
    console.log(`✓ Uploaded file: ${filePath}`);
  }

  /**
   * Click Submit button and auto-accept the browser confirmation dialog (if appears)
   * Note: Dialog may not appear when uploading files in some browsers
   */
  async clickSubmitAndAcceptDialog(): Promise<void> {
    // Setup dialog handler - will auto-accept if dialog appears
    this.page.once("dialog", async (dialog) => {
      console.log(`Dialog detected: ${dialog.message()}`);
      await dialog.accept();
      console.log("✓ Accepted browser confirmation dialog");
    });

    // Click submit button
    await this.submitButton.click();

    // Wait a bit for potential page navigation or AJAX
    await this.page.waitForTimeout(1000);

    // Try to wait for load state, but don't fail if it times out
    await this.page
      .waitForLoadState("domcontentloaded", { timeout: 5000 })
      .catch(() => {
        console.log("⚠ Page did not trigger full reload");
      });
  }

  /**
   * Click Home button to return to home page after submission
   */
  async clickHome(): Promise<void> {
    await this.homeButton.click();
  }
}
