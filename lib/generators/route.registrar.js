import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'

export const registerRoute = async (name) => {
  const indexPath = path.join(process.cwd(), 'src/routes/index.js')
  if (!await fs.pathExists(indexPath)) {
    console.log(chalk.yellow('  ⚠️  src/routes/index.js not found — skipping route registration'))
    return
  }

  let content = await fs.readFile(indexPath, 'utf8')

  const importLine = `import ${name}Routes from './api/${name}.routes.js'`
  const useLine = `router.use('/${name}s', ${name}Routes)`

  if (content.includes(importLine)) {
    console.log(chalk.yellow(`  ⚠️  Route '${name}' already registered`))
    return
  }

  content = content.replace('// NEW_ROUTE_IMPORT', `${importLine}\n// NEW_ROUTE_IMPORT`)
  content = content.replace('// NEW_ROUTE_USE', `${useLine}\n// NEW_ROUTE_USE`)

  await fs.writeFile(indexPath, content, 'utf8')
}
