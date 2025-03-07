import sysService from './sys.service'

const API_URL = '/api/folder'

class FolderService {
  id = 0
  parentId = null
  folderName = ''
  folderPath = ''
  isStarred = false
  openedAt = null
  openedBy = null
  createdAt = null
  createdBy = null
  updatedAt = null
  updatedBy = null
  constructor(
    id = 0,
    parentId = null,
    folderName = '',
    folderPath = '',
    isStarred = false,
    openedAt = null,
    openedBy = null,
    createdAt = null,
    createdBy = null,
    updatedAt = null,
    updatedBy = null
  ) {
    this.id = id
    this.parentId = parentId
    this.folderName = folderName
    this.folderPath = folderPath
    this.isStarred = isStarred
    this.openedAt = openedAt
    this.openedBy = openedBy
    this.createdAt = createdAt
    this.createdBy = createdBy
    this.updatedAt = updatedAt
    this.updatedBy = updatedBy
  }

  data() {
    return {
      id: this.id,
      parentId: this.parentId,
      folderName: this.folderName,
      folderPath: this.folderPath,
      isStarred: this.isStarred,
      openedAt: this.openedAt,
      openedBy: this.openedBy,
      createdAt: this.createdAt,
      createdBy: this.createdBy,
      updatedAt: this.updatedAt,
      updatedBy: this.updatedBy,
    }
  }

  async getFolder(folders: string | null = null, isTrashView: boolean = false) {
    return await sysService.serviceAuth(
      'GET',
      API_URL + '?folders=' + folders + '&isTrashView=' + isTrashView
    )
  }
  async addFolder() {
    return await sysService.serviceAuth('POST', API_URL + '/add', this.data())
  }
  async renameFolder(id: number, data: any) {
    return await sysService.serviceAuth('POST', API_URL + '/rename/' + id, data)
  }

  async deleteFolder(id: number) {
    return await sysService.serviceAuth('DELETE', API_URL + '/delete/' + id)
  }
  async recoveryFolder(id: number) {
    return await sysService.serviceAuth('POST', API_URL + '/recovery/' + id)
  }
  async opened(id: string) {
    return await sysService.serviceAuth('POST', API_URL + '/openedAt/' + id)
  }
  async getById(id: string) {
    return await sysService.serviceAuth('GET', API_URL + '/getById/' + id)
  }
  async moveFolder(data: any) {
    return await sysService.serviceAuth('POST', API_URL + '/move', data)
  }
  async sharedPost(id: string, data: any) {
    return await sysService.serviceAuth('POST', API_URL + '/shared/' + id, data)
  }
}

export default new FolderService()
