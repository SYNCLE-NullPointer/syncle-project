import { useMutation, useQueryClient } from '@tanstack/react-query'
import { invitationApi } from '../../api/invitation.api'
import { useToast } from '../useToast'

export const useInvitationMutations = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  // 팀 멤버 초대 (이메일 발송)
  const inviteToTeamMutation = useMutation({
    mutationFn: ({ teamId, ...data }) =>
      invitationApi.inviteToTeam(teamId, data),
    onSuccess: (res, { teamId }) => {
      queryClient.invalidateQueries({
        queryKey: ['invitations', 'team', Number(teamId)],
      })
      showToast('초대가 성공적으로 발송되었습니다.', 'success')
    },
    onError: (err) => alert(err.response?.data?.message || '초대 발송 실패'),
  })

  // 초대 취소
  const cancelInvitationMutation = useMutation({
    mutationFn: invitationApi.cancelInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] })
      showToast('초대가 취소되었습니다.', 'success')
    },
    onError: (err) => alert(err.response?.data?.message || '초대 취소 실패'),
  })

  // 초대 수락
  const acceptInvitationMutation = useMutation({
    mutationFn: invitationApi.acceptInvitation,
    onSuccess: () => {
      // 팀 목록 및 대시보드 데이터 갱신
      queryClient.invalidateQueries({ queryKey: ['teams'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      // 알림 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      showToast('초대를 수락했습니다.', 'success')
    },
    onError: (err) => alert(err.response?.data?.message || '초대 수락 실패'),
  })

  // 초대 거절
  const rejectInvitationMutation = useMutation({
    mutationFn: invitationApi.rejectInvitation,
    onSuccess: () => {
      // 알림 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      showToast('초대를 거절했습니다.', 'success')
    },
    onError: (err) => alert(err.response?.data?.message || '초대 거절 실패'),
  })

  return {
    inviteToTeam: inviteToTeamMutation.mutate,
    cancelInvitation: cancelInvitationMutation.mutate,
    acceptInvitation: acceptInvitationMutation.mutate,
    rejectInvitation: rejectInvitationMutation.mutate,
  }
}
