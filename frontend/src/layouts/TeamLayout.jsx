import React, { useEffect } from 'react'
import { Outlet, useParams, useNavigate } from 'react-router-dom'
import { useTeamSocket } from '../hooks/team/useTeamSocket' // (있다고 가정)
import { useTeamDetailQuery } from '../hooks/team/useTeamQuery'
import { useAuthQuery } from '../hooks/auth/useAuthQuery'

export default function TeamLayout() {
  const { teamId } = useParams()
  const navigate = useNavigate()

  // 소켓 연결 (기존 코드 유지)
  useTeamSocket(teamId)

  // 내 정보 & 팀 정보 가져오기
  const { data: user } = useAuthQuery()
  const { data: team, isLoading, error } = useTeamDetailQuery(teamId)

  // [보안] 멤버십 확인 로직
  useEffect(() => {
    // 로딩이 끝났고 데이터가 준비되었을 때 판별
    if (!isLoading && team && user) {
      const isMember = team.members?.some((member) => member.userId === user.id)

      if (!isMember) {
        alert('접근 권한이 없는 팀입니다.')
        navigate('/dashboard', { replace: true })
      }
    }

    // 팀이 아예 존재하지 않는 경우
    if (!isLoading && !team && error) {
      alert('존재하지 않는 팀입니다.')
      navigate('/dashboard', { replace: true })
    }
  }, [isLoading, team, user, error, navigate])

  // 로딩 중이거나 권한 확인 전에는 하위 페이지를 보여주지 않음
  if (isLoading || !team || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading Team...
      </div>
    )
  }

  // 권한이 확인된 경우에만 하위 페이지(Outlet) 렌더링
  return (
    <>
      <Outlet />
    </>
  )
}
