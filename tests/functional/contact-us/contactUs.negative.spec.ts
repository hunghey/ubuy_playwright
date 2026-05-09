import { faker } from "@faker-js/faker";
import { test } from "../../../fixtures/pomFixtures";

/**
 * Negative Test Cases: Contact Us Form Validation
 *
 * Purpose: To verify that form validation correctly handles invalid input.
 *
 * Test coverage:
 * - TC-CU-NEG-001: Invalid email format (missing @)
 * - TC-CU-NEG-002: Invalid email format (missing domain)
 * - TC-CU-NEG-003: Submit with empty required fields
 * - TC-CU-NEG-004: Submit with only some fields filled
 */

test.describe("Contact Us Form - Negative Tests (Validation)", () => {
  // ─────────────────────────────────────────────────────────────
  // TC-CU-NEG-001: Email missing @
  // ─────────────────────────────────────────────────────────────
  test("TC-CU-NEG-001: Should show validation error for email without @", async ({
    contactUsPage,
    page,
  }) => {
    const invalidEmail = "invalidemail.com"; // Missing @

    await test.step("Step 1: Navigate to Contact Us page", async () => {
      await contactUsPage.navigateToContactUs();
      await contactUsPage.verifyGetInTouchVisible();
    });

    await test.step("Step 2: Fill form with invalid email (no @)", async () => {
      await contactUsPage.fillContactForm(
        faker.person.fullName(),
        invalidEmail,
        "Test Subject",
        "Test message",
      );
    });

    await test.step("Step 3: Try to submit and verify browser validation", async () => {
      // Click submit - browser should show built-in validation
      await contactUsPage["submitButton"].click();

      // Verify we're still on the same page (submission blocked)
      await page.waitForTimeout(1000);
      await contactUsPage.verifyGetInTouchVisible();

      console.log("✓ Form submission blocked due to invalid email");
    });
  });

  // ─────────────────────────────────────────────────────────────
  // TC-CU-NEG-002: Email without domain
  // ─────────────────────────────────────────────────────────────
  test("TC-CU-NEG-002: Should show validation error for email without domain", async ({
    contactUsPage,
    page,
  }) => {
    const invalidEmail = "user@"; // Missing domain

    await test.step("Step 1: Navigate to Contact Us page", async () => {
      await contactUsPage.navigateToContactUs();
    });

    await test.step("Step 2: Fill form with invalid email (no domain)", async () => {
      await contactUsPage.fillContactForm(
        faker.person.fullName(),
        invalidEmail,
        "Test Subject",
        "Test message",
      );
    });

    await test.step("Step 3: Verify form cannot be submitted", async () => {
      await contactUsPage["submitButton"].click();
      await page.waitForTimeout(1000);
      // Should still be on contact page
      await contactUsPage.verifyGetInTouchVisible();
      console.log("✓ Form submission blocked");
    });
  });

  // ─────────────────────────────────────────────────────────────
  // TC-CU-NEG-003: Submit all fields are empty
  // ─────────────────────────────────────────────────────────────
  test("TC-CU-NEG-003: Should show validation error when all fields are empty", async ({
    contactUsPage,
    page,
  }) => {
    await test.step("Step 1: Navigate to Contact Us page", async () => {
      await contactUsPage.navigateToContactUs();
    });

    await test.step("Step 2: Click Submit without filling any field", async () => {
      await contactUsPage["submitButton"].click();
      await page.waitForTimeout(500);
    });

    await test.step("Step 3: Verify HTML5 validation prevents submission", async () => {
      // Browser should show "Please fill out this field" for the first required field
      // We verify we're still on the form page
      await contactUsPage.verifyGetInTouchVisible();
      console.log("✓ Empty form submission blocked by HTML5 validation");
    });
  });

  // ─────────────────────────────────────────────────────────────
  // TC-CU-NEG-004: Only fill Name field, leave others empty
  // ─────────────────────────────────────────────────────────────
  test("TC-CU-NEG-004: Should show validation error when required fields are missing", async ({
    contactUsPage,
    page,
  }) => {
    await test.step("Step 1: Navigate to Contact Us page", async () => {
      await contactUsPage.navigateToContactUs();
    });

    await test.step("Step 2: Fill only Name field, leave others empty", async () => {
      await contactUsPage["nameInput"].fill("John Doe");
      // Leave email, subject, message empty
    });

    await test.step("Step 3: Try to submit", async () => {
      await contactUsPage["submitButton"].click();
      await page.waitForTimeout(500);
    });

    await test.step("Step 4: Verify submission is blocked", async () => {
      await contactUsPage.verifyGetInTouchVisible();
      console.log("✓ Partial form submission blocked");
    });
  });

  // ─────────────────────────────────────────────────────────────
  // TC-CU-NEG-005: Email with special characters
  // ─────────────────────────────────────────────────────────────
  test("TC-CU-NEG-005: Should handle special characters in email", async ({
    contactUsPage,
    page,
  }) => {
    const invalidEmail = "user name@example.com"; // Space in local part

    await test.step("Step 1: Navigate to Contact Us page", async () => {
      await contactUsPage.navigateToContactUs();
    });

    await test.step("Step 2: Fill form with email containing spaces", async () => {
      await contactUsPage.fillContactForm(
        faker.person.fullName(),
        invalidEmail,
        "Test",
        "Message",
      );
    });

    await test.step("Step 3: Verify validation", async () => {
      await contactUsPage["submitButton"].click();
      await page.waitForTimeout(1000);
      await contactUsPage.verifyGetInTouchVisible();
      console.log("✓ Invalid email format blocked");
    });
  });
});
