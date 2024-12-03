class SideDetailService {
  constructor(store: any) {
    this.store = store
  }
  actionSideDetail(toggle: boolean, data: any, isFolder: boolean = false) {
    this.store.dispatch('setSideDetail', toggle)
    this.store.dispatch('setSideDetailData', data)
    this.store.dispatch('setSideDetailIsFolder', isFolder)
  }
}
export default SideDetailService
