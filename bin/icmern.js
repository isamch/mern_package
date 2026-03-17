#!/usr/bin/env node

import { program } from 'commander'
import { createSingle } from '../lib/generators/single.generator.js'
import { createFull } from '../lib/generators/full.generator.js'

program
  .name('icmern')
  .description('icmern CLI — Generate Express files instantly')
  .version('2.0.0')

program
  .command('create <type> <name>')
  .description('Generate a single file or full resource')
  .option('--pg', 'Use PostgreSQL model instead of Mongoose')
  .action(async (type, name, options) => {
    if (type === 'full') {
      await createFull(name, options)
    } else {
      await createSingle(type, name, options)
    }
  })

program.parse()
