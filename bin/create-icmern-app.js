#!/usr/bin/env node

import inquirer from 'inquirer'
import chalk    from 'chalk'
import ora      from 'ora'
import { execSync } from 'child_process'
import { scaffoldProject } from '../lib/scaffold.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(chalk.cyan(`
╔═══════════════════════════════════════════╗
║   ⚡  icmern App Generator  v4.0.0       ║
╚═══════════════════════════════════════════╝
`))

const projectName = process.argv[2]

const answers = await inquirer.prompt([
  {
    type:     'input',
    name:     'name',
    message:  'Project name?',
    default:  projectName ?? 'my-api',
    validate: (v) => /^[a-z0-9-_]+$/.test(v) || 'Lowercase letters, numbers, hyphens only',
  },
  {
    type:    'input',
    name:    'description',
    message: 'Description?',
    default: 'A RESTful API built with icmern',
  },
  {
    type:    'input',
    name:    'author',
    message: 'Author?',
    default: '',
  },
])

const spinner = ora('Scaffolding your project...').start()

try {
  await scaffoldProject(answers)
  spinner.succeed(chalk.green('Project scaffolded!\n'))

  // نسخ مجلد .github إذا كان موجودًا
  const githubSrc = path.join(__dirname, '../.github');
  const githubDest = path.join(process.cwd(), answers.name, '.github');
  if (fs.existsSync(githubSrc)) {
    fs.cpSync(githubSrc, githubDest, { recursive: true });
  }
  // نسخ مجلد logs إذا كان موجودًا
  const logsSrc = path.join(__dirname, '../.logs');
  const logsDest = path.join(process.cwd(), answers.name, 'logs');
  if (fs.existsSync(logsSrc)) {
    fs.cpSync(logsSrc, logsDest, { recursive: true });
  }

  // const installSpinner = ora('Installing dependencies...').start()
  // execSync('npm install', { cwd: `${process.cwd()}/${answers.name}`, stdio: 'ignore' })
  // installSpinner.succeed(chalk.green('Dependencies installed!\n'))

  console.log(chalk.bold('Get started:'))
  console.log(chalk.cyan(`  cd ${answers.name}`))
  console.log(chalk.cyan('  cp .env.example .env'))
  console.log(chalk.cyan('  npm run seed:roles'))
  console.log(chalk.cyan('  npm run dev\n'))

  console.log(chalk.bold('icmern CLI commands:'))
  console.log(chalk.dim('  icmern create full <name>        Generate complete resource'))
  console.log(chalk.dim('  icmern create controller <name>  Generate controller only'))
  console.log(chalk.dim('  icmern create service <name>     Generate service only'))
  console.log(chalk.dim('  icmern create model <name>       Generate model only'))
  console.log(chalk.dim('  icmern create validation <name>  Generate validation folder\n'))
} catch (err) {
  spinner.fail(chalk.red('Failed to scaffold project'))
  console.error(err)
  process.exit(1)
}
