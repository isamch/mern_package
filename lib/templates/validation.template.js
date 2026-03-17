const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

export const validationTemplates = (name) => ({
  [`create${cap(name)}.validation.js`]: `\
import Joi from 'joi'

export const create${cap(name)}Schema = Joi.object({
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100).required()
      .messages({
        'string.min':   'Name must be at least 2 characters',
        'any.required': 'Name is required',
      }),
  }).required(),
})
`,

  [`update${cap(name)}.validation.js`]: `\
import Joi from 'joi'

export const update${cap(name)}Schema = Joi.object({
  params: Joi.object({
    id: Joi.string().required().messages({ 'any.required': '${cap(name)} ID is required' }),
  }).required(),
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100),
  }).min(1).required()
    .messages({ 'object.min': 'At least one field is required for update' }),
})
`,

  [`get${cap(name)}ById.validation.js`]: `\
import Joi from 'joi'

export const get${cap(name)}ByIdSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().required().messages({ 'any.required': '${cap(name)} ID is required' }),
  }).required(),
})
`,

  [`delete${cap(name)}.validation.js`]: `\
import Joi from 'joi'

export const delete${cap(name)}Schema = Joi.object({
  params: Joi.object({
    id: Joi.string().required().messages({ 'any.required': '${cap(name)} ID is required' }),
  }).required(),
})
`,
})
