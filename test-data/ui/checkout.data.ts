/**
 * E2E Checkout Flow Test Data
 */

/** Test payment card details (fake) */
export const TEST_CARD = {
  nameOnCard: "Test User",
  cardNumber: "4111111111111111",
  cvc: "123",
  expiryMonth: "12",
  expiryYear: "2030",
} as const;

/** Order comments for different scenarios */
export const ORDER_COMMENTS = {
  standard: "Please deliver between 9 AM - 5 PM. Thank you!",
  rush: "URGENT: Rush delivery needed",
  empty: "",
} as const;
