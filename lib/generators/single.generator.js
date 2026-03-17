import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import {
  controllerTemplate,
  serviceTemplate,
  modelMongoTemplate,
  modelPgTemplate,
  routeTemplate,
  validationTemplates,
  permissionTemplate,
} from '../templates/index.js'

const write = async (filePath, content) => {
  await fs.ensureDir(path.dirname(filePath))
  await fs.writeFile(filePath, content, 'utf8')
  console.log(chalk.green(`  ✅ Created: ${filePath}`))
}

export const createSingle = async (type, name, options = {}) => {
  const base = process.cwd()

  switch (type) {
    case 'controller':
      await write(path.join(base, `src/controllers/${name}.controller.js`), controllerTemplate(name))
      break

    case 'service':
      await write(path.join(base, `src/services/${name}.service.js`), serviceTemplate(name))
      break

    case 'model':
      await write(path.join(base, `src/models/${name}.model.js`), modelMongoTemplate(name))
      break

    case 'route':
      await write(path.join(base, `src/routes/api/${name}.routes.js`), routeTemplate(name))
      break

    case 'validation': {
      const files = validationTemplates(name)
      for (const [fileName, content] of Object.entries(files)) {
        await write(path.join(base, `src/validations/${name}.validation/${fileName}`), content)
      }
      break
    }

    case 'permission':
      await write(path.join(base, `src/permissions/${name}.permission.js`), permissionTemplate(name))
      break

    default:
      console.log(chalk.red(`❌ Unknown type: ${type}`))
      console.log(chalk.dim('Available: controller, service, model, route, validation, permission'))
      process.exit(1)
  }
}
