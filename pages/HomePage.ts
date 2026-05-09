import { Page, expect } from "@playwright/test";
import { BasePage } from "./basePage";
import { SiteConfig } from "../config/environment";
import { NavbarComponent } from "./components/NavbarComponent";
import { PAGE_TITLES } from "../config/constants";

/**
 * HomePage - Page Object for the home page
 * Handles navigation and verification of the home page
 */
export class HomePage extends BasePage {
  readonly navbar: NavbarComponent;

  constructor(page: Page, siteConfig: SiteConfig) {
    super(page, siteConfig);
    this.navbar = new NavbarComponent(page, siteConfig);
  }

  /**
   * Navigate to the home page and wait for it to load
   */
  async navigateToHome(): Promise<void> {
    await this.goto();
    await this.waitForPageLoad();
  }

  /**
   * Verify the page title matches expected value
   */
  async verifyTitle(): Promise<void> {
    await expect(this.page).toHaveTitle(PAGE_TITLES.HOME_PAGE);
    console.log(`✓ Verified page title: ${PAGE_TITLES.HOME_PAGE}`);
  }

  /**
   * Click the Signup/Login link in the navbar
   */
  async clickSignupLogin(): Promise<void> {
    await this.navbar.clickSignupLogin();
  }
}
