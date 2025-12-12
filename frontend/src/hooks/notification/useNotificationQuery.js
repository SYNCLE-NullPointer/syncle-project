import { useQuery } from '@tanstack/react-query'
import { notificationApi } from '../../api/notification.api'

export const useNotificationQuery = () => {
  // 전체 알림 목록 조회
  const {
    data: notifications = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await notificationApi.getMyNotifications()
      return res.data.data || []
    },
    refetchOnWindowFocus: true,
  })

  // 읽지 않은 알림 개수
  const unreadCount = notifications.filter((n) => !n.isRead).length

  return {
    notifications,
    unreadCount,
    isLoading,
    isError,
  }
}
