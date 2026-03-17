import fs   from 'fs-extra'
import path  from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PKG_ROOT  = path.join(__dirname, '..')

const EXCLUDE = [
  'node_modules', '.git', '.github', '.amazonq', 'dist', 'build',
  'coverage', 'logs', 'package-lock.json', '.DS_Store', 'docs', 'tests',
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
  const { name, description, author } = answers
  const targetDir = path.join(process.cwd(), name)

  if (await fs.pathExists(targetDir) && (await fs.readdir(targetDir)).length > 0) {
    throw new Error(`Directory '${name}' already exists and is not empty.`)
  }

  await fs.ensureDir(targetDir)
  await copyRecursive(PKG_ROOT, targetDir, PKG_ROOT)

  // Remove CLI source from scaffolded project
  await fs.remove(path.join(targetDir, 'bin'))
  await fs.remove(path.join(targetDir, 'lib'))

  const deps = {
    bcryptjs:              '^3.0.2',
    compression:           '^1.7.4',
    cors:                  '^2.8.5',
    dotenv:                '^17.2.1',
    express:               '^5.1.0',
    'express-rate-limit':  '^7.4.0',
    helmet:                '^8.1.0',
    joi:                   '^18.0.1',
    jsonwebtoken:          '^9.0.2',
    mongoose:              '^8.17.2',
    morgan:                '^1.10.0',
    nodemailer:            '^7.0.5',
    'swagger-jsdoc':       '^6.2.8',
    'swagger-ui-express':  '^5.0.1',
    winston:               '^3.17.0',
  }

  const devDeps = {
    nodemon:  '^3.1.10',
    eslint:   '^9.17.0',
    prettier: '^3.4.2',
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
      '#utils/*':       './src/utils/*',
      '#templates/*':   './src/templates/*',
      '#permissions/*': './src/permissions/*',
      '#config/*':      './src/config/*',
      '#controllers/*': './src/controllers/*',
      '#services/*':    './src/services/*',
      '#models/*':      './src/models/*',
      '#middlewares/*': './src/middlewares/*',
      '#validations/*': './src/validations/*',
      '#routes/*':      './src/routes/*',
    },
    scripts: {
      'seed:roles': 'node scripts/seed-roles.js',
      start:        'node server.js',
      dev:          'nodemon server.js',
      lint:         'eslint src/ --ext .js',
      'lint:fix':   'eslint src/ --ext .js --fix',
      format:       'prettier --write src/',
    },
    dependencies:    deps,
    devDependencies: devDeps,
  }

  await fs.writeFile(
    path.join(targetDir, 'package.json'),
    JSON.stringify(appPackage, null, 2)
  )

  await fs.copy(
    path.join(PKG_ROOT, '.env.example'),
    path.join(targetDir, '.env.example')
  )
}
