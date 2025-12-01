import { create } from 'zustand'
import api from '../api/AxiosInterceptor'

const useActivityStore = create((set, get) => ({
  // 1. 상태
  stats: { createdCards7: 0, completedTasks7: 0, comments7: 0 },
  topBoards: [],
  logs: [], // { date: "YYYY-MM-DD", logs: [...] }
  isLoading: false,

  // 필터 상태
  filter: {
    type: 'all',
    keyword: '',
    startDate: null,
    endDate: null,
  },

  // 2. 액션
  setFilter: (newFilter) =>
    set((state) => ({ filter: { ...state.filter, ...newFilter } })),

  // 초기화
  reset: () =>
    set({
      stats: { createdCards7: 0, completedTasks7: 0, comments7: 0 },
      topBoards: [],
      logs: [],
      filter: { type: 'all', keyword: '', startDate: null, endDate: null },
      error: null,
    }),

  // 3. 비동기 액션
  fetchActivityData: async () => {
    set({ isLoading: true, error: null })
    const { filter } = get()

    try {
      // 쿼리 파라미터 구성
      const params = {
        type: filter.type === 'all' ? null : filter.type,
        keyword: filter.keyword,
        startDate: filter.startDate,
        endDate: filter.endDate,
      }

      // 활동 내역 조회
      const [statsRes, topBoardsRes, logsRes] = await Promise.all([
        api.get('/users/me/activities/stats'),
        api.get('/users/me/activities/top-boards'),
        api.get('/users/me/activities', { params }),
      ])

      // 로그 데이터 날짜별로 그룹화
      const groupedLogs = groupLogsByDate(logsRes.data.data)

      set({
        stats: statsRes.data.data,
        topBoards: topBoardsRes.data.data,
        logs: groupedLogs,
      })
    } catch (error) {
      console.error('활동 내역 로드 실패:', error)
      set({ error: '활동 내역을 불러오지 못했습니다.' })
    } finally {
      set({ isLoading: false })
    }
  },
}))

// 날짜별 그룹화
const groupLogsByDate = (logs) => {
  if (!logs || logs.length === 0) return []

  // 날짜(YYYY-MM-DD)를 키로 하는 객체 생성
  // ex) groups : {'2024-11-25': [log1, log2], '2024-11-24': [log3]}
  const groups = logs.reduce((acc, log) => {
    const date = log.createdAt.split('T')[0] // "2024-11-25T..." -> "2024-11-25"
    // date가 키인 배열이 없으면 새로 생성
    if (!acc[date]) {
      acc[date] = []
    }

    // date 키 배열에 현재 log를 푸시
    acc[date].push(log)
    return acc
  }, {})

  // 객체를 배열로 변환하고 날짜 내림차순 정렬
  return Object.keys(groups)
    .sort((a, b) => new Date(b) - new Date(a))
    .map((date) => ({
      date,
      logs: groups[date],
    }))
}

export default useActivityStore
