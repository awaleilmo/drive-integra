import axios from "axios";

class sysService {  
    async serviceAuth(methods='GET', url='', data= {}) {
        return axios({
          url: url,
          method: methods,
          data: data,
          headers: {
            'Accept': 'application/json'
          }
        })
          .then(response => {
            return response.data
          })
          .catch(error => {
            return error.response.data
          })
      }
    
      async serviceGuest(methods='GET', url='', data= {}) {
        return axios({
          url: url,
          method: methods,
          data: data
        })
          .then(response => {
            return response.data
          })
          .catch(error => {
            return error.response.data
          })
      }
}

export default new sysService()