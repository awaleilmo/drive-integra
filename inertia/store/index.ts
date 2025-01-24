import { createStore } from 'vuex'

export default createStore({
  state: {
    isLoading: false,
    showToast: false,
    toastMessage: '',
    toastType: 'info',
    fileMultiple: [],
    onUpload: false,
    loadFile: false,
    sideDetail: false,
    sideDetailFileID: null,
    sideDetailFolderID: null,
    sideDetailIsFolder: false,
    sideDetailSelectedLength: 0,
    sideDetailSubFolder: 'Drive Saya',
    folderPopupShow: false,
    folderPopupData: [],
    folderPopupFolderId: null,
    folderPopupTitle: '',
    renameModal: {
      data: {},
      show: false,
      isFile: false,
    },
  },
  getters: {
    isLoading: (state: any) => state.isLoading,
    showToast: (state: any) => state.showToast,
    toastMessage: (state: any) => state.toastMessage,
    toastType: (state: any) => state.toastType,
    fileMultiple: (state: any) => state.fileMultiple,
    onUpload: (state: any) => state.onUpload,
    loadFile: (state: any) => state.loadFile,
    sideDetail: (state: any) => state.sideDetail,
    sideDetailFileID: (state: any) => state.sideDetailFileID,
    sideDetailFolderID: (state: any) => state.sideDetailFolderID,
    sideDetailIsFolder: (state: any) => state.sideDetailIsFolder,
    sideDetailSelectedLength: (state: any) => state.sideDetailSelectedLength,
    sideDetailSubFolder: (state: any) => state.sideDetailSubFolder,
    folderPopupShow: (state: any) => state.folderPopupShow,
    folderPopupData: (state: any) => state.folderPopupData,
    folderPopupFolderId: (state: any) => state.folderPopupFolderId,
    folderPopupTitle: (state: any) => state.folderPopupTitle,
    renameModal: (state: any) => state.renameModal,
    tabPanelTop: (state: any) => state.tabPanelTop,
  },
  mutations: {
    setLoading(state: any, status: any): void {
      state.isLoading = status
    },
    SET_FILE_MULTIPLE(state: any, files: any): void {
      state.fileMultiple = files
    },
    SET_TOAST(state: any, { message, type }: any): void {
      state.showToast = true
      state.toastMessage = message
      state.toastType = type || 'info'

      localStorage.setItem('showToast', String(true))
      localStorage.setItem('toastMessage', message)
      localStorage.setItem('toastType', type || 'info')
    },
    HIDE_TOAST(state: any): void {
      state.showToast = false
      state.toastMessage = ''
      state.toastType = 'info'

      localStorage.removeItem('showToast')
      localStorage.removeItem('toastMessage')
      localStorage.removeItem('toastType')
    },
    SET_ON_UPLOAD(state: any, status: boolean): void {
      state.onUpload = status
    },
    SET_LOAD_FILE(state: any, status: boolean): void {
      state.loadFile = status
    },
    SET_SIDE_DETAIL(state: any, status: boolean): void {
      state.sideDetail = status
    },
    SET_SIDE_DETAIL_FILE_ID(state: any, data: any): void {
      state.sideDetailFileID = data
    },
    SET_SIDE_DETAIL_FOLDER_ID(state: any, data: any): void {
      state.sideDetailFolderID = data
    },
    SET_SIDE_DETAIL_IS_FOLDER(state: any, status: boolean): void {
      state.sideDetailIsFolder = status
    },
    clearSideDetailID(state: any): void {
      state.sideDetailFileID = null
      state.sideDetailFolderID = null
    },
    SET_SIDE_DETAIL_SELECTED_LENGTH(state: any, length: number): void {
      state.sideDetailSelectedLength = length
    },
    SET_SIDE_DETAIL_SUB_FOLDER(state: any, subFolder: string): void {
      state.sideDetailSubFolder = subFolder
    },
    SET_FOLDER_POPUP_SHOW(state: any, show: boolean): void {
      state.folderPopupShow = show
    },
    SET_FOLDER_POPUP_DATA(state: any, data: any): void {
      state.folderPopupData = data
    },
    SET_FOLDER_POPUP_FOLDER_ID(state: any, folderId: any): void {
      state.folderPopupFolderId = folderId
    },
    SET_FOLDER_POPUP_TITLE(state: any, title: string): void {
      state.folderPopupTitle = title
    },
    SET_RENAME_MODAL_DATA(state: any, data: any): void {
      state.renameModal.data = data
    },
    SET_RENAME_MODAL_SHOW(state: any, show: boolean): void {
      state.renameModal.show = show
    },
    SET_RENAME_MODAL_IS_FILE(state: any, isFile: boolean): void {
      state.renameModal.isFile = isFile
    },
  },
  actions: {
    showLoading({ commit }: any): void {
      commit('setLoading', true)
    },
    setFileMultiple({ commit }: any, files: any): void {
      commit('SET_FILE_MULTIPLE', files)
    },
    hideLoading({ commit }: any): void {
      commit('setLoading', false)
    },
    triggerToast({ commit }: any, { message, type }: any): void {
      commit('SET_TOAST', { message, type })
    },
    hideToast({ commit }: any): void {
      commit('HIDE_TOAST')
    },
    setOnUpload({ commit }: any, status: boolean): void {
      commit('SET_ON_UPLOAD', status)
    },
    setLoadFile({ commit }: any, status: boolean): void {
      commit('SET_LOAD_FILE', status)
    },
    setSideDetail({ commit }: any, status: boolean): void {
      commit('SET_SIDE_DETAIL', status)
    },
    setSideDetailFileID({ commit }: any, data: any): void {
      // commit('clearSideDetailID')
      commit('SET_SIDE_DETAIL_FILE_ID', data)
    },
    setSideDetailFolderID({ commit }: any, data: any): void {
      // commit('clearSideDetailID')
      commit('SET_SIDE_DETAIL_FOLDER_ID', data)
    },
    setSideDetailIsFolder({ commit }: any, status: boolean): void {
      commit('SET_SIDE_DETAIL_IS_FOLDER', status)
    },
    setSideDetailSelectedLength({ commit }: any, length: number): void {
      commit('SET_SIDE_DETAIL_SELECTED_LENGTH', length)
    },
    setSideDetailSubFolder({ commit }: any, subFolder: string): void {
      commit('SET_SIDE_DETAIL_SUB_FOLDER', subFolder)
    },
    setFolderPopupShow({ commit }: any, show: boolean): void {
      commit('SET_FOLDER_POPUP_SHOW', show)
    },
    setFolderPopupData({ commit }: any, data: any): void {
      commit('SET_FOLDER_POPUP_DATA', data)
    },
    setFolderPopupFolderId({ commit }: any, folderId: any): void {
      commit('SET_FOLDER_POPUP_FOLDER_ID', folderId)
    },
    setFolderPopupTitle({ commit }: any, title: string): void {
      commit('SET_FOLDER_POPUP_TITLE', title)
    },
    setRenameModalData({ commit }: any, data: any): void {
      commit('SET_RENAME_MODAL_DATA', data)
    },
    setRenameModalShow({ commit }: any, show: boolean): void {
      commit('SET_RENAME_MODAL_SHOW', show)
    },
    setRenameModalIsFile({ commit }: any, isFile: boolean): void {
      commit('SET_RENAME_MODAL_IS_FILE', isFile)
    },
  },
})
