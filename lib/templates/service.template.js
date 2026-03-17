const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

export const serviceTemplate = (name) => `\
import ${cap(name)}      from '#models/${name}.model.js'
import { paginate } from '#utils/pagination.js'

export const findAll = async ({ page = 1, limit = 20 } = {}) => {
  const { skip, meta } = paginate({ page, limit })
  const [data, total]  = await Promise.all([
    ${cap(name)}.find().skip(skip).limit(limit).lean(),
    ${cap(name)}.countDocuments(),
  ])
  return { data, meta: { ...meta, total } }
}

export const findById = async (id) => ${cap(name)}.findById(id).lean()

export const create = async (body) => ${cap(name)}.create(body)

export const updateById = async (id, body) =>
  ${cap(name)}.findByIdAndUpdate(id, body, { new: true, runValidators: true }).lean()

export const deleteById = async (id) => ${cap(name)}.findByIdAndDelete(id)
`
