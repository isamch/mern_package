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

if (!command) {
  console.log("❌ Usage: icmern <command> <Name>");
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

// نسخ مجلد/ملف بشكل آمن مع استثناءات
const shouldExclude = (relPath) => {
  const excludes = [
    "node_modules",
    ".git",
    ".github",
    ".vscode",
    "dist",
    "build",
    "coverage",
    "package-lock.json",
    "pnpm-lock.yaml",
    "yarn.lock",
    ".DS_Store",
  ];
  return excludes.some((e) => relPath === e || relPath.startsWith(`${e}${path.sep}`));
};

const copyRecursive = (src, dest, base) => {
  const stat = fs.statSync(src);
  const rel = path.relative(base, src);
  if (rel && shouldExclude(rel)) return;

  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry), base);
    }
  } else {
    fs.copyFileSync(src, dest);
  }
};

const removeIfExists = (p) => {
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true, force: true });
  }
};

// أوامر
switch (command) {
  case "make:controller": {
    if (!name) {
      console.log("❌ Usage: icmern make:controller <Name>");
      process.exit(1);
    }
    generateFile("controller", name, "controllers");
    break;
  }
  case "make:model": {
    if (!name) {
      console.log("❌ Usage: icmern make:model <Name>");
      process.exit(1);
    }
    generateFile("model", name, "models");
    break;
  }
  case "make:route": {
    if (!name) {
      console.log("❌ Usage: icmern make:route <Name>");
      process.exit(1);
    }
    generateFile("route", name, "routes/api");
    break;
  }
  case "make:middleware": {
    if (!name) {
      console.log("❌ Usage: icmern make:middleware <Name>");
      process.exit(1);
    }
    // ملاحظة: يتم وضعها داخل مجلد middleware
    generateFile("middleware", name, "middleware");
    break;
  }
  case "make:factory": {
    if (!name) {
      console.log("❌ Usage: icmern make:factory <Name>");
      process.exit(1);
    }
    generateFile("factory", name, "factories");
    break;
  }
  case "init": {
    const targetName = name || "my-app";
    const cwd = process.cwd();
    const targetDir = path.join(cwd, targetName);

    if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
      console.log("❌ Target directory already exists and is not empty.");
      process.exit(1);
    }

    // جذر الحزمة الحالية (src/console → ../../)
    const packageRoot = path.join(__dirname, "..", "..");

    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    // نسخ كل شيء من جذر الحزمة إلى الهدف مع الاستثناءات
    copyRecursive(packageRoot, targetDir, packageRoot);

    // كتابة package.json بسيط للمشروع الجديد
    const appPackage = {
      name: targetName,
      version: "0.1.0",
      private: true,
      description: "",
      main: "server.js",
      type: "module",
      scripts: {
        dev: "nodemon server.js",
        start: "node server.js"
      },
      dependencies: {
        bcryptjs: "^3.0.2",
        "cookie-parser": "^1.4.7",
        cors: "^2.8.5",
        dotenv: "^17.2.1",
        express: "^5.1.0",
        ejs: "^3.1.10",
        faker: "^6.6.6",
        helmet: "^8.1.0",
        joi: "^18.0.1",
        jsonwebtoken: "^9.0.2",
        mongoose: "^8.17.2",
        nodemailer: "^7.0.5"
      },
      devDependencies: {
        nodemon: "^3.1.10"
      }
    };

    fs.writeFileSync(
      path.join(targetDir, "package.json"),
      JSON.stringify(appPackage, null, 2)
    );

    // اكتب سكربت كونسول مصغر داخل المشروع الناتج
    const minimalConsole = '#!/usr/bin/env node\n'
      + 'import fs from "fs";\n'
      + 'import path from "path";\n'
      + 'import { fileURLToPath } from "url";\n\n'
      + 'const __filename = fileURLToPath(import.meta.url);\n'
      + 'const __dirname = path.dirname(__filename);\n\n'
      + 'const templatesDir = path.join(__dirname, "templates");\n\n'
      + 'const args = process.argv.slice(2);\n'
      + 'const command = args[0];\n'
      + 'const name = args[1];\n\n'
      + 'const generateFile = (type, name, subfolder = "") => {\n'
      + '  const templatePath = path.join(templatesDir, type + ".js");\n'
      + '  if (!fs.existsSync(templatePath)) {\n'
      + '    console.log("❌ Template for " + type + " not found.");\n'
      + '    process.exit(1);\n'
      + '  }\n'
      + '  let content = fs.readFileSync(templatePath, "utf-8");\n'
      + '  content = content.replace(/__NAME__/g, name);\n'
      + '  const destDir = path.join(process.cwd(), "src", subfolder);\n'
      + '  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });\n'
      + '  let fileName;\n'
      + '  switch (type) {\n'
      + '    case "controller": fileName = name[0].toUpperCase() + name.slice(1) + "Controller.js"; break;\n'
      + '    case "model": fileName = name[0].toUpperCase() + name.slice(1) + ".js"; break;\n'
      + '    case "route": fileName = name[0].toUpperCase() + name.slice(1) + "Routes.js"; break;\n'
      + '    case "middleware": fileName = name[0].toUpperCase() + name.slice(1) + ".js"; break;\n'
      + '    case "factory": fileName = name[0].toUpperCase() + name.slice(1) + "Factory.js"; break;\n'
      + '    default: fileName = name + ".js";\n'
      + '  }\n'
      + '  const destPath = path.join(destDir, fileName);\n'
      + '  fs.writeFileSync(destPath, content);\n'
      + '  console.log("✅ " + type + " created: " + destPath);\n'
      + '};\n\n'
      + 'switch (command) {\n'
      + '  case "make:controller": {\n'
      + '    if (!name) { console.log("❌ Usage: icmern make:controller <Name>"); process.exit(1); }\n'
      + '    generateFile("controller", name, "controllers");\n'
      + '    break;\n'
      + '  }\n'
      + '  case "make:model": {\n'
      + '    if (!name) { console.log("❌ Usage: icmern make:model <Name>"); process.exit(1); }\n'
      + '    generateFile("model", name, "models");\n'
      + '    break;\n'
      + '  }\n'
      + '  case "make:route": {\n'
      + '    if (!name) { console.log("❌ Usage: icmern make:route <Name>"); process.exit(1); }\n'
      + '    generateFile("route", name, "routes/api");\n'
      + '    break;\n'
      + '  }\n'
      + '  case "make:middleware": {\n'
      + '    if (!name) { console.log("❌ Usage: icmern make:middleware <Name>"); process.exit(1); }\n'
      + '    generateFile("middleware", name, "middleware");\n'
      + '    break;\n'
      + '  }\n'
      + '  case "make:factory": {\n'
      + '    if (!name) { console.log("❌ Usage: icmern make:factory <Name>"); process.exit(1); }\n'
      + '    generateFile("factory", name, "factories");\n'
      + '    break;\n'
      + '  }\n'
      + '  default:\n'
      + '    console.log("❌ Unknown command");\n'
      + '}\n';    const consoleDir = path.join(targetDir, "src", "console");
    if (!fs.existsSync(consoleDir)) fs.mkdirSync(consoleDir, { recursive: true });
    fs.writeFileSync(path.join(consoleDir, "index.js"), minimalConsole);

    console.log(`✅ Project initialized at ${targetDir}`);
    console.log("Next steps:\n  1) cd", targetName, "\n  2) npm install\n  3) npm run dev");
    break;
  }
  default:
    console.log("❌ Unknown command");
}
