import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { invitationApi } from '../api/InvitationApi'

// 상태별 뱃지 스타일
const statusStyles = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  ACCEPTED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  EXPIRED: 'bg-gray-100 text-gray-800',
}

// 상태별 한글 텍스트
const statusLabels = {
  PENDING: '대기 중',
  ACCEPTED: '수락됨',
  REJECTED: '거절됨',
  EXPIRED: '만료됨',
}

export default function TeamInvitationsPage() {
  const { teamId } = useParams()
  const [invitations, setInvitations] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState('ALL') // ALL, PENDING, ACCEPTED, REJECTED, EXPIRED

  // 초대 목록 조회
  const fetchInvitations = async () => {
    setIsLoading(true)
    try {
      const response = await invitationApi.getSentInvitations(teamId)
      setInvitations(response.data.data)
    } catch (error) {
      console.error('초대 목록 조회 실패:', error)
      alert('초대 목록을 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 초대 취소
  const handleCancel = async (invitationId) => {
    if (!confirm('초대를 취소하시겠습니까?')) return

    try {
      await invitationApi.cancelInvitation(invitationId)
      alert('초대가 취소되었습니다.')
      fetchInvitations() // 목록 새로고침
    } catch (error) {
      console.error('초대 취소 실패:', error)
      alert(error.response?.data?.message || '초대 취소에 실패했습니다.')
    }
  }

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // 필터링된 초대 목록
  const filteredInvitations =
    filter === 'ALL'
      ? invitations
      : invitations.filter((inv) => inv.status === filter)

  useEffect(() => {
    if (teamId) {
      fetchInvitations()
    }
  }, [teamId])

  return (
    <div className="mx-auto max-w-6xl p-6">
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">팀 초대 관리</h1>
        <p className="mt-1 text-sm text-gray-500">
          팀에 발송한 초대 목록을 확인하고 관리할 수 있습니다.
        </p>
      </div>

      {/* 필터 버튼 */}
      <div className="mb-6 flex gap-2">
        {['ALL', 'PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status === 'ALL' ? '전체' : statusLabels[status]}
            {status !== 'ALL' && (
              <span className="ml-2">
                ({invitations.filter((inv) => inv.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="py-12 text-center text-gray-500">불러오는 중...</div>
      )}

      {/* 초대 목록 */}
      {!isLoading && filteredInvitations.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 py-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="mt-3 text-gray-600">
            {filter === 'ALL'
              ? '아직 발송한 초대가 없습니다.'
              : `${statusLabels[filter]} 상태의 초대가 없습니다.`}
          </p>
        </div>
      )}

      {!isLoading && filteredInvitations.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  초대받은 사람
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  발송일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  응답일
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredInvitations.map((invitation) => (
                <tr key={invitation.id} className="hover:bg-gray-50">
                  {/* 초대받은 사람 */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {invitation.inviteeProfile_img ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={invitation.inviteeProfile_img}
                            alt=""
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                            {invitation.inviteeName?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {invitation.inviteeName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {invitation.inviteeEmail}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 상태 */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${statusStyles[invitation.status]}`}
                    >
                      {statusLabels[invitation.status]}
                    </span>
                  </td>

                  {/* 발송일 */}
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    {formatDate(invitation.createdAt)}
                  </td>

                  {/* 응답일 */}
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    {formatDate(invitation.respondedAt)}
                  </td>

                  {/* 작업 */}
                  <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                    {invitation.status === 'PENDING' && (
                      <button
                        onClick={() => handleCancel(invitation.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        취소
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
