/**
 * Contact Form Test Data
 *
 * Test data for Contact Us form validation testing
 */

import { faker } from "@faker-js/faker";

/**
 * Valid contact form data generator
 */
export function generateValidContactData() {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    subject: faker.lorem.sentence(5),
    message: faker.lorem.paragraph(2),
  };
}

/**
 * Invalid email formats for validation testing
 */
export const INVALID_EMAILS = {
  missingAt: "invalidemail.com",
  missingDomain: "user@",
  withSpace: "user name@example.com",
  multipleAt: "user@@example.com",
  specialChars: "user!#$@example.com",
  onlyDomain: "@example.com",
} as const;

/**
 * Empty/missing field scenarios
 */
export const EMPTY_FORM_SCENARIOS = {
  allEmpty: {
    name: "",
    email: "",
    subject: "",
    message: "",
  },
  onlyName: {
    name: "John Doe",
    email: "",
    subject: "",
    message: "",
  },
  missingEmail: {
    name: "John Doe",
    email: "",
    subject: "Test",
    message: "Message",
  },
} as const;

/**
 * Boundary value test data for contact form
 */
export const CONTACT_FORM_BOUNDARIES = {
  name: {
    tooLong: "a".repeat(200),
    maxValid: "a".repeat(100),
  },
  subject: {
    tooLong: "a".repeat(500),
  },
  message: {
    tooShort: "Hi",
    tooLong: "a".repeat(5000),
  },
} as const;
