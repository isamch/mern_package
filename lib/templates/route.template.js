const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

export const routeTemplate = (name) => `\
import { Router }            from 'express'
import { protect }           from '#middlewares/auth.middleware.js'
import { hasPermission }     from '#middlewares/permission.middleware.js'
import { validate }          from '#middlewares/validate.middleware.js'
import { create${cap(name)}Schema }  from '#validations/${name}.validation/create${cap(name)}.validation.js'
import { update${cap(name)}Schema }  from '#validations/${name}.validation/update${cap(name)}.validation.js'
import { get${cap(name)}ByIdSchema } from '#validations/${name}.validation/get${cap(name)}ById.validation.js'
import { delete${cap(name)}Schema }  from '#validations/${name}.validation/delete${cap(name)}.validation.js'
import * as ${cap(name)}Controller   from '#controllers/${name}.controller.js'

const router = Router()

router.use(protect)

router.get('/',       hasPermission('${name}s:read'),                                    ${cap(name)}Controller.getAll${cap(name)}s)
router.get('/:id',    validate(get${cap(name)}ByIdSchema), hasPermission('${name}s:read'),   ${cap(name)}Controller.get${cap(name)})
router.post('/',      validate(create${cap(name)}Schema),  hasPermission('${name}s:create'), ${cap(name)}Controller.create${cap(name)})
router.patch('/:id',  validate(update${cap(name)}Schema),  hasPermission('${name}s:update'), ${cap(name)}Controller.update${cap(name)})
router.delete('/:id', validate(delete${cap(name)}Schema),  hasPermission('${name}s:delete'), ${cap(name)}Controller.delete${cap(name)})

export default router
`
