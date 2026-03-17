export const modelPgTemplate = (name) => `\
import { query } from '#config/database.pg.js'

export const ${name}Pg = {
  async findAll({ page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit
    const [rows, count] = await Promise.all([
      query('SELECT * FROM ${name}s ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]),
      query('SELECT COUNT(*) FROM ${name}s'),
    ])
    return { rows: rows.rows, total: parseInt(count.rows[0].count) }
  },

  async findById(id) {
    const result = await query('SELECT * FROM ${name}s WHERE id = $1', [id])
    return result.rows[0] ?? null
  },

  async create(fields) {
    const keys   = Object.keys(fields)
    const values = Object.values(fields)
    const cols   = keys.join(', ')
    const params = keys.map((_, i) => \`$\${i + 1}\`).join(', ')
    const result = await query(
      \`INSERT INTO ${name}s (\${cols}) VALUES (\${params}) RETURNING *\`,
      values
    )
    return result.rows[0]
  },

  async updateById(id, fields) {
    const sets = [], values = []
    let idx = 1
    for (const [key, val] of Object.entries(fields)) {
      sets.push(\`\${key} = $\${idx++}\`)
      values.push(val)
    }
    if (!sets.length) return null
    values.push(id)
    const result = await query(
      \`UPDATE ${name}s SET \${sets.join(', ')}, updated_at = NOW() WHERE id = $\${idx} RETURNING *\`,
      values
    )
    return result.rows[0] ?? null
  },

  async deleteById(id) {
    await query('DELETE FROM ${name}s WHERE id = $1', [id])
  },
}
`
