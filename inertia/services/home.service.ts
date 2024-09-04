import sysService from './sys.service'

const API_URL = '/api/home'

class HomeService {
  async homeData() {
    return await sysService.serviceAuth('GET', API_URL)
  }
}

export default new HomeService()
