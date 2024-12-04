class SideDetailService {
  store: any
  constructor(store: any) {
    this.store = store
  }
  setToggle(toggle: boolean) {
    this.store.dispatch('setSideDetail', toggle)
  }
  setData(data: any, isFolder: boolean = false) {
    if (isFolder) {
      this.store.dispatch('setSideDetailFolderID', data)
    } else {
      this.store.dispatch('setSideDetailFileID', data)
    }
  }
  setIsFolder(isFolder: boolean) {
    this.store.dispatch('setSideDetailIsFolder', isFolder)
  }
  actionSideDetail(toggle: boolean, data: any, isFolder: boolean = false) {
    this.setToggle(toggle)
    this.setData(data, isFolder)
    this.setIsFolder(isFolder)
  }
  actionUpdateDataAndFolder(data: any, isFolder: boolean = false) {
    this.setData(data, isFolder)
    this.setIsFolder(isFolder)
  }
}
export default SideDetailService
