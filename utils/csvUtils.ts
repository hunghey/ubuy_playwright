import * as fs from "fs";
import * as path from "path";

export interface UserCredentials {
  name: string;
  email: string;
  password: string;
  status?: string;
}

/**
 * Saves user credentials to CSV file with default status ''
 * @param name - User's full name
 * @param email - User's email address
 * @param password - User's password
 * @param filePath - Optional custom file path (defaults to data/created_users.csv)
 */
export async function saveUserToCSV(
  name: string,
  email: string,
  password: string,
  filePath: string = "test-data/created_users.csv",
): Promise<void> {
  try {
    const absolutePath = path.resolve(filePath);
    const directory = path.dirname(absolutePath);

    // Create directory if it doesn't exist
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    // Check if file exists to determine if we need to write headers
    const fileExists = fs.existsSync(absolutePath);

    // Prepare CSV row with empty status
    const headers = "name,email,password,status\n";
    const row = `"${name}","${email}","${password}",used\n`;

    // Write or append to file
    if (!fileExists) {
      // Write headers and first row
      fs.writeFileSync(absolutePath, headers + row, "utf-8");
      console.log(`Created new CSV file: ${absolutePath}`);
    } else {
      // Append new row
      fs.appendFileSync(absolutePath, row, "utf-8");
      console.log(`Appended user data to: ${absolutePath}`);
    }

    console.log(`User data saved successfully: ${email}`);
  } catch (error) {
    console.error("Error saving user data to CSV:", error);
    throw error;
  }
}

/**
 * Gets an available user from CSV and marks it as 'used'
 * Implements Data Provider pattern for test data consumption
 * @param filePath - Optional custom file path (defaults to data/created_users.csv)
 * @returns User credentials object { name, email, password }
 * @throws Error if no available users or file doesn't exist
 */
export function getUser(
  filePath: string = "data/created_users.csv",
): UserCredentials {
  try {
    const absolutePath = path.resolve(filePath);

    // Check if file exists
    if (!fs.existsSync(absolutePath)) {
      throw new Error(
        `CSV file does not exist: ${absolutePath}. Please create users first.`,
      );
    }

    // Read file content
    const fileContent = fs.readFileSync(absolutePath, "utf-8");
    const lines = fileContent.split("\n").filter((line) => line.trim() !== "");

    if (lines.length <= 1) {
      throw new Error(
        "CSV file is empty or contains only headers. No users available.",
      );
    }

    // Parse all users
    const users: UserCredentials[] = [];
    let availableUserIndex = -1;

    for (let i = 1; i < lines.length; i++) {
      // Match CSV pattern: "name","email","password",status
      const match = lines[i].match(/"([^"]*)","([^"]*)","([^"]*)",(.*)$/);

      if (match) {
        const status = match[4].trim();
        const user: UserCredentials = {
          name: match[1],
          email: match[2],
          password: match[3],
          status: status,
        };

        users.push(user);

        // Find first available user (status is empty)
        if (availableUserIndex === -1 && status === "") {
          availableUserIndex = i - 1; // Subtract 1 because we skip header
        }
      }
    }

    // Check if any available user found
    if (availableUserIndex === -1) {
      throw new Error(
        "No available users with empty status. All users have been used.",
      );
    }

    // Update status to 'used'
    users[availableUserIndex].status = "used";

    // Rebuild CSV content
    let newContent = "name,email,password,status\n";
    users.forEach((user) => {
      newContent += `"${user.name}","${user.email}","${user.password}",${user.status}\n`;
    });

    // Overwrite file with updated data
    fs.writeFileSync(absolutePath, newContent, "utf-8");

    const selectedUser = users[availableUserIndex];
    console.log(`User consumed from CSV: ${selectedUser.email}`);

    // Return user without status field
    return {
      name: selectedUser.name,
      email: selectedUser.email,
      password: selectedUser.password,
    };
  } catch (error) {
    console.error("Error getting user from CSV:", error);
    throw error;
  }
}

/**
 * Reads all users from the CSV file
 * @param filePath - Optional custom file path (defaults to data/created_users.csv)
 * @returns Array of user credentials
 */
export function readUsersFromCSV(
  filePath: string = "data/created_users.csv",
): UserCredentials[] {
  try {
    const absolutePath = path.resolve(filePath);

    if (!fs.existsSync(absolutePath)) {
      console.log("CSV file does not exist yet");
      return [];
    }

    const fileContent = fs.readFileSync(absolutePath, "utf-8");
    const lines = fileContent.split("\n").filter((line) => line.trim() !== "");

    // Skip header row and parse data
    const users: UserCredentials[] = [];
    for (let i = 1; i < lines.length; i++) {
      const match = lines[i].match(/"([^"]*)","([^"]*)","([^"]*)",(.*)$/);
      if (match) {
        users.push({
          name: match[1],
          email: match[2],
          password: match[3],
          status: match[4].trim(),
        });
      }
    }

    return users;
  } catch (error) {
    console.error("Error reading users from CSV:", error);
    return [];
  }
}
