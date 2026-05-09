/**
 * TypeScript Types and Interfaces for Automation Exercise UI
 *
 * UI specific types that differ from API types
 */

export interface UIUserData {
  firstname: string;
  lastname: string;
  name: string;
  email: string;
  password: string;
  gender: "Mr." | "Mrs.";
  dateOfBirth: {
    day: string;
    month: string;
    year: string;
  };
  company: string;
  address1: string;
  address2: string;
  country: string;
  zipcode: string;
  state: string;
  city: string;
  mobile_number: string;
}
