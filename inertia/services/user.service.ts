import sysService from './sys.service'

const API_URL = '/api/users'

class UserService {
  id = 0
  role_id = 0
  full_name = ''
  username = ''
  email = ''
  expired = 0
  onprogress = false
  password = ''
  is_active = 0
  created_at = ''
  remember_me_token = ''
  updated_at = ''
  constructor(
    id = 0,
    role_id = 0,
    full_name = '',
    username = '',
    email = '',
    expired = 0,
    onprogress = false,
    password = '',
    is_active = 0,
    created_at = '',
    remember_me_token = '',
    updated_at = ''
  ) {
    this.id = id
    this.role_id = role_id
    this.full_name = full_name
    this.username = username
    this.email = email
    this.expired = expired
    this.onprogress = onprogress
    this.password = password
    this.is_active = is_active
    this.created_at = created_at
    this.remember_me_token = remember_me_token
    this.updated_at = updated_at
  }
  data() {
    return {
      id: this.id,
      role_id: this.role_id,
      full_name: this.full_name,
      username: this.username,
      email: this.email,
      expired: this.expired,
      onprogress: this.onprogress,
      password: this.password,
      is_active: this.is_active,
      created_at: this.created_at,
      remember_me_token: this.remember_me_token,
      updated_at: this.updated_at,
    }
  }
  async login() {
    return await sysService.serviceGuest('POST', API_URL + '/auth/login', this.data())
  }

  async showUserBatch(ids: any) {
    return await sysService.serviceAuth('GET', API_URL + '/showUserBatch?ids=' + ids)
  }
}

export default new UserService()
