import { Page, expect, Locator } from "@playwright/test";
import { BasePage } from "./basePage";
import { SiteConfig } from "../config/environment";
import { NavbarComponent } from "./components/NavbarComponent";
import { UI_TEXT } from "../config/constants";

/**
 * DashboardPage - Page Object for user dashboard
 * Handles verification of logged-in state and account management actions
 */
export class DashboardPage extends BasePage {
  readonly navbar: NavbarComponent;
  private readonly loggedInAsText: Locator;

  constructor(page: Page, siteConfig: SiteConfig) {
    super(page, siteConfig);
    this.navbar = new NavbarComponent(page, siteConfig);
    this.loggedInAsText = page.getByText(new RegExp(UI_TEXT.LOGGED_IN_AS));
  }

  /**
   * Verify user is logged in with the specified username
   * @param username - Expected username to verify
   */
  async verifyLoggedInAs(username: string): Promise<void> {
    await expect(this.loggedInAsText).toContainText(username);
  }

  /**
   * Click the Delete Account link in the navbar
   */
  async clickDeleteAccount(): Promise<void> {
    await this.navbar.clickDeleteAccount();
  }

  /**
   * Click the Logout link in the navbar
   */
  async logout(): Promise<void> {
    await this.navbar.clickLogout();
  }
}
