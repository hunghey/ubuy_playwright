import { Page, expect, Locator } from "@playwright/test";
import { BasePage } from "./basePage";
import { SiteConfig } from "../config/environment";
import {
  UI_TEXT,
  ERROR_MESSAGES,
  BUTTON_TEXT,
  FORM_LABELS,
  DATA_QA_ATTRIBUTES,
} from "../config/constants";

/**
 * SignupPage - Page Object for signup and login functionality
 * Handles user registration, login, and error verification
 */
export class SignupPage extends BasePage {
  private readonly newUserSignupHeading: Locator;
  private readonly nameInput: Locator;
  private readonly emailSignUpInput: Locator;
  private readonly signupButton: Locator;
  private readonly signInButton: Locator;
  private readonly emailSignInInput: Locator;
  private readonly passwordSignInInput: Locator;
  private readonly signupError: Locator;
  private readonly loginError: Locator;

  constructor(page: Page, siteConfig: SiteConfig) {
    super(page, siteConfig);
    this.newUserSignupHeading = page.getByRole("heading", {
      name: UI_TEXT.NEW_USER_SIGNUP,
    });
    this.nameInput = page.getByPlaceholder(FORM_LABELS.NAME);
    this.emailSignUpInput = page.locator(
      `input[data-qa="${DATA_QA_ATTRIBUTES.SIGNUP_EMAIL}"]`,
    );
    this.signupButton = page.getByRole("button", { name: BUTTON_TEXT.SIGNUP });
    this.signInButton = page.getByRole("button", { name: BUTTON_TEXT.LOGIN });
    this.emailSignInInput = page.locator(
      `input[data-qa="${DATA_QA_ATTRIBUTES.LOGIN_EMAIL}"]`,
    );
    this.passwordSignInInput = page.locator(
      `input[data-qa="${DATA_QA_ATTRIBUTES.LOGIN_PASSWORD}"]`,
    );
    this.signupError = page.locator(".signup-form p");
    this.loginError = page.locator(".login-form p");
  }

  /**
   * Verify the "New User Signup!" heading is visible
   */
  async verifyNewUserSignupVisible(): Promise<void> {
    await expect(this.newUserSignupHeading).toBeVisible();
  }

  /**
   * Fill the signup form with name and email
   * @param name - User's full name
   * @param email - User's email address
   */
  async fillSignupForm(name: string, email: string): Promise<void> {
    await this.nameInput.clear();
    await this.nameInput.fill(name);
    await this.emailSignUpInput.clear();
    await this.emailSignUpInput.fill(email);
  }

  /**
   * Click the Signup button
   */
  async clickSignup(): Promise<void> {
    await this.signupButton.click();
  }

  async fillLoginForm(email: string, pass: string): Promise<void> {
    await this.emailSignInInput.clear();
    await this.emailSignInInput.fill(email);
    await this.passwordSignInInput.clear();
    await this.passwordSignInInput.fill(pass);
  }

  /**
   * Click the Login button
   */
  async clickLogin(): Promise<void> {
    await this.signInButton.click();
  }

  async verifySignupError(message: string): Promise<void> {
    await expect(this.signupError).toContainText(message);
  }
  /**
   * Verify signup error message
   * @param expectedMessage - Expected error message (defaults to email exists error)
   */
  async verifyLoginError(message: string): Promise<void> {
    await expect(this.loginError).toContainText(message);
  }
}
