import dotenv from "dotenv";
dotenv.config();

export interface SiteConfig {
  baseUrl: string;
}

export const automationExerciseConfig: SiteConfig = {
  baseUrl: "https://automationexercise.com",
};
