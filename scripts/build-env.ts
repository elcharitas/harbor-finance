import fs from "fs";
import path from "path";

/**
 * Build .env.local file from env object
 *
 * @param envObj
 */
export function buildEnvVariables(envObj: Record<string, string>) {
  console.log("Building .env.local file...");
  const envContent = Object.entries(envObj)
    .map(([key, value]) => `NEXT_PUBLIC_${key}=${value}`)
    .join("\n");

  const envPath = path.join(__dirname, "../.env.local");

  console.log(`Writing to ${envPath}...`);
  fs.writeFileSync(envPath, envContent);
}
