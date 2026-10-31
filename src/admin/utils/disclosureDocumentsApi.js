import adminApi from './adminApi.js'

const uploadBody = (file, fields) => {
  const form = new FormData()
  for (const [key, value] of Object.entries(fields)) form.append(key, String(value))
  form.append('pdf', file)
  return form
}
const uploadOptions = { headers: { 'Content-Type': undefined } }
export const disclosureDocumentsApi = {
  read: signal => adminApi.get('/disclosure-documents/all', { signal }).then(response => response.data),
  create: (title, file) => adminApi.post('/disclosure-documents', uploadBody(file, { title }), uploadOptions).then(response => response.data),
  replace: (key, revision, file) => adminApi.put(`/disclosure-documents/${key}`, uploadBody(file, { revision }), uploadOptions).then(response => response.data),
  restore: (key, revision, version) => adminApi.post(`/disclosure-documents/${key}/restore`, { revision, version }).then(response => response.data),
  update: (key, revision, fields) => adminApi.patch(`/disclosure-documents/${key}`, { ...fields, revision }).then(response => response.data),
  remove: (key, revision) => adminApi.delete(`/disclosure-documents/${key}`, { data: { revision } }).then(response => response.data),
}
