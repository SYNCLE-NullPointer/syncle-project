import { useMutation, useQueryClient } from '@tanstack/react-query'
import { boardApi } from '../api/board.api'

export const useMemberMutations = (boardId) => {
  const queryClient = useQueryClient()
  const queryKey = ['board', boardId]

  // 멤버 권한 변경
  const changeMemberRoleMutation = useMutation({
    mutationFn: ({ userId, newRole }) =>
      boardApi.changeMemberRole(boardId, userId, newRole),

    onMutate: async ({ userId, newRole }) => {
      // 1. 쿼리 취소
      await queryClient.cancelQueries({ queryKey })

      // 2. 이전 상태 저장
      const previousBoard = queryClient.getQueryData(queryKey)

      // 3. 낙관적 업데이트 (UI 즉시 반영)
      queryClient.setQueryData(queryKey, (old) => {
        if (!old || !old.members) return old

        // 해당 멤버를 찾아 role 변경
        const updatedMembers = old.members.map((member) =>
          member.id === userId ? { ...member, role: newRole } : member,
        )

        return { ...old, members: updatedMembers }
      })

      return { previousBoard }
    },

    onError: (err, vars, context) => {
      // 에러 시 롤백
      queryClient.setQueryData(queryKey, context.previousBoard)
      alert('권한 변경에 실패했습니다.')
    },

    onSettled: () => {
      // 서버 데이터 동기화
      queryClient.invalidateQueries({ queryKey })
    },
  })

  // 멤버 내보내기 (추방)
  const removeMemberMutation = useMutation({
    mutationFn: (userId) => boardApi.removeMember(boardId, userId),

    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey })
      const previousBoard = queryClient.getQueryData(queryKey)

      // 낙관적 업데이트
      queryClient.setQueryData(queryKey, (old) => {
        if (!old || !old.members) return old

        // 해당 멤버를 리스트에서 제거
        const filteredMembers = old.members.filter(
          (member) => member.id !== userId,
        )

        return { ...old, members: filteredMembers }
      })

      return { previousBoard }
    },

    onError: (err, vars, context) => {
      queryClient.setQueryData(queryKey, context.previousBoard)
      alert('멤버 추방에 실패했습니다.')
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  return {
    changeMemberRole: changeMemberRoleMutation.mutate,
    removeMember: removeMemberMutation.mutate,
  }
}
