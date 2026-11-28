import "dotenv/config";
import readline from "node:readline";
import bcrypt from "bcryptjs";
import { connectDB, disconnectDB } from "../config/db.js";
import { Admin } from "../storage/models.js";

const PLACEHOLDER_PASSWORDS = new Set([
  "ChangeThisStrongPassword123!",
  "changeme",
  "replace_me",
]);

function promptLine(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(String(answer || "").trim());
    });
  });
}

function promptHidden(question) {
  return new Promise((resolve, reject) => {
    if (!process.stdin.isTTY) {
      const rl = readline.createInterface({
        input: process.stdin,
        terminal: false,
      });
      let value = "";
      rl.on("line", (line) => {
        if (!value) value = line;
        rl.close();
      });
      rl.on("close", () => resolve(value.trim()));
      return;
    }

    process.stdout.write(question);
    const stdin = process.stdin;
    const wasRaw = Boolean(stdin.isRaw);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    let input = "";

    const cleanup = () => {
      stdin.removeListener("data", onData);
      stdin.setRawMode(wasRaw);
      stdin.pause();
    };

    const onData = (chunk) => {
      for (const ch of chunk) {
        if (ch === "\r" || ch === "\n") {
          cleanup();
          process.stdout.write("\n");
          resolve(input);
          return;
        }
        if (ch === "\u0003") {
          cleanup();
          process.stdout.write("\n");
          reject(new Error("Admin creation cancelled by user."));
          return;
        }
        if (ch === "\u0008" || ch === "\u007f") {
          if (input.length > 0) {
            input = input.slice(0, -1);
          }
          continue;
        }
        if (ch >= " ") {
          input += ch;
        }
      }
    };

    stdin.on("data", onData);
  });
}

async function resolveAdminInputs() {
  let name = (process.env.ADMIN_NAME || "").trim();
  let email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  let password = process.env.ADMIN_PASSWORD || "";

  if (!name) {
    name = (await promptLine("Admin name [GunLite Administrator]: ")) || "GunLite Administrator";
  }

  if (!email) {
    email = (await promptLine("Admin email: ")).toLowerCase();
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("A valid admin email address is required.");
  }

  const useEnvPassword =
    typeof password === "string" &&
    password.length > 0 &&
    !PLACEHOLDER_PASSWORDS.has(password) &&
    !process.argv.includes("--prompt");

  if (!useEnvPassword) {
    password = await promptHidden("Admin password (hidden, min 8 chars): ");
    const confirm = await promptHidden("Confirm admin password (hidden): ");
    if (password !== confirm) {
      throw new Error("Passwords did not match.");
    }
  }

  if (!password || password.length < 8) {
    throw new Error("Admin password must be at least 8 characters long.");
  }

  if (PLACEHOLDER_PASSWORDS.has(password)) {
    throw new Error("Please choose a real password instead of the example placeholder.");
  }

  return { name, email, password };
}

async function createFirstAdmin() {
  await connectDB();

  const existingAdmin = await Admin.findOne().select("email role").lean();
  if (existingAdmin) {
    console.log(
      `An admin account already exists (${existingAdmin.email}). Skipping one-time admin creation.`
    );
    return;
  }

  const { name, email, password } = await resolveAdminInputs();
  const passwordHash = await bcrypt.hash(password, 12);

  await Admin.create({
    name,
    email,
    passwordHash,
    role: "admin",
  });

  console.log(`Created first admin account: ${email}`);
}

createFirstAdmin()
  .catch((err) => {
    console.error("Failed to create admin:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDB();
  });
