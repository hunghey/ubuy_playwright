import { test, expect } from "../../fixtures/pomFixtures";
import { buildUserData } from "../../utils/testDataGenerator";
import { faker } from "@faker-js/faker";

/**
 * E2E Test: User Journey Flows
 *
 * Additional end-to-end flows covering different user journeys:
 * ── Subscription ─────────────────────────────────────────────
 * TC-E2E-004: Subscribe from Home page footer
 * TC-E2E-005: Subscribe from Cart page footer
 * ── Product Review ───────────────────────────────────────────
 * TC-E2E-006: View product detail → Write review
 * ── Browse & Contact ─────────────────────────────────────────
 * TC-E2E-007: Browse products → Contact Us → Return to Home
 * ── Repeat Purchase ──────────────────────────────────────────
 * TC-E2E-008: Login existing user → Add products → Checkout → Pay → Logout
 */

test.describe("E2E: User Journey Flows", () => {
  // ─────────────────────────────────────────────────────────────
  // TC-E2E-004: Subscribe from Home page
  // ─────────────────────────────────────────────────────────────
  test("TC-E2E-004: Should subscribe to newsletter from Home page footer", async ({
    page,
    homePage,
  }) => {
    const email = faker.internet.email();

    await test.step("1. Navigate to Home page", async () => {
      await homePage.navigateToHome();
      await homePage.verifyTitle();
    });

    await test.step("2. Scroll down to footer", async () => {
      await page.locator("#footer").scrollIntoViewIfNeeded();
      await expect(
        page.getByRole("heading", { name: "Subscription" }),
      ).toBeVisible();
      console.log('✓ "Subscription" heading is visible in footer');
    });

    await test.step("3. Enter email and click subscribe", async () => {
      await page.locator("#susbscribe_email").fill(email);
      await page.locator("#subscribe").click();
      console.log(`✓ Subscribed with email: ${email}`);
    });

    await test.step("4. Verify success message", async () => {
      await expect(
        page.locator("#success-subscribe .alert-success"),
      ).toBeVisible();
      await expect(
        page.locator("#success-subscribe .alert-success"),
      ).toContainText("You have been successfully subscribed!");
      console.log("✓ Subscription success message is visible");
    });
  });

  // ─────────────────────────────────────────────────────────────
  // TC-E2E-005: Subscribe from Cart page
  // ─────────────────────────────────────────────────────────────
  test("TC-E2E-005: Should subscribe to newsletter from Cart page footer", async ({
    page,
    cartPage,
  }) => {
    const email = faker.internet.email();

    await test.step("1. Navigate to Cart page", async () => {
      await cartPage.navigateToCart();
    });

    await test.step("2. Scroll down to footer", async () => {
      await page.locator("#footer").scrollIntoViewIfNeeded();
      await expect(
        page.getByRole("heading", { name: "Subscription" }),
      ).toBeVisible();
      console.log('✓ "Subscription" heading is visible in Cart page footer');
    });

    await test.step("3. Enter email and click subscribe", async () => {
      await page.locator("#susbscribe_email").fill(email);
      await page.locator("#subscribe").click();
      console.log(`✓ Subscribed with email: ${email}`);
    });

    await test.step("4. Verify success message", async () => {
      await expect(
        page.locator("#success-subscribe .alert-success"),
      ).toBeVisible();
      await expect(
        page.locator("#success-subscribe .alert-success"),
      ).toContainText("You have been successfully subscribed!");
      console.log("✓ Subscription success message is visible");
    });
  });

  // ─────────────────────────────────────────────────────────────
  // TC-E2E-006: View Product Detail → Write Review
  // ─────────────────────────────────────────────────────────────
  test("TC-E2E-006: Should view product detail and submit a review", async ({
    page,
    productsPage,
  }) => {
    await test.step("1. Navigate to Products page", async () => {
      await productsPage.navigateToProducts();
      await productsPage.verifyAllProductsVisible();
    });

    await test.step("2. Click 'View Product' on first product", async () => {
      await productsPage.viewFirstProduct();
    });

    await test.step("3. Verify product detail page is loaded", async () => {
      await productsPage.verifyProductDetailVisible();
      const detail = await productsPage.getProductDetail();
      console.log(
        `✓ Product: ${detail.name} | Price: ${detail.price} | Brand: ${detail.brand}`,
      );
    });

    await test.step("4. Verify 'Write Your Review' section is visible", async () => {
      await expect(page.getByText("Write Your Review")).toBeVisible();
      console.log('✓ "Write Your Review" section is visible');
    });

    await test.step("5. Fill and submit review", async () => {
      await page.locator("#name").fill(faker.person.fullName());
      await page.locator("#email").fill(faker.internet.email());
      await page
        .locator("#review")
        .fill(
          "Excellent product! Great quality and fast delivery. Highly recommended for everyone.",
        );
      await page.getByRole("button", { name: "Submit" }).click();
      console.log("✓ Review submitted");
    });
    await test.step("6. Verify review success message", async () => {
      await expect(
        page.locator("#review-section .alert-success"),
      ).toBeVisible();
      await expect(
        page.locator("#review-section .alert-success"),
      ).toContainText("Thank you for your review.");
      console.log("✓ Review success message is visible");
    });
  });

  // ─────────────────────────────────────────────────────────────
  // TC-E2E-007: Browse → Contact Us → Return Home
  // ─────────────────────────────────────────────────────────────
  test("TC-E2E-007: Should browse products, contact support, and return to home", async ({
    page,
    homePage,
    productsPage,
    contactUsPage,
  }) => {
    await test.step("1. Navigate to Home and verify", async () => {
      await homePage.navigateToHome();
      await homePage.verifyTitle();
    });

    await test.step("2. Navigate to Products and browse", async () => {
      await productsPage.navigateToProducts();
      await productsPage.verifyAllProductsVisible();
      const count = await productsPage.getProductCount();
      console.log(`✓ Browsed ${count} products`);
    });

    await test.step("3. Search for a product", async () => {
      await productsPage.searchProduct("Top");
      await productsPage.verifySearchedProductsVisible();
      await productsPage.verifySearchResultsRelevant("Top");
    });

    await test.step("4. Navigate to Contact Us", async () => {
      await contactUsPage.goto("/contact_us");
      await contactUsPage.verifyGetInTouchVisible();
    });

    await test.step("5. Fill and submit contact form", async () => {
      await contactUsPage.fillContactForm(
        faker.person.fullName(),
        faker.internet.email(),
        "Product inquiry from browsing",
        "I was browsing your products and have some questions about availability and bulk pricing.",
      );
      await contactUsPage.clickSubmitAndAcceptDialog();
      console.log("✓ Contact form submitted");
    });

    await test.step("6. Return to Home page", async () => {
      await homePage.navigateToHome();
      await homePage.verifyTitle();
      console.log("✓ Returned to Home page successfully");
    });
  });

  // ─────────────────────────────────────────────────────────────
  // TC-E2E-008: Login → Add Products → Checkout → Pay → Logout
  // (Repeat purchase as existing user — no registration/deletion)
  // ─────────────────────────────────────────────────────────────
  test("TC-E2E-008: Should login as existing user, purchase, and logout", async ({
    homePage,
    signupPage,
    accountInfoPage,
    accountCreatedPage,
    dashboardPage,
    deleteAccountPage,
    productsPage,
    cartPage,
    checkoutPage,
    paymentPage,
  }) => {
    const user = buildUserData();

    await test.step("1. Register a new account first", async () => {
      await homePage.navigateToHome();
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
      await dashboardPage.verifyLoggedInAs(user.name);
      console.log(`✓ Registered user: ${user.name}`);
    });

    await test.step("2. Logout", async () => {
      await dashboardPage.logout();
      await signupPage.verifyNewUserSignupVisible();
      console.log("✓ Logged out");
    });

    await test.step("3. Login with created credentials", async () => {
      await signupPage.fillLoginForm(user.email, user.password);
      await signupPage.clickLogin();
      await dashboardPage.verifyLoggedInAs(user.name);
      console.log(`✓ Logged in as: ${user.name}`);
    });

    await test.step("4. Browse and add products to cart", async () => {
      await productsPage.navigateToProducts();
      await productsPage.verifyAllProductsVisible();
      await cartPage.addProductToCartByIndex(0);
      await cartPage.clickContinueShopping();
      await cartPage.addProductToCartByIndex(2);
      await cartPage.clickContinueShopping();
      await cartPage.addProductToCartByIndex(4);
      await cartPage.navigateToCart();
      console.log("✓ Added 3 products to cart");
    });

    await test.step("5. Verify cart has 3 items", async () => {
      await cartPage.verifyCartItemCount(3);
    });

    await test.step("6. Proceed to checkout", async () => {
      await cartPage.page.locator(".btn.btn-default.check_out").click();
      await checkoutPage.verifyCheckoutPageVisible();
    });

    await test.step("7. Verify delivery address", async () => {
      await checkoutPage.verifyDeliveryAddress({
        fullName: `${user.gender} ${user.firstname} ${user.lastname}`,
        address: user.address1,
        cityStateZip: `${user.city} ${user.state} ${user.zipcode}`,
        country: user.country,
        phone: user.mobile_number,
      });
    });

    await test.step("8. Add comment and place order", async () => {
      await checkoutPage.addComment(
        "Repeat order — same delivery address please",
      );
      await checkoutPage.clickPlaceOrder();
    });

    await test.step("9. Fill payment and confirm", async () => {
      await paymentPage.fillPaymentDetails({
        nameOnCard: `${user.firstName} ${user.lastName}`,
        cardNumber: "4111111111111111",
        cvc: "123",
        expiryMonth: "12",
        expiryYear: "2030",
      });
      await paymentPage.clickPayAndConfirm();
    });

    await test.step("10. Verify order confirmation", async () => {
      await paymentPage.verifyOrderPlaced();
      console.log("✓ Order placed successfully as existing user");
    });

    await test.step("11. Continue and logout", async () => {
      await paymentPage.clickContinue();
      await dashboardPage.logout();
      await signupPage.verifyNewUserSignupVisible();
      console.log("✓ Logged out after purchase");
    });

    await test.step("12. Cleanup — login and delete account", async () => {
      await signupPage.fillLoginForm(user.email, user.password);
      await signupPage.clickLogin();
      await dashboardPage.verifyLoggedInAs(user.name);
      await dashboardPage.clickDeleteAccount();
      await deleteAccountPage.verifyAccountDeleted();
      await deleteAccountPage.clickContinue();
      console.log("✓ Account deleted");
    });
  });
});
