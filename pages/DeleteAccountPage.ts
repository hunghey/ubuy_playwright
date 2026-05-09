import { Page, expect, Locator } from "@playwright/test";
import { BasePage } from "./basePage";
import { SiteConfig } from "../config/environment";
import { UI_TEXT, BUTTON_TEXT } from "../config/constants";

/**
 * DeleteAccountPage - Page Object for account deletion confirmation page
 * Handles verification of account deletion and navigation
 */
export class DeleteAccountPage extends BasePage {
  private readonly accountDeletedHeading: Locator;
  private readonly continueButton: Locator;

  constructor(page: Page, siteConfig: SiteConfig) {
    super(page, siteConfig);
    this.accountDeletedHeading = page.getByText(UI_TEXT.ACCOUNT_DELETED);
    this.continueButton = page.getByRole("link", {
      name: BUTTON_TEXT.CONTINUE,
    });
  }

  /**
   * Verify the "Account Deleted!" heading is visible
   */
  async verifyAccountDeleted(): Promise<void> {
    await expect(this.accountDeletedHeading).toBeVisible();
  }

  /**
   * Click the Continue button
   */
  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }
}
