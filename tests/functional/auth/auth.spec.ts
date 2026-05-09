import { ERROR_MESSAGES, TEST_DATA } from "../../../config/constants";
import { saveUserToCSV } from "../../../utils/csvUtils";
import { test } from "../../../fixtures/pomFixtures";
import { buildUserData } from "../../../utils/testDataGenerator";
import { UIUserData } from "../../../utils/uiTypes";

test.describe("User Authentication & Management Tests", () => {
  /**
   * Helper: Register a new user through the complete signup flow
   */
  async function registerUser(
    user: UIUserData,
    pages: {
      homePage: import("../../../pages/HomePage").HomePage;
      signupPage: import("../../../pages/SignupPage").SignupPage;
      accountInfoPage: import("../../../pages/AccountInfoPage").AccountInfoPage;
      accountCreatedPage: import("../../../pages/AccountCreatedPage").AccountCreatedPage;
    },
  ): Promise<void> {
    const { homePage, signupPage, accountInfoPage, accountCreatedPage } = pages;

    await homePage.navigateToHome();
    await homePage.verifyTitle();
    await homePage.clickSignupLogin();
    await signupPage.verifyNewUserSignupVisible();
    await signupPage.fillSignupForm(user.name, user.email);
    await signupPage.clickSignup();
    await accountInfoPage.verifyEnterAccountInfoVisible();
    await accountInfoPage.fillAccountInformation(user);
    await accountInfoPage.fillAddressInformation(user);
    await accountInfoPage.clickCreateAccount();
    await accountCreatedPage.verifyAccountCreated();
    await accountCreatedPage.clickContinue();
  }

  /**
   * Helper:  Cleaup user account
   */
  async function cleanupUser(
    user: UIUserData,
    pages: {
      signupPage: import("../../../pages/SignupPage").SignupPage;
      dashboardPage: import("../../../pages/DashboardPage").DashboardPage;
      deleteAccountPage: import("../../../pages/DeleteAccountPage").DeleteAccountPage;
      homePage: import("../../../pages/HomePage").HomePage;
    },
  ): Promise<void> {
    const { signupPage, dashboardPage, deleteAccountPage, homePage } = pages;

    await signupPage.fillLoginForm(user.email, user.password);
    await signupPage.clickLogin();
    await dashboardPage.verifyLoggedInAs(user.name);
    await dashboardPage.clickDeleteAccount();
    await deleteAccountPage.verifyAccountDeleted();
    await deleteAccountPage.clickContinue();
    await homePage.verifyTitle();
  }

  test("TC1: Should successfully register a new user, verify account, and logout", async ({
    homePage,
    signupPage,
    accountInfoPage,
    accountCreatedPage,
    dashboardPage,
    deleteAccountPage,
  }) => {
    const user = buildUserData();

    await test.step("Register a brand-new user", async () => {
      await registerUser(user, {
        homePage,
        signupPage,
        accountInfoPage,
        accountCreatedPage,
      });
    });

    await test.step("Validate authenticated session and logout", async () => {
      await dashboardPage.verifyLoggedInAs(user.name);
      await saveUserToCSV(user.name, user.email, user.password);
      await dashboardPage.logout();
      await signupPage.verifyNewUserSignupVisible();
    });

    await test.step("Re-login and delete account", async () => {
      await cleanupUser(user, {
        signupPage,
        dashboardPage,
        deleteAccountPage,
        homePage,
      });
    });
  });

  test("TC2: Should show error when registering with an existing email", async ({
    homePage,
    signupPage,
    accountInfoPage,
    accountCreatedPage,
    dashboardPage,
    deleteAccountPage,
  }) => {
    const user = buildUserData();

    await test.step("Create user once", async () => {
      await registerUser(user, {
        homePage,
        signupPage,
        accountInfoPage,
        accountCreatedPage,
      });
      await dashboardPage.verifyLoggedInAs(user.name);
      await saveUserToCSV(user.name, user.email, user.password);
      await dashboardPage.logout();
      await signupPage.verifyNewUserSignupVisible();
    });

    await test.step("Attempt duplicate signup and assert error", async () => {
      await signupPage.fillSignupForm(user.name, user.email);
      await signupPage.clickSignup();
      await signupPage.verifySignupError(ERROR_MESSAGES.SIGNUP_EMAIL_EXISTS);
    });

    await test.step("Re-login and delete account", async () => {
      await cleanupUser(user, {
        signupPage,
        dashboardPage,
        deleteAccountPage,
        homePage,
      });
    });
  });

  test("TC3: Should show error when logging in with invalid credentials", async ({
    homePage,
    signupPage,
    accountInfoPage,
    accountCreatedPage,
    dashboardPage,
    deleteAccountPage,
  }) => {
    const user = buildUserData();

    await test.step("Create user to validate negative login flow", async () => {
      await registerUser(user, {
        homePage,
        signupPage,
        accountInfoPage,
        accountCreatedPage,
      });
      await dashboardPage.verifyLoggedInAs(user.name);
      await saveUserToCSV(user.name, user.email, user.password);
      await dashboardPage.logout();
      await signupPage.verifyNewUserSignupVisible();
    });

    await test.step("Attempt login with invalid password", async () => {
      await signupPage.fillLoginForm(user.email, TEST_DATA.INVALID_PASSWORD);
      await signupPage.clickLogin();
      await signupPage.verifyLoginError(
        ERROR_MESSAGES.LOGIN_INVALID_CREDENTIALS,
      );
    });

    await test.step("Re-login and delete account", async () => {
      await cleanupUser(user, {
        signupPage,
        dashboardPage,
        deleteAccountPage,
        homePage,
      });
    });
  });
});
