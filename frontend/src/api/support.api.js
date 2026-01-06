import api from './AxiosInterceptor'

export const sendInquiry = {
  sendInquiry: (data) => api.post('/support/inquiry', data),
}
