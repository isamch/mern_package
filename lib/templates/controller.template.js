const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

export const controllerTemplate = (name) => `\
import asyncHandler        from '#utils/async-handler.js'
import { notFound }        from '#utils/app-error.js'
import { successResponse } from '#utils/api-response.js'
import * as ${cap(name)}Service from '#services/${name}.service.js'

export const getAll${cap(name)}s = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query
  const { data, meta } = await ${cap(name)}Service.findAll({ page: +page, limit: +limit })
  successResponse(res, 200, '${cap(name)}s fetched successfully', { ${name}s: data, meta })
})

export const get${cap(name)} = asyncHandler(async (req, res) => {
  const item = await ${cap(name)}Service.findById(req.params.id)
  if (!item) throw notFound('${cap(name)} not found')
  successResponse(res, 200, '${cap(name)} fetched successfully', { ${name}: item })
})

export const create${cap(name)} = asyncHandler(async (req, res) => {
  const item = await ${cap(name)}Service.create(req.body)
  successResponse(res, 201, '${cap(name)} created successfully', { ${name}: item })
})

export const update${cap(name)} = asyncHandler(async (req, res) => {
  const item = await ${cap(name)}Service.updateById(req.params.id, req.body)
  if (!item) throw notFound('${cap(name)} not found')
  successResponse(res, 200, '${cap(name)} updated successfully', { ${name}: item })
})

export const delete${cap(name)} = asyncHandler(async (req, res) => {
  await ${cap(name)}Service.deleteById(req.params.id)
  successResponse(res, 200, '${cap(name)} deleted successfully', null)
})
`
