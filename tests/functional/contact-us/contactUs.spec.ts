import path from "path";
import { faker } from "@faker-js/faker";
import { test } from "../../../fixtures/pomFixtures";

/**
 * Functional Test: Contact Us Form
 *
 * Chức năng: Người dùng gửi form liên hệ với đầy đủ thông tin và file đính kèm.
 * URL: https://automationexercise.com/contact_us
 *
 * Test coverage:
 * - TC-CU-001: Submit form thành công với đầy đủ thông tin + file upload
 * - TC-CU-002: Submit form thành công KHÔNG có file upload
 * - TC-CU-003: Verify giao diện trang Contact Us hiển thị đúng
 */

test.describe("Contact Us Form - Functional Tests", () => {
  // ─────────────────────────────────────────────────────────────
  // TC-CU-001: Happy path - Submit form đầy đủ + upload file
  // ─────────────────────────────────────────────────────────────
  test("TC-CU-001: Should submit contact form successfully with file upload", async ({
    homePage,
    contactUsPage,
  }) => {
    // Test data - dùng Faker để tạo dữ liệu ngẫu nhiên mỗi lần chạy
    const contactData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      subject: faker.lorem.sentence(5),
      message: faker.lorem.paragraph(2),
    };
    const uploadFilePath = path.resolve("test-data/static/test-upload.txt");

    await test.step("Step 1: Navigate to home page", async () => {
      await homePage.navigateToHome();
      await homePage.verifyTitle();
    });

    await test.step("Step 2: Click 'Contact us' from navbar", async () => {
      await homePage.navbar.clickContactUs();
    });

    await test.step("Step 3: Verify 'Get In Touch' heading is visible", async () => {
      await contactUsPage.verifyGetInTouchVisible();
    });

    await test.step("Step 4: Fill contact form with name, email, subject, message", async () => {
      await contactUsPage.fillContactForm(
        contactData.name,
        contactData.email,
        contactData.subject,
        contactData.message,
      );
    });

    await test.step("Step 5: Upload file attachment", async () => {
      await contactUsPage.uploadFile(uploadFilePath);
    });

    await test.step("Step 6: Click Submit and accept OK on confirmation dialog", async () => {
      await contactUsPage.clickSubmitAndAcceptDialog();
    });

    await test.step("Step 7: Verify success message is displayed", async () => {
      await contactUsPage.verifySuccessMessage();
    });

    await test.step("Step 8: Click Home button and verify return to home page", async () => {
      await contactUsPage.clickHome();
      await homePage.verifyTitle();
    });
  });

  // ─────────────────────────────────────────────────────────────
  // TC-CU-002: Submit form KHÔNG có file upload
  // ─────────────────────────────────────────────────────────────
  test("TC-CU-002: Should submit contact form successfully without file upload", async ({
    contactUsPage,
    homePage,
  }) => {
    const contactData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      subject: "General Inquiry",
      message: faker.lorem.paragraph(1),
    };

    await test.step("Step 1: Navigate directly to Contact Us page", async () => {
      await contactUsPage.navigateToContactUs();
    });

    await test.step("Step 2: Verify page loaded correctly", async () => {
      await contactUsPage.verifyGetInTouchVisible();
    });

    await test.step("Step 3: Fill form WITHOUT uploading any file", async () => {
      await contactUsPage.fillContactForm(
        contactData.name,
        contactData.email,
        contactData.subject,
        contactData.message,
      );
    });

    await test.step("Step 4: Submit form and accept dialog", async () => {
      await contactUsPage.clickSubmitAndAcceptDialog();
    });

    await test.step("Step 5: Verify success message", async () => {
      await contactUsPage.verifySuccessMessage();
    });
  });

  // ─────────────────────────────────────────────────────────────
  // TC-CU-003: Verify giao diện Contact Us page
  // ─────────────────────────────────────────────────────────────
  test("TC-CU-003: Should display Contact Us page elements correctly", async ({
    contactUsPage,
  }) => {
    await test.step("Step 1: Navigate to Contact Us page", async () => {
      await contactUsPage.navigateToContactUs();
    });

    await test.step("Step 2: Verify all form elements are visible", async () => {
      await contactUsPage.verifyGetInTouchVisible();
      await contactUsPage.verifyFormElementsVisible();
    });
  });
});
