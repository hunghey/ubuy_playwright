import { test, expect } from "../../fixtures/pomFixtures";
import { buildUserData } from "../../utils/testDataGenerator";
import { TEST_CARD, ORDER_COMMENTS } from "../../test-data/ui/checkout.data";
import { UIUserData } from "../../utils/uiTypes";

/**
 * E2E Test: Complete Purchase Flow
 *
 * Full end-to-end flow covering the entire user journey:
 * Home → Products → Add to Cart → Register → Checkout → Payment → Order Confirmation → Delete Account
 *
 * Test Coverage:
 * ── Full Flow Tests ─────────────────────────────────────────
 * TC-E2E-001: Register during checkout → complete purchase → delete account
 * TC-E2E-002: Register first → add products → checkout → payment → verify → delete
 * TC-E2E-003: Register → add multiple products → verify checkout details → pay → download invoice → delete
 */

test.describe("E2E: Complete Purchase Flow", () => {
  // ─────────────────────────────────────────────────────────────
  // TC-E2E-001: Register during checkout flow
  // Flow: Add to Cart → Proceed → Register/Login → Register → Cart → Checkout → Pay → Delete
  // ─────────────────────────────────────────────────────────────
  test("TC-E2E-001: Should complete purchase with registration during checkout", async ({
    homePage,
    productsPage,
    cartPage,
    signupPage,
    accountInfoPage,
    accountCreatedPage,
    dashboardPage,
    checkoutPage,
    paymentPage,
    deleteAccountPage,
  }) => {
    const user = buildUserData();
    test.setTimeout(120_000); // Extended timeout for full flow

    await test.step("1. Navigate to Products page", async () => {
      await productsPage.navigateToProducts();
      await productsPage.verifyAllProductsVisible();
    });

    await test.step("2. Add first product to cart", async () => {
      await cartPage.addProductToCartByIndex(0);
      await cartPage.clickContinueShopping();
    });

    await test.step("3. Add second product to cart", async () => {
      await cartPage.addProductToCartByIndex(1);
      await cartPage.clickViewCart();
    });

    await test.step("4. Verify cart has 2 products", async () => {
      await cartPage.verifyCartPageVisible();
      await cartPage.verifyCartItemCount(2);
    });

    await test.step("5. Proceed to checkout → redirected to login", async () => {
      // Click "Proceed To Checkout" — should ask to register/login
      const proceedBtn = cartPage.page.locator(".btn.btn-default.check_out");
      await proceedBtn.click();
      // Modal appears asking to Register/Login
      const registerLink = cartPage.page.locator(
        "#checkoutModal a[href='/login']",
      );
      await registerLink.click();
      await cartPage.page.waitForLoadState("domcontentloaded");
    });

    await test.step("6. Register new account", async () => {
      await signupPage.verifyNewUserSignupVisible();
      await signupPage.fillSignupForm(user.name, user.email);
      await signupPage.clickSignup();
      await accountInfoPage.verifyEnterAccountInfoVisible();
      await accountInfoPage.fillAccountInformation(user);
      await accountInfoPage.fillAddressInformation(user);
      await accountInfoPage.clickCreateAccount();
      await accountCreatedPage.verifyAccountCreated();
      await accountCreatedPage.clickContinue();
    });

    await test.step("7. Verify logged in", async () => {
      await dashboardPage.verifyLoggedInAs(user.name);
    });

    await test.step("8. Navigate to cart again", async () => {
      await cartPage.navigateToCart();
      await cartPage.verifyCartItemCount(2);
    });

    await test.step("9. Proceed to checkout", async () => {
      const proceedBtn = cartPage.page.locator(".btn.btn-default.check_out");
      await proceedBtn.click();
      await checkoutPage.verifyCheckoutPageVisible();
    });

    await test.step("10. Verify delivery address", async () => {
      await checkoutPage.verifyDeliveryAddress({
        fullName: `${user.gender} ${user.firstname} ${user.lastname}`,
        address: user.address1,
        cityStateZip: user.city,
        country: user.country,
        phone: user.mobile_number,
      });
    });

    await test.step("11. Add comment and place order", async () => {
      await checkoutPage.addComment(ORDER_COMMENTS.standard);
      await checkoutPage.clickPlaceOrder();
    });

    await test.step("12. Fill payment details", async () => {
      await paymentPage.fillPaymentDetails({
        ...TEST_CARD,
        nameOnCard: `${user.firstname} ${user.lastname}`,
      });
    });

    await test.step("13. Confirm payment", async () => {
      await paymentPage.clickPayAndConfirm();
    });

    await test.step("14. Verify order placed", async () => {
      await paymentPage.verifyOrderPlaced();
    });

    await test.step("15. Continue and delete account", async () => {
      await paymentPage.clickContinue();
      await dashboardPage.clickDeleteAccount();
      await deleteAccountPage.verifyAccountDeleted();
      await deleteAccountPage.clickContinue();
    });
  });

  // ─────────────────────────────────────────────────────────────
  // TC-E2E-002: Register first → then complete purchase
  // Flow: Register → Login → Add to Cart → Checkout → Pay → Delete
  // ─────────────────────────────────────────────────────────────
  test("TC-E2E-002: Should register first, then complete full purchase flow", async ({
    homePage,
    productsPage,
    cartPage,
    signupPage,
    accountInfoPage,
    accountCreatedPage,
    dashboardPage,
    checkoutPage,
    paymentPage,
    deleteAccountPage,
  }) => {
    const user = buildUserData();
    test.setTimeout(120_000);

    await test.step("1. Register a new account", async () => {
      await homePage.navigateToHome();
      await homePage.clickSignupLogin();
      await signupPage.fillSignupForm(user.name, user.email);
      await signupPage.clickSignup();
      await accountInfoPage.verifyEnterAccountInfoVisible();
      await accountInfoPage.fillAccountInformation(user);
      await accountInfoPage.fillAddressInformation(user);
      await accountInfoPage.clickCreateAccount();
      await accountCreatedPage.verifyAccountCreated();
      await accountCreatedPage.clickContinue();
      await dashboardPage.verifyLoggedInAs(user.name);
    });

    await test.step("2. Navigate to Products and add items", async () => {
      await productsPage.navigateToProducts();
      await productsPage.verifyAllProductsVisible();
      await cartPage.addProductToCartByIndex(0);
      await cartPage.clickContinueShopping();
      await cartPage.addProductToCartByIndex(2);
      await cartPage.clickContinueShopping();
    });

    await test.step("3. Go to cart and verify", async () => {
      await cartPage.navigateToCart();
      await cartPage.verifyCartItemCount(2);

      const items = await cartPage.getCartItems();
      console.log(
        "Cart:",
        items.map((i) => `${i.name} (${i.price})`).join(", "),
      );
    });

    await test.step("4. Proceed to checkout", async () => {
      const proceedBtn = cartPage.page.locator(".btn.btn-default.check_out");
      await proceedBtn.click();
      await checkoutPage.verifyCheckoutPageVisible();
    });

    await test.step("5. Verify order details and place order", async () => {
      await checkoutPage.verifyCartItemCount(2);
      await checkoutPage.addComment(ORDER_COMMENTS.standard);
      await checkoutPage.clickPlaceOrder();
    });

    await test.step("6. Complete payment", async () => {
      await paymentPage.fillPaymentDetails({
        ...TEST_CARD,
        nameOnCard: `${user.firstname} ${user.lastname}`,
      });
      await paymentPage.clickPayAndConfirm();
    });

    await test.step("7. Verify order confirmation", async () => {
      await paymentPage.verifyOrderPlaced();
    });

    await test.step("8. Download invoice and continue", async () => {
      await paymentPage.verifyDownloadInvoiceVisible();
      await paymentPage.clickContinue();
    });

    await test.step("9. Delete account for cleanup", async () => {
      await dashboardPage.clickDeleteAccount();
      await deleteAccountPage.verifyAccountDeleted();
      await deleteAccountPage.clickContinue();
      await homePage.verifyTitle();
    });
  });

  // ─────────────────────────────────────────────────────────────
  // TC-E2E-003: Full flow with address & price verification
  // ─────────────────────────────────────────────────────────────
  test("TC-E2E-003: Should verify delivery address and price calculation in checkout", async ({
    homePage,
    productsPage,
    cartPage,
    signupPage,
    accountInfoPage,
    accountCreatedPage,
    dashboardPage,
    checkoutPage,
    paymentPage,
    deleteAccountPage,
  }) => {
    const user = buildUserData();
    test.setTimeout(120_000);

    await test.step("1. Register account", async () => {
      await homePage.navigateToHome();
      await homePage.clickSignupLogin();
      await signupPage.fillSignupForm(user.name, user.email);
      await signupPage.clickSignup();
      await accountInfoPage.fillAccountInformation(user);
      await accountInfoPage.fillAddressInformation(user);
      await accountInfoPage.clickCreateAccount();
      await accountCreatedPage.verifyAccountCreated();
      await accountCreatedPage.clickContinue();
    });

    await test.step("2. Add single product to cart", async () => {
      await productsPage.navigateToProducts();
      await productsPage.verifyAllProductsVisible();
      await cartPage.addProductToCartByIndex(0);
      await cartPage.clickContinueShopping();
    });

    await test.step("3. Go to cart and verify price", async () => {
      await cartPage.navigateToCart();
      await cartPage.verifyCartItemCount(1);
      await cartPage.verifyPriceTotalConsistency(0);
    });

    await test.step("4. Checkout and verify address matches registration", async () => {
      const proceedBtn = cartPage.page.locator(".btn.btn-default.check_out");
      await proceedBtn.click();
      await checkoutPage.verifyCheckoutPageVisible();
      await checkoutPage.verifyDeliveryAddress({
        fullName: `${user.gender} ${user.firstname} ${user.lastname}`,
        address: user.address1,
        cityStateZip: user.city,
        country: user.country,
        phone: user.mobile_number,
      });
    });

    await test.step("5. Place order and pay", async () => {
      await checkoutPage.addComment(ORDER_COMMENTS.rush);
      await checkoutPage.clickPlaceOrder();
      await paymentPage.fillPaymentDetails({
        ...TEST_CARD,
        nameOnCard: `${user.firstname} ${user.lastname}`,
      });
      await paymentPage.clickPayAndConfirm();
    });

    await test.step("6. Verify order placed", async () => {
      await paymentPage.verifyOrderPlaced();
      await paymentPage.clickContinue();
    });

    await test.step("7. Cleanup - delete account", async () => {
      await dashboardPage.clickDeleteAccount();
      await deleteAccountPage.verifyAccountDeleted();
    });
  });
});
