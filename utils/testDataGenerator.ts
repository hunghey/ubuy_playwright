import { faker } from "@faker-js/faker";
import { generatePassword } from "../test-data/api/users.generator";
import { UIUserData } from "./uiTypes";
// =============================================================================
// User Account Types
// =============================================================================

export function generateUserAccountData(
  overrides?: Partial<UIUserData>,
): UIUserData {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    firstname: firstName,
    lastname: lastName,
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({
      provider: "example.test",
    }),
    password: generatePassword(),
    gender: faker.helpers.arrayElement(["Mr.", "Mrs."]),
    dateOfBirth: {
      day: faker.number.int({ min: 1, max: 28 }).toString(),
      month: faker.number.int({ min: 1, max: 12 }).toString(),
      year: faker.number.int({ min: 1950, max: 2000 }).toString(),
    },
    company: faker.company.name(),
    address1: faker.location.streetAddress(),
    address2: faker.location.secondaryAddress(),
    country: faker.helpers.arrayElement([
      "India",
      "United States",
      "Canada",
      "Australia",
      "Singapore",
    ]),
    zipcode: faker.location.zipCode(),
    state: faker.location.state(),
    city: faker.location.city(),
    mobile_number: faker.phone.number(),
    ...overrides,
  };
}

export function buildUserData(): UIUserData {
  const credentials = generateUserAccountData();
  return credentials;
}
