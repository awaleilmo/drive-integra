import sysService from '~/services/sys.service'

const API_URL = '/api/uploads'

class UploadService {
  id = 0
  user_id = 0
  folder_id = 0
  file = null
  file_name = ''
  file_path = ''
  description = ''
  is_starred = false
  opened_at = ''
  opened_by = 0
  created_at = ''
  created_by = 0
  updated_at = ''
  updated_by = 0
  deleted_at = ''
  constructor(
    id = 0,
    user_id = 0,
    folder_id = 0,
    file = null,
    file_name = '',
    file_path = '',
    description = '',
    is_starred = false,
    opened_at = '',
    opened_by = 0,
    created_at = '',
    created_by = 0,
    updated_at = '',
    updated_by = 0,
    deleted_at = ''
  ) {
    this.id = id
    this.user_id = user_id
    this.folder_id = folder_id
    this.file = file
    this.file_name = file_name
    this.file_path = file_path
    this.description = description
    this.is_starred = is_starred
    this.opened_at = opened_at
    this.opened_by = opened_by
    this.created_at = created_at
    this.created_by = created_by
    this.updated_at = updated_at
    this.updated_by = updated_by
    this.deleted_at = deleted_at
  }
  data() {
    return {
      id: this.id,
      user_id: this.user_id,
      folder_id: this.folder_id,
      file: this.file,
      file_name: this.file_name,
      file_path: this.file_path,
      description: this.description,
      is_starred: this.is_starred,
      opened_at: this.opened_at,
      opened_by: this.opened_by,
      created_at: this.created_at,
      created_by: this.created_by,
      updated_at: this.updated_at,
      updated_by: this.updated_by,
      deleted_at: this.deleted_at,
    }
  }
  async getFile(
    folders: string | null = null,
    isTrashView: boolean = false,
    isAllUpdateView: boolean = false
  ) {
    return await sysService.serviceAuth(
      'GET',
      API_URL +
        '?folders=' +
        folders +
        '&isTrashView=' +
        isTrashView +
        '&isAllUpdateView=' +
        isAllUpdateView
    )
  }
  async Uploads(data: any) {
    return await sysService.serviceAuth('POST', API_URL, data, true)
  }
  async CountDuplicate(data: any) {
    return await sysService.serviceAuth('POST', API_URL + '/count', data)
  }
  async downloadFile(fileId: string) {
    return await sysService.serviceAuth(
      'GET',
      API_URL + '/download/' + fileId,
      {},
      false,
      [{ key: 'Content-Disposition', value: 'attachment' }],
      'blob'
    )
  }
  async renameFile(id: string, data: any) {
    return await sysService.serviceAuth('POST', API_URL + '/rename/' + id, data)
  }
  async deleteFile(id: string) {
    return await sysService.serviceAuth('DELETE', API_URL + '/delete/' + id)
  }
  async recoveryFile(id: string) {
    return await sysService.serviceAuth('POST', API_URL + '/recovery/' + id)
  }
  async opened(id: string) {
    return await sysService.serviceAuth('POST', API_URL + '/openedAt/' + id)
  }
  async getById(id: string) {
    return await sysService.serviceAuth('GET', API_URL + '/getById/' + id)
  }
}

export default new UploadService()
