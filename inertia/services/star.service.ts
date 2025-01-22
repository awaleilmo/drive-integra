import sysSystem from './sys.service'

const API_URL = '/api/star'

class StarService {
  async toggleFile(id = '') {
    return await sysSystem.serviceAuth('GET', API_URL + '/file/' + id)
  }

  async toggleFolder(id = '') {
    return await sysSystem.serviceAuth('GET', API_URL + '/folder/' + id)
  }
}

export default new StarService()
