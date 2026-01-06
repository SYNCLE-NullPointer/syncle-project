import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationApi } from '../../api/notification.api'

export const useNotificationMutations = () => {
  const queryClient = useQueryClient()
  const queryKey = ['notifications']

  // 개별 알림 읽음 처리
  const markAsReadMutation = useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: () => {
      // 최신 데이터로 갱신
      queryClient.invalidateQueries({ queryKey })
    },
    onError: (err) => {
      console.error('알림 읽음 처리 실패: ', err)
    },
  })

  // 전체 알림 읽음 처리
  const markAllAsReadMutation = useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: () => {
      // 최신 데이터로 갱신
      queryClient.invalidateQueries({ queryKey })
    },
    onError: (err) => {
      console.error('전체 알림 읽음 처리 실패: ', err)
    },
  })

  return {
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
  }
}
