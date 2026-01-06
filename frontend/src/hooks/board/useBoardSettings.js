import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { boardApi } from '../../api/board.api'

export const useBoardSettings = (boardId) => {
  const queryClient = useQueryClient()
  const queryKey = ['board-settings', Number(boardId)]

  // 1. 설정 정보 조회 (서버 데이터)
  const { data: settings, isLoading } = useQuery({
    queryKey,
    queryFn: () => boardApi.getBoardDetail(boardId),
    select: (response) => {
      const data = response.data.data
      return {
        invitation: data.invitationPermission,
        boardSharing: data.boardSharingPermission,
        listEdit: data.listEditPermission,
        cardDelete: data.cardDeletePermission,
      }
    },
    enabled: !!boardId, // boardId가 있을 때만 실행
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
  })

  // 2. 설정 변경 (Optimistic Update 적용)
  const { mutate: updateSettings } = useMutation({
    mutationFn: (newPermissions) =>
      boardApi.updateBoardPermissions(boardId, newPermissions),

    // 낙관적 업데이트 로직
    onMutate: async (newPermissions) => {
      // 1) 진행 중인 쿼리 취소 (덮어쓰기 방지)
      await queryClient.cancelQueries({ queryKey })

      // 2) 이전 데이터 스냅샷 저장 (롤백용)
      const previousBoardData = queryClient.getQueryData(queryKey)

      // 3) 캐시를 새 값으로 즉시 업데이트 (UI 반응성 향상)
      queryClient.setQueryData(queryKey, (oldData) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          invitationPermission: newPermissions.invitation,
          boardSharingPermission: newPermissions.boardSharing,
          listEditPermission: newPermissions.listEdit,
          cardDeletePermission: newPermissions.cardDelete,
        }
      })

      // 4) 컨텍스트 반환
      return { previousBoardData }
    },

    // 에러 발생 시 롤백
    onError: (err, newPermissions, context) => {
      if (context?.previousBoardData) {
        queryClient.setQueryData(queryKey, context.previousBoardData)
      }
      alert('권한 설정 저장에 실패했습니다.')
    },

    // 성공/실패 상관없이 최신 데이터로 동기화
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  return {
    settings,
    updateSettings,
    isLoading,
  }
}
