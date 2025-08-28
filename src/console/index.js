#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const command = args[0]; // مثل make:controller
const name = args[1];    // مثل posts

if (!command || !name) {
  console.log("❌ Usage: node src/console/index.js make:controller <Name>");
  process.exit(1);
}

// مسار القوالب
const templatesDir = path.join(__dirname, "templates");

// function helper لإنشاء ملف جديد
const generateFile = (type, name, subfolder = "") => {
  const templatePath = path.join(templatesDir, `${type}.js`);
  if (!fs.existsSync(templatePath)) {
    console.log(`❌ Template for ${type} not found.`);
    process.exit(1);
  }

  let content = fs.readFileSync(templatePath, "utf-8");
  content = content.replace(/__NAME__/g, name);

  // مسار الوجهة
  const destDir = path.join(process.cwd(), "src", subfolder);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  // ✅ تحديد اسم الملف حسب النوع
  let fileName;
  switch (type) {
    case "controller":
      fileName = `${name[0].toUpperCase() + name.slice(1)}Controller.js`;
      break;
    case "model":
      fileName = `${name[0].toUpperCase() + name.slice(1)}.js`;
      break;
    case "route":
      fileName = `${name[0].toUpperCase() + name.slice(1)}Routes.js`;
      break;
    case "middleware":
      fileName = `${name[0].toUpperCase() + name.slice(1)}.js`;
      break;
    case "factory":
      fileName = `${name[0].toUpperCase() + name.slice(1)}Factory.js`;
      break;
    default:
      fileName = `${name}.js`;
  }

  const destPath = path.join(destDir, fileName);
  fs.writeFileSync(destPath, content);

  console.log(`✅ ${type} created: ${destPath}`);
};


// أوامر
switch (command) {
  case "make:controller":
    generateFile("controller", name, "controllers");
    break;
  case "make:model":
    generateFile("model", name, "models");
    break;
  case "make:route":
    generateFile("route", name, "routes/api");
    break;
  case "make:middleware":
    generateFile("middleware", name, "middlewares");
    break;
  case "make:factory":
    generateFile("factory", name, "factories");
    break;
  default:
    console.log("❌ Unknown command");
}
