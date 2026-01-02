import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { teamApi } from '../../api/team.api'

// 공지사항 목록 조회 Hook
export const useTeamNotices = (teamId) => {
  return useQuery(
    ['teamNotices', teamId],
    () => teamApi.getTeamNotices(teamId).then((res) => res.data.data), // API 응답 구조에 맞게 처리
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  )
}

// 공지사항 생성 Hook
export const useCreateTeamNotice = (teamId) => {
  const queryClient = useQueryClient()
  return useMutation((data) => teamApi.createTeamNotice(teamId, data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['teamNotices', teamId])
    },
  })
}

// 공지사항 수정 Hook
export const useUpdateTeamNotice = (teamId) => {
  const queryClient = useQueryClient()
  return useMutation(
    ({ noticeId, data }) => teamApi.updateTeamNotice(teamId, noticeId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['teamNotices', teamId])
      },
    },
  )
}

// 공지사항 삭제 Hook
export const useDeleteTeamNotice = (teamId) => {
  const queryClient = useQueryClient()
  return useMutation((noticeId) => teamApi.deleteTeamNotice(teamId, noticeId), {
    onSuccess: () => {
      queryClient.invalidateQueries(['teamNotices', teamId])
    },
  })
}
