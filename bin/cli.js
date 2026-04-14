#!/usr/bin/env node

/**
 * © 2026 Rana J.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import logger from "../src/utils/logger.js";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));

const run = async () => {
  console.log(chalk.cyan(`\n🛠️  ServiceForge-Prisma CLI v${pkg.version}\n`));

  const args = process.argv.slice(2);
  
  // Handle simple version/help flags
  if (args.includes('--version') || args.includes('-v')) {
    console.log(`v${pkg.version}`);
    return;
  }

  if (args.includes('--help') || args.includes('-h')) {
    console.log(chalk.yellow(`
Usage:
  sf-prisma           Interactive setup
  sf-prisma <command>

Options:
  -v, --version  Show version
  -h, --help     Show help
    `));
    return;
  }

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "setupType",
      message: "Where do you want to initialize ServiceForge-Prisma?",
      choices: ["Current directory", "Create new directory"],
    },
    {
      type: "input",
      name: "ProjectName",
      message: "Enter project name:",
      when: (answer) => answer.setupType === "Create new directory",
      validate: (input) => {
        if (!input.trim()) {
          return "Project name cannot be empty";
        }
        return true;
      }
    },
  ]);

  let targetPath;
  if (answers.setupType === "Current directory") {
    targetPath = process.cwd();
  } else {
    targetPath = path.join(process.cwd(), answers.ProjectName);

    if (fs.existsSync(targetPath)) {
      console.log(chalk.red("\n❌ Error: Folder already exists!"));
      process.exit(1);
    }
    fs.mkdirSync(targetPath);
  }

  logger.info("Initialization complete!");
  console.log(chalk.green("\n✅ Success!"));
  console.log(chalk.gray("---------------------------------"));
  console.log(chalk.white("📁 Path:"), chalk.blue(targetPath));
  console.log(chalk.gray("---------------------------------\n"));
  
  console.log(chalk.yellow("Next steps:"));
  console.log(chalk.white("1. Add DATABASE_URL to your .env"));
  console.log(chalk.white("2. Run "), chalk.cyan("npx prisma generate"));
  console.log(chalk.white("3. Start building with ServiceForge!\n"));
};

run().catch((err) => {
  logger.error(`Fatal Error in CLI: ${err.message}`);
  console.error(chalk.red(`\n💥 Fatal Error: ${err.message}`));
  process.exit(1);
});