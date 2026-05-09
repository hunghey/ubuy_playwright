import { Page, expect, Locator } from "@playwright/test";
import { BasePage } from "./basePage";
import { SiteConfig } from "../config/environment";
import {
  UI_TEXT,
  BUTTON_TEXT,
  GENDER_OPTIONS,
  FORM_LABELS,
  DATA_QA_ATTRIBUTES,
  TEST_DATA,
} from "../config/constants";
import { UIUserData } from "../utils/uiTypes";

/**
 * AccountInfoPage - Page Object for account information form
 * Handles filling account details and address information during registration
 */
export class AccountInfoPage extends BasePage {
  private readonly enterAccountInfoHeading: Locator;
  private readonly genderMrRadio: Locator;
  private readonly genderMrsRadio: Locator;
  private readonly passwordInput: Locator;
  private readonly dayOfBirthSelect: Locator;
  private readonly monthOfBirthSelect: Locator;
  private readonly yearOfBirthSelect: Locator;
  private readonly newsletterCheckbox: Locator;
  private readonly specialOffersCheckbox: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly companyInput: Locator;
  private readonly addressInput: Locator;
  private readonly address2Input: Locator;
  private readonly countrySelect: Locator;
  private readonly stateInput: Locator;
  private readonly cityInput: Locator;
  private readonly zipcodeInput: Locator;
  private readonly mobileNumberInput: Locator;
  private readonly createAccountButton: Locator;

  constructor(page: Page, siteConfig: SiteConfig) {
    super(page, siteConfig);

    // Account Information locators
    this.enterAccountInfoHeading = page.getByText(UI_TEXT.ENTER_ACCOUNT_INFO);
    this.genderMrRadio = page.getByRole("radio", { name: GENDER_OPTIONS.MR });
    this.genderMrsRadio = page.getByRole("radio", { name: GENDER_OPTIONS.MRS });
    this.passwordInput = page.locator(
      `input[data-qa="${DATA_QA_ATTRIBUTES.PASSWORD}"]`,
    );
    this.dayOfBirthSelect = page.locator(
      `select[data-qa="${DATA_QA_ATTRIBUTES.DAYS}"]`,
    );
    this.monthOfBirthSelect = page.locator(
      `select[data-qa="${DATA_QA_ATTRIBUTES.MONTHS}"]`,
    );
    this.yearOfBirthSelect = page.locator(
      `select[data-qa="${DATA_QA_ATTRIBUTES.YEARS}"]`,
    );
    this.newsletterCheckbox = page.getByRole("checkbox", {
      name: FORM_LABELS.NEWSLETTER,
    });
    this.specialOffersCheckbox = page.getByRole("checkbox", {
      name: FORM_LABELS.SPECIAL_OFFERS,
    });

    // Address Information locators
    this.firstNameInput = page.locator(
      `input[data-qa="${DATA_QA_ATTRIBUTES.FIRST_NAME}"]`,
    );
    this.lastNameInput = page.locator(
      `input[data-qa="${DATA_QA_ATTRIBUTES.LAST_NAME}"]`,
    );
    this.companyInput = page.locator(
      `input[data-qa="${DATA_QA_ATTRIBUTES.COMPANY}"]`,
    );
    this.addressInput = page.locator(
      `input[data-qa="${DATA_QA_ATTRIBUTES.ADDRESS}"]`,
    );
    this.address2Input = page.locator(
      `input[data-qa="${DATA_QA_ATTRIBUTES.ADDRESS_2}"]`,
    );
    this.countrySelect = page.locator(
      `select[data-qa="${DATA_QA_ATTRIBUTES.COUNTRY}"]`,
    );
    this.stateInput = page.locator(
      `input[data-qa="${DATA_QA_ATTRIBUTES.STATE}"]`,
    );
    this.cityInput = page.locator(
      `input[data-qa="${DATA_QA_ATTRIBUTES.CITY}"]`,
    );
    this.zipcodeInput = page.locator(
      `input[data-qa="${DATA_QA_ATTRIBUTES.ZIPCODE}"]`,
    );
    this.mobileNumberInput = page.locator(
      `input[data-qa="${DATA_QA_ATTRIBUTES.MOBILE_NUMBER}"]`,
    );
    this.createAccountButton = page.getByRole("button", {
      name: BUTTON_TEXT.CREATE_ACCOUNT,
    });
  }

  /**
   * Verify the "Enter Account Information" heading is visible
   */
  async verifyEnterAccountInfoVisible(): Promise<void> {
    await expect(this.enterAccountInfoHeading).toBeVisible();
  }

  /**
   * Fill account information form (gender, password, date of birth, checkboxes)
   * @param userData - User data object containing account information
   */
  async fillAccountInformation(userData: UIUserData): Promise<void> {
    if (userData.gender === GENDER_OPTIONS.MR) {
      await this.genderMrRadio.check();
    } else {
      await this.genderMrsRadio.check();
    }
    await this.passwordInput.fill(userData.password);
    await this.dayOfBirthSelect.selectOption(userData.dateOfBirth.day);
    await this.monthOfBirthSelect.selectOption(userData.dateOfBirth.month);
    await this.yearOfBirthSelect.selectOption(userData.dateOfBirth.year);
    await this.newsletterCheckbox.check();
    await this.specialOffersCheckbox.check();
  }

  /**
   * Fill address information form
   * @param userData - User data object containing address information
   */
  async fillAddressInformation(userData: UIUserData): Promise<void> {
    await this.firstNameInput.fill(userData.firstname);
    await this.lastNameInput.fill(userData.lastname);
    await this.companyInput.fill(userData.company);
    await this.addressInput.fill(userData.address1);
    await this.address2Input.fill(userData.address2);
    await this.countrySelect.selectOption(userData.country);
    await this.stateInput.fill(userData.state);
    await this.cityInput.fill(userData.city);
    await this.zipcodeInput.fill(userData.zipcode);
    await this.mobileNumberInput.fill(userData.mobile_number);
  }

  /**
   * Click the Create Account button
   */
  async clickCreateAccount(): Promise<void> {
    await this.createAccountButton.click();
  }
}
