class FolderPopupStore {
  store: any
  constructor(store: any) {
    this.store = store
  }
  reset() {
    this.store.dispatch('setFolderPopupShow', false)
    this.store.dispatch('setFolderPopupData', [])
    this.store.dispatch('setFolderPopupFolderId', null)
    this.store.dispatch('setFolderPopupTitle', '')
  }
  setData(show: boolean, data: any, folderId: any, title: any) {
    this.store.dispatch('setFolderPopupShow', show)
    this.store.dispatch('setFolderPopupData', data)
    this.store.dispatch('setFolderPopupFolderId', folderId)
    this.store.dispatch('setFolderPopupTitle', title)
  }
}

export default FolderPopupStore
