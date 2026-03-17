import fs   from 'fs-extra'
import path  from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PKG_ROOT  = path.join(__dirname, '..')

const EXCLUDE = [
  'node_modules', '.git', '.github', 'dist', 'build',
  'coverage', 'logs', 'package-lock.json', '.DS_Store', 'docs',
]

const shouldExclude = (rel) =>
  EXCLUDE.some((e) => rel === e || rel.startsWith(`${e}${path.sep}`))

const copyRecursive = async (src, dest, base) => {
  const rel  = path.relative(base, src)
  if (rel && shouldExclude(rel)) return

  const stat = await fs.stat(src)
  if (stat.isDirectory()) {
    await fs.ensureDir(dest)
    for (const entry of await fs.readdir(src)) {
      await copyRecursive(path.join(src, entry), path.join(dest, entry), base)
    }
  } else {
    await fs.copy(src, dest)
  }
}

export const scaffoldProject = async (answers) => {
  const { name, description, author, features } = answers
  const targetDir = path.join(process.cwd(), name)

  if (await fs.pathExists(targetDir) && (await fs.readdir(targetDir)).length > 0) {
    throw new Error(`Directory '${name}' already exists and is not empty.`)
  }

  await fs.ensureDir(targetDir)
  await copyRecursive(PKG_ROOT, targetDir, PKG_ROOT)

  // Remove CLI source from scaffolded project
  await fs.remove(path.join(targetDir, 'bin'))
  await fs.remove(path.join(targetDir, 'lib'))

  // Remove swagger config if not selected
  if (!features.includes('swagger')) {
    await fs.remove(path.join(targetDir, 'src', 'config', 'swagger.js'))
  }

  // Remove email utils if not selected
  if (!features.includes('email')) {
    await fs.remove(path.join(targetDir, 'src', 'utils', 'email.js'))
  }

  const deps = {
    bcryptjs:           '^3.0.2',
    cors:               '^2.8.5',
    dotenv:             '^17.2.1',
    express:            '^5.1.0',
    'express-rate-limit': '^7.4.0',
    helmet:             '^8.1.0',
    joi:                '^18.0.1',
    jsonwebtoken:       '^9.0.2',
    mongoose:           '^8.17.2',
    morgan:             '^1.10.0',
    winston:            '^3.17.0',
  }

  if (features.includes('swagger')) {
    deps['swagger-jsdoc']      = '^6.2.8'
    deps['swagger-ui-express'] = '^5.0.1'
  }
  if (features.includes('email'))  deps.nodemailer = '^7.0.5'
  if (features.includes('upload')) deps.multer     = '^1.4.5-lts.1'

  const devDeps = { nodemon: '^3.1.10' }
  if (features.includes('testing')) {
    devDeps.jest      = '^29.7.0'
    devDeps.supertest = '^7.0.0'
  }
  if (features.includes('linting')) {
    devDeps.eslint   = '^9.17.0'
    devDeps.prettier = '^3.4.2'
  }

  const appPackage = {
    name,
    version:     '0.1.0',
    description,
    author,
    private:     true,
    type:        'module',
    main:        'server.js',
    imports: {
      '#utils/*':       './src/utils/*.js',
      '#config/*':      './src/config/*.js',
      '#controllers/*': './src/controllers/*.js',
      '#services/*':    './src/services/*.js',
      '#models/*':      './src/models/*.js',
      '#middlewares/*': './src/middlewares/*.js',
      '#validations/*': './src/validations/*.js',
      '#routes/*':      './src/routes/*.js',
    },
    scripts: {
      start: 'node server.js',
      dev:   'nodemon server.js',
      ...(features.includes('testing') && { test: 'node --experimental-vm-modules node_modules/.bin/jest' }),
      ...(features.includes('linting') && { lint: 'eslint src/ --ext .js', 'lint:fix': 'eslint src/ --ext .js --fix' }),
    },
    dependencies:    deps,
    devDependencies: devDeps,
  }

  await fs.writeFile(
    path.join(targetDir, 'package.json'),
    JSON.stringify(appPackage, null, 2)
  )

  // Generate .env.example based on selections
  const envLines = [
    '# App',
    'NODE_ENV=development',
    'PORT=3000',
    '',
    '# MongoDB',
    'MONGODB_URI=mongodb://localhost:27017/myapp',
    '',
    '# JWT',
    'JWT_SECRET=your_super_secret_key_min_32_characters_here',
    'JWT_EXPIRES_IN=15m',
    'JWT_REFRESH_SECRET=your_refresh_secret_key_min_32_chars',
    'JWT_REFRESH_EXPIRES_IN=7d',
    '',
    '# CORS',
    'ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173',
    '',
    '# Logging',
    'LOG_LEVEL=debug',
    '',
  ]

  if (features.includes('swagger')) envLines.push('# Swagger', 'SWAGGER_ENABLED=true', '')
  if (features.includes('email')) {
    envLines.push('# Email', 'SMTP_HOST=smtp.mailtrap.io', 'SMTP_PORT=587', 'SMTP_USER=', 'SMTP_PASS=', 'EMAIL_FROM=noreply@myapp.com', '')
  }

  await fs.writeFile(path.join(targetDir, '.env.example'), envLines.join('\n'))
}
