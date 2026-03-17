export const permissionTemplate = (name) => {
  const upper = name.toUpperCase()
  const lower = name.toLowerCase()

  return `export const ${upper}_PERMISSIONS = {
  READ:   '${lower}s:read',
  CREATE: '${lower}s:create',
  UPDATE: '${lower}s:update',
  DELETE: '${lower}s:delete',
}
`
}
