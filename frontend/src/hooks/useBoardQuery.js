import { useQuery } from '@tanstack/react-query'
import { boardApi } from '../api/board.api'

// 1. 데이터 변환 (Server Array -> Client Object Map)
// 백엔드: List<ListWithCardsResponse> -> 프론트: columns { id: { ... } }
const normalizeBoardData = (dto) => {
  if (!dto) {
    return null
  }

  const columns = {}
  const serverLists = dto.lists || []

  serverLists.forEach((list) => {
    columns[list.id] = {
      id: list.id,
      title: list.title,
      order: list.orderIndex,

      // 카드 매핑 (CardResponse -> UI Card Object)
      tasks: (list.cards || []).map((card) => ({
        id: card.id,
        listId: list.id, // 부모 리스트 ID 역참조 용
        title: card.title,
        description: card.description,
        order: card.orderIndex,
        dueDate: card.dueDate,
        // 댓글 수
        commentCount: card.commentCount || 0,

        // 백엔드에서 넘어온 ChecklistVo 리스트를 바로 매핑
        checklists: (card.checklists || []).map((cl) => ({
          id: cl.id,
          title: cl.title,
          done: cl.done,
        })),

        // 담당자 객체 (Assignee)
        assignee: card.assigneeId
          ? {
              id: card.assigneeId,
              name: card.assigneeName,
              profileImg: card.assigneeProfileImg,
            }
          : null,

        // 프론트 UI 전용 속성 (필요시)
        variant: 'solid',
      })),
    }
  })

  // 2. 멤버 매핑 (MemberResponse -> UI Member Object)
  const mapMember = (m) => ({
    id: m.userId, // ★ 중요: 백엔드(userId) -> 프론트(id)로 매핑
    name: m.nickname,
    email: m.email,
    profileImg: m.profileImg,
    role: m.role, // "OWNER", "MEMBER" 등 Enum String
    position: m.position,
  })

  // 3. 최종 보드 객체 반환
  return {
    ...dto,

    // 멤버 리스트 변환
    members: (dto.boardMembers || []).map(mapMember), // 보드 헤더 표시용
    teamMembers: (dto.teamMembers || []).map(mapMember), // 초대 모달 등 사용

    columns, // 변환된 컬럼 객체
    columnOrder: serverLists.map((l) => l.id), // 리스트 순서 배열 (필요시 사용)
  }
}

export const useBoardQuery = (boardId) => {
  return useQuery({
    queryKey: ['board', boardId], // 이 키가 캐시의 이름표가 됩니다.
    queryFn: async () => {
      const response = await boardApi.fetchBoard(boardId)
      return normalizeBoardData(response.data.data)
    },

    staleTime: 1000 * 60, // 1분 동안은 "신선한 데이터"로 취급 (API 재호출 안 함)
  })
}
