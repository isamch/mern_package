const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

export const modelMongoTemplate = (name) => `\
import mongoose from 'mongoose'

const ${name}Schema = new mongoose.Schema({
  name: {
    type:     String,
    required: [true, 'Name is required'],
    trim:     true,
  },
}, {
  timestamps: true,
  versionKey: false,
})

const ${cap(name)} = mongoose.model('${cap(name)}', ${name}Schema)
export default ${cap(name)}
`
