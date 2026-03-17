import chalk from 'chalk'
import ora from 'ora'
import { createSingle } from './single.generator.js'
import { registerRoute } from './route.registrar.js'

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

export const createFull = async (name, options = {}) => {
  const spinner = ora(`Generating full resource: ${chalk.cyan(name)}`).start()

  try {
    await createSingle('controller', name, options)
    await createSingle('service', name, options)
    await createSingle(options.pg ? 'model-pg' : 'model', name, options)
    await createSingle('route', name, options)
    await createSingle('validation', name, options)
    await registerRoute(name)

    spinner.succeed(chalk.green(`✅ Full resource '${name}' created!\n`))

    console.log(chalk.dim('─────────────────────────────────'))
    console.log(`  📄 src/controllers/${name}.controller.js`)
    console.log(`  📄 src/services/${name}.service.js`)
    console.log(`  📄 src/models/${name}.model.js`)
    console.log(`  📄 src/routes/api/${name}.routes.js`)
    console.log(`  📁 src/validations/${name}.validation/`)
    console.log(`     ├── create${cap(name)}.validation.js`)
    console.log(`     ├── update${cap(name)}.validation.js`)
    console.log(`     ├── get${cap(name)}ById.validation.js`)
    console.log(`     └── delete${cap(name)}.validation.js`)
    console.log(`  ✅ Route registered in src/routes/index.js`)
    console.log(chalk.dim('─────────────────────────────────\n'))
  } catch (err) {
    spinner.fail(chalk.red(`Failed to generate '${name}'`))
    console.error(err)
    process.exit(1)
  }
}
