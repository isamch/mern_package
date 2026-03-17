#!/usr/bin/env node

import inquirer from 'inquirer'
import chalk from 'chalk'
import ora from 'ora'
import { scaffoldProject } from '../lib/scaffold.js'

console.log(chalk.cyan(`
╔═══════════════════════════════════════════╗
║   ⚡  icmern App Generator  v2.0.0       ║
╚═══════════════════════════════════════════╝
`))

const projectName = process.argv[2]

const answers = await inquirer.prompt([
  {
    type: 'input',
    name: 'name',
    message: 'Project name?',
    default: projectName ?? 'my-api',
    validate: (v) => /^[a-z0-9-_]+$/.test(v) || 'Lowercase letters, numbers, hyphens only',
  },
  {
    type: 'input',
    name: 'description',
    message: 'Description?',
    default: 'A RESTful API built with icmern',
  },
  {
    type: 'input',
    name: 'author',
    message: 'Author?',
    default: '',
  },
  {
    type: 'checkbox',
    name: 'features',
    message: 'Select features:',
    choices: [
      { name: 'Swagger / OpenAPI docs', value: 'swagger', checked: true },
      { name: 'Role & Permission system', value: 'rbac', checked: true },
      { name: 'Email (Nodemailer)', value: 'email', checked: false },
      { name: 'File Upload (Multer)', value: 'upload', checked: false },
      { name: 'Docker + docker-compose', value: 'docker', checked: true },
      { name: 'GitHub Actions CI', value: 'ci', checked: true },
      { name: 'Jest testing setup', value: 'testing', checked: true },
      { name: 'ESLint + Prettier', value: 'linting', checked: true },
    ],
  },
])

const spinner = ora('Scaffolding your project...').start()

try {
  await scaffoldProject(answers)
  spinner.succeed(chalk.green('Project created successfully!\n'))

  console.log(chalk.bold('Get started:'))
  console.log(chalk.cyan(`  cd ${answers.name}`))
  console.log(chalk.cyan('  cp .env.example .env'))
  console.log(chalk.cyan('  npm install'))
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
