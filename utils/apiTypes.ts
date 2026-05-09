/**
 * TypeScript Types and Interfaces for Automation Exercise API
 *
 * This file contains all type definitions for API requests and responses
 * to ensure type safety and better code documentation.
 */

// =============================================================================
// Response Code Enums
// =============================================================================

export enum ResponseCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
}

export enum ResponseMessage {
  USER_EXISTS = "User exists!",
  USER_NOT_FOUND = "User not found!",
  USER_CREATED = "User created!",
  ACCOUNT_DELETED = "Account deleted!",
  USER_UPDATED = "User updated!",
  METHOD_NOT_SUPPORTED = "This request method is not supported.",
  BAD_REQUEST_SEARCH = "Bad request, search_product parameter is missing in POST request.",
  BAD_REQUEST_LOGIN = "Bad request, email or password parameter is missing in POST request.",
}

// =============================================================================
// Product Types
// =============================================================================

export interface Product {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: {
    usertype: {
      usertype: string;
    };
    category: string;
  };
}

export interface ProductsResponse {
  responseCode: number;
  products: Product[];
}

// =============================================================================
// Brand Types
// =============================================================================

export interface Brand {
  id: number;
  brand: string;
}

export interface BrandsResponse {
  responseCode: number;
  brands: Brand[];
}

// =============================================================================
// Search Types
// =============================================================================

export interface SearchProductRequest {
  search_product: string;
}

export interface SearchProductResponse {
  responseCode: number;
  products: Product[];
}

// =============================================================================
// Authentication Types
// =============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  responseCode: number;
  message: string;
}

// =============================================================================
// User Account Types
// =============================================================================

export interface CreateAccountRequest {
  name: string;
  email: string;
  password: string;
  title: "Mr" | "Mrs" | "Miss";
  birth_date: string;
  birth_month: string;
  birth_year: string;
  firstname: string;
  lastname: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  zipcode: string;
  state: string;
  city: string;
  mobile_number: string;
}

export interface UpdateAccountRequest extends CreateAccountRequest {}

export interface DeleteAccountRequest {
  email: string;
  password: string;
}

export interface GetUserDetailRequest {
  email: string;
}

export interface UserDetailResponse {
  responseCode: number;
  user: {
    name: string;
    email: string;
    title: string;
    birth_day: string;
    birth_month: string;
    birth_year: string;
    first_name: string;
    last_name: string;
    company: string;
    address1: string;
    address2: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
  };
}

export interface AccountResponse {
  responseCode: number;
  message: string;
}

// =============================================================================
// Error Response Types
// =============================================================================

export interface ErrorResponse {
  responseCode: number;
  message: string;
}

// =============================================================================
// Generic API Response
// =============================================================================

export type ApiResponse<T = any> = T | ErrorResponse;
