class SideDetailService {
  store: any
  constructor(store: any) {
    this.store = store
  }
  setToggle(toggle: boolean) {
    this.store.dispatch('setSideDetail', toggle)
  }
  setData(data: any, isFolder: boolean = false) {
    this.store.dispatch('setSideDetailFolderID', isFolder ? data : null)
    this.store.dispatch('setSideDetailFileID', isFolder ? null : data)
  }
  clearDataID() {
    this.store.dispatch('setSideDetailFolderID', null)
    this.store.dispatch('setSideDetailFileID', null)
    this.setIsFolder(true)
    this.setSelectedLength(0)
  }
  setIsFolder(isFolder: boolean) {
    this.store.dispatch('setSideDetailIsFolder', isFolder)
  }
  setSelectedLength(length: number) {
    this.store.dispatch('setSideDetailSelectedLength', length)
  }
  setNameFolderDefault(data: any) {
    let name = data.length > 0 ? data[data.length - 1].name : 'Drive Saya'
    this.store.dispatch('setSideDetailSubFolder', name)
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
