import axios from 'axios'

class SysService {
  async serviceAuth(methods = 'GET', url = '', data = {}) {
    return axios({
      url: url,
      method: methods,
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return error.response.data
      })
  }

  async serviceGuest(methods = 'GET', url = '', data = {}) {
    return axios({
      url: url,
      method: methods,
      data: data,
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return error.response.data
      })
  }

  async fileTypeIcons() {
    return {
      'pdf': 'ph:file-pdf-fill',
      'doc': 'ph:microsoft-word-logo-fill',
      'docx': 'ph:microsoft-word-logo-fill',
      'xls': 'ph:microsoft-excel-logo-fill',
      'xlsx': 'ph:microsoft-excel-logo-fill',
      'ppt': 'ph:microsoft-powerpoint-logo-fill',
      'pptx': 'ph:microsoft-powerpoint-logo-fill',
      'png': 'ph:image-fill',
      'jpg': 'ph:image-fill',
      'jpeg': 'ph:image-fill',
      'webp': 'ph:image-fill',
      'svg': 'ph:image-fill',
      'mp4': 'ph:video-fill',
      'webm': 'ph:video-fill',
      'ogv': 'ph:video-fill',
      'mp3': 'ph:file-audio-fill',
      'ogg': 'ph:file-audio-fill',
      'weba': 'ph:file-audio-fill',
      'zip': 'solar:winrar-broken',
      'rar': 'solar:winrar-broken',
      'txt': 'ph:file-text-fill',
      'csv': 'ph:file-csv-fill',
      'exe': 'ph:file-code-fill',
      'heic': 'ph:image-fill',
      'default': 'ph:file-fill',
      'sql': 'ph:database-fill',
      'ico': 'ph:image-fill',
      '7z': 'ph:zip-fill',
      'iso': 'ph:disc-fill',
      'ini': 'ph:file-ini-fill',
      'log': 'ph:file-text-fill',
    }
  }
  async fileTypeColor() {
    return {
      'pdf': 'text-red-500',
      'doc': 'text-blue-500',
      'docx': 'text-blue-500',
      'xls': 'text-green-500',
      'xlsx': 'text-green-500',
      'ppt': 'text-orange-500',
      'pptx': 'text-orange-500',
      'png': 'text-blue-500',
      'jpg': 'text-blue-500',
      'jpeg': 'text-blue-500',
      'webp': 'text-blue-500',
      'svg': 'text-blue-500',
      'mp4': 'text-red-500',
      'webm': 'text-red-500',
      'ogv': 'text-red-500',
      'mp3': 'text-yellow-500',
      'ogg': 'text-yellow-500',
      'weba': 'text-yellow-500',
      'webp': 'text-blue-500',
      'webm': 'text-red-500',
      'mp4': 'text-red-500',
      'zip': 'text-red-500',
      'rar': 'text-red-500',
      'txt': 'text-gray-500',
      'csv': 'text-green-500',
      'exe': 'text-blue-500',
      'heic': 'text-blue-500',
      'default': 'text-orange-400 dark:text-blue-600',
      'sql': 'text-blue-500',
      'ico': 'text-blue-500',
      '7z': 'text-red-500',
      'iso': 'text-red-500',
      'ini': 'text-blue-500',
      'log': 'text-blue-500',
    }
  }
}

export default new SysService()
