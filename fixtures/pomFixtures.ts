import { test as base } from "@playwright/test";
import { automationExerciseConfig } from "../config/environment";
import { HomePage } from "../pages/HomePage";
import { SignupPage } from "../pages/SignupPage";
import { AccountInfoPage } from "../pages/AccountInfoPage";
import { AccountCreatedPage } from "../pages/AccountCreatedPage";
import { DashboardPage } from "../pages/DashboardPage";
import { DeleteAccountPage } from "../pages/DeleteAccountPage";
import { ContactUsPage } from "../pages/ContactUsPage";
import { ProductsPage } from "../pages/ProductsPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { PaymentPage } from "../pages/PaymentPage";

type PomFixtures = {
  homePage: HomePage;
  signupPage: SignupPage;
  accountInfoPage: AccountInfoPage;
  accountCreatedPage: AccountCreatedPage;
  dashboardPage: DashboardPage;
  deleteAccountPage: DeleteAccountPage;
  contactUsPage: ContactUsPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  paymentPage: PaymentPage;
};

export const test = base.extend<PomFixtures>({
  context: async ({ context }, use) => {
    await context.route("**/*", (route) => {
      const url = route.request().url();
      if (
        url.includes("googleads") ||
        url.includes("doubleclick") ||
        url.includes("googlesyndication")
      ) {
        return route.abort();
      }

      return route.continue();
    });

    await use(context);
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page, automationExerciseConfig));
  },
  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page, automationExerciseConfig));
  },
  accountInfoPage: async ({ page }, use) => {
    await use(new AccountInfoPage(page, automationExerciseConfig));
  },
  accountCreatedPage: async ({ page }, use) => {
    await use(new AccountCreatedPage(page, automationExerciseConfig));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page, automationExerciseConfig));
  },
  deleteAccountPage: async ({ page }, use) => {
    await use(new DeleteAccountPage(page, automationExerciseConfig));
  },
  contactUsPage: async ({ page }, use) => {
    await use(new ContactUsPage(page, automationExerciseConfig));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page, automationExerciseConfig));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page, automationExerciseConfig));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page, automationExerciseConfig));
  },
  paymentPage: async ({ page }, use) => {
    await use(new PaymentPage(page, automationExerciseConfig));
  },
});

export { expect } from "@playwright/test";
