import { test, expect } from "../../../fixtures/pomFixtures";
import {
  PRODUCT_INDICES,
  DEFAULT_QUANTITY,
} from "../../../test-data/ui/cart.data";

/**
 * Functional Test: Add to Cart (UI)
 *
 * URL: https://automationexercise.com/products → /view_cart
 *
 * Test Coverage:
 * ── Positive Tests ──────────────────────────────────────────
 * TC-CART-001: Add single product to cart and verify
 * TC-CART-002: Add multiple products and verify all in cart
 * TC-CART-003: Verify price × quantity = total calculation
 * TC-CART-004: Add product and navigate via "View Cart" modal link
 *
 * ── Negative Tests ──────────────────────────────────────────
 * TC-CART-005: Remove product from cart
 * TC-CART-006: Remove all products and verify empty cart
 */

test.describe("Add to Cart - Positive Tests", () => {
  // ─────────────────────────────────────────────────────────────
  // TC-CART-001: Add single product to cart
  // ─────────────────────────────────────────────────────────────
  test("TC-CART-001: Should add a single product to cart and verify details", async ({
    productsPage,
    cartPage,
  }) => {
    await test.step("Step 1: Navigate to Products page", async () => {
      await productsPage.navigateToProducts();
      await productsPage.verifyAllProductsVisible();
    });

    let firstProductName: string;

    await test.step("Step 2: Get first product name for verification", async () => {
      const names = await productsPage.getAllProductNames();
      firstProductName = names[0];
      console.log(`Target product: "${firstProductName}"`);
    });

    await test.step("Step 3: Add first product to cart", async () => {
      await cartPage.addProductToCartByIndex(PRODUCT_INDICES.FIRST);
    });

    await test.step("Step 4: Click Continue Shopping", async () => {
      await cartPage.clickContinueShopping();
    });

    await test.step("Step 5: Navigate to Cart page", async () => {
      await cartPage.navigateToCart();
      await cartPage.verifyCartPageVisible();
    });

    await test.step("Step 6: Verify product is in cart with correct details", async () => {
      await cartPage.verifyCartItemCount(1);
      await cartPage.verifyProductInCart(firstProductName!);
      await cartPage.verifyProductQuantity(0, DEFAULT_QUANTITY);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // TC-CART-002: Add multiple products to cart
  // ─────────────────────────────────────────────────────────────
  test("TC-CART-002: Should add multiple products and verify all are in cart", async ({
    productsPage,
    cartPage,
  }) => {
    await test.step("Step 1: Navigate to Products page", async () => {
      await productsPage.navigateToProducts();
      await productsPage.verifyAllProductsVisible();
    });

    await test.step("Step 2: Add first product to cart", async () => {
      await cartPage.addProductToCartByIndex(PRODUCT_INDICES.FIRST);
      await cartPage.clickContinueShopping();
    });

    await test.step("Step 3: Add second product to cart", async () => {
      await cartPage.addProductToCartByIndex(PRODUCT_INDICES.SECOND);
      await cartPage.clickContinueShopping();
    });

    await test.step("Step 4: Navigate to cart", async () => {
      await cartPage.navigateToCart();
      await cartPage.verifyCartPageVisible();
    });

    await test.step("Step 5: Verify both products are in cart", async () => {
      await cartPage.verifyCartItemCount(2);

      const items = await cartPage.getCartItems();
      console.log(
        "Cart items:",
        items
          .map((i) => `${i.name} | ${i.price} | qty: ${i.quantity}`)
          .join("\n"),
      );
    });
  });

  // ─────────────────────────────────────────────────────────────
  // TC-CART-003: Verify price calculation
  // ─────────────────────────────────────────────────────────────
  test("TC-CART-003: Should verify price × quantity = total for each product", async ({
    productsPage,
    cartPage,
  }) => {
    await test.step("Step 1: Navigate to Products and add a product", async () => {
      await productsPage.navigateToProducts();
      await cartPage.addProductToCartByIndex(PRODUCT_INDICES.FIRST);
      await cartPage.clickContinueShopping();
    });

    await test.step("Step 2: Navigate to cart", async () => {
      await cartPage.navigateToCart();
      await cartPage.verifyCartPageVisible();
    });

    await test.step("Step 3: Verify price × quantity = total", async () => {
      await cartPage.verifyPriceTotalConsistency(0);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // TC-CART-004: Add product and use "View Cart" modal link
  // ─────────────────────────────────────────────────────────────
  test("TC-CART-004: Should navigate to cart via modal 'View Cart' link", async ({
    productsPage,
    cartPage,
  }) => {
    await test.step("Step 1: Navigate to Products and add product", async () => {
      await productsPage.navigateToProducts();
      await cartPage.addProductToCartByIndex(PRODUCT_INDICES.FIRST);
    });

    await test.step("Step 2: Click 'View Cart' in modal", async () => {
      await cartPage.clickViewCart();
    });

    await test.step("Step 3: Verify cart page loaded with product", async () => {
      await cartPage.verifyCartPageVisible();
      await cartPage.verifyCartItemCount(1);
    });
  });
});

test.describe("Add to Cart - Negative Tests", () => {
  // ─────────────────────────────────────────────────────────────
  // TC-CART-005: Remove a product from cart
  // ─────────────────────────────────────────────────────────────
  test("TC-CART-005: Should remove a product from cart", async ({
    productsPage,
    cartPage,
  }) => {
    await test.step("Step 1: Add 2 products to cart", async () => {
      await productsPage.navigateToProducts();
      await cartPage.addProductToCartByIndex(PRODUCT_INDICES.FIRST);
      await cartPage.clickContinueShopping();
      await cartPage.addProductToCartByIndex(PRODUCT_INDICES.SECOND);
      await cartPage.clickContinueShopping();
    });

    await test.step("Step 2: Navigate to cart", async () => {
      await cartPage.navigateToCart();
      await cartPage.verifyCartItemCount(2);
    });

    await test.step("Step 3: Remove first product", async () => {
      await cartPage.removeProductByIndex(0);
    });

    await test.step("Step 4: Verify only 1 product remains", async () => {
      await cartPage.verifyCartItemCount(1);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // TC-CART-006: Remove all products → empty cart
  // ─────────────────────────────────────────────────────────────
  test("TC-CART-006: Should show empty cart after removing all products", async ({
    productsPage,
    cartPage,
  }) => {
    await test.step("Step 1: Add product to cart", async () => {
      await productsPage.navigateToProducts();
      await cartPage.addProductToCartByIndex(PRODUCT_INDICES.FIRST);
      await cartPage.clickContinueShopping();
    });

    await test.step("Step 2: Navigate to cart and verify product exists", async () => {
      await cartPage.navigateToCart();
      await cartPage.verifyCartItemCount(1);
    });

    await test.step("Step 3: Remove the product", async () => {
      await cartPage.removeProductByIndex(0);
    });

    await test.step("Step 4: Verify cart is empty", async () => {
      await cartPage.verifyCartIsEmpty();
    });
  });
});
