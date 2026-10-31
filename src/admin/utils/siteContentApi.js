import adminApi from './adminApi.js'

export const siteContentApi = {
  read: (group, signal) => adminApi.get(`/site-content/all?group=${group}`, { signal }).then(response => response.data),
  save: (key, value, revision) => adminApi.put(`/site-content/${encodeURIComponent(key)}`, { value, revision }).then(response => response.data),
  reset: (key, revision) => adminApi.delete(`/site-content/${encodeURIComponent(key)}`, { data: { revision } }).then(response => response.data),
}
