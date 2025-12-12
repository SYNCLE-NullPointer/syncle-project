import api from './AxiosInterceptor'

export const notificationApi = {
  // 내 알림 목록 조회
  getMyNotifications: () => api.get('/notifications'),
  // 알림 전체 읽음 처리
  markAllAsRead: () => api.patch('/notifications/read-all'),
  // 개별 알림 읽음 처리
  markAsRead: (notificationId) =>
    api.patch(`/notifications/${notificationId}/read`),
}
