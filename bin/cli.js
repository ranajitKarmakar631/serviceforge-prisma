#!/usr/bin/env node

/**
 * © 2026 Rana J.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));

const run = async () => {
  console.log(chalk.cyan(`
  🚀 ServiceForge-Prisma CLI v${pkg.version}
  -----------------------------------------
  `));

  const args = process.argv.slice(2);
  
  if (args.includes('--version') || args.includes('-v')) {
    console.log(`v${pkg.version}`);
    return;
  }

  // Use simple 'input' prompts instead of 'list' for maximum terminal compatibility
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "What is your project name?",
      default: "serviceforge-app",
      validate: (input) => input.trim() ? true : "Project name cannot be empty"
    },
    {
      type: "input",
      name: "dbType",
      message: "Which database? (mongodb, postgresql, mysql, sqlite):",
      default: "mongodb",
      filter: (val) => val.toLowerCase().trim(),
      validate: (input) => {
        const valid = ["mongodb", "postgresql", "mysql", "sqlite"];
        return valid.includes(input) ? true : "Please enter: mongodb, postgresql, mysql, or sqlite";
      }
    },
  ]);

  const targetPath = path.resolve(process.cwd(), answers.projectName);
  
  if (fs.existsSync(targetPath)) {
    const confirmOverwrite = await inquirer.prompt([
      {
        type: "confirm",
        name: "ok",
        message: `Directory ${answers.projectName} already exists. Continue?`,
        default: false
      }
    ]);
    if (!confirmOverwrite.ok) process.exit(0);
  } else {
    fs.mkdirSync(targetPath, { recursive: true });
  }

  console.log(chalk.yellow(`\n🏗️  Scaffolding project structure in ${targetPath}...`));

  // 1. Create prisma directory
  const prismaDir = path.join(targetPath, "prisma");
  if (!fs.existsSync(prismaDir)) fs.mkdirSync(prismaDir);

  // 2. Copy schema.prisma
  const sourceSchema = path.join(__dirname, "..", "prisma", "schema.prisma");
  if (fs.existsSync(sourceSchema)) {
    let schemaContent = fs.readFileSync(sourceSchema, "utf8");
    const providerMap = {
      "mongodb": "mongodb",
      "postgresql": "postgresql",
      "mysql": "mysql",
      "sqlite": "sqlite"
    };
    schemaContent = schemaContent.replace(/provider\s*=\s*".*?"/, `provider = "${providerMap[answers.dbType]}"`);
    fs.writeFileSync(path.join(prismaDir, "schema.prisma"), schemaContent);
  }

  // 3. Create basic package.json if it doesn't exist
  if (!fs.existsSync(path.join(targetPath, "package.json"))) {
    const targetPkg = {
      name: answers.projectName,
      version: "1.0.0",
      type: "module",
      scripts: {
        "start": "node src/index.js",
        "db:generate": "npx prisma generate",
        "db:push": "npx prisma db push"
      },
      dependencies: {
        "@prisma/client": "^5.0.0",
        "@ranajit-karmakar/serviceforge-prisma": `^${pkg.version}`
      }
    };
    fs.writeFileSync(path.join(targetPath, "package.json"), JSON.stringify(targetPkg, null, 2));
  }

  console.log(chalk.green("\n✅ Project initialized successfully!"));
  console.log(chalk.white("\nNext steps:"));
  console.log(chalk.cyan(`  1. cd ${answers.projectName}`));
  console.log(chalk.cyan("  2. npm install"));
  console.log(chalk.cyan("  3. Run npx prisma generate"));
  console.log(chalk.cyan("  4. Start building!\n"));
};

run().catch((err) => {
  console.error(chalk.red(`\n💥 Fatal Error: ${err.message}`));
  process.exit(1);
});