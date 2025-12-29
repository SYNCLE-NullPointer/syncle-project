export const createBoardSlice = (set) => ({
  // UI 상태
  isSettingsOpen: false, // 우측 설정 사이드바
  settingsView: 'MENU', // 사이드바 내 현재 화면
  isShareOpen: false, // 공유 모달

  //  필터 상태
  filter: {
    keyword: '',
    memberIds: [], // 선택된 멤버 ID 목록
    labels: [], // 선택된 라벨 (이름) 목록
    priorities: [], // 선택된 우선순위 목록
    dueDates: [], // 선택된 마감일 옵션
    sortBy: 'manual', // 정렬 기준
  },

  // 설정 사이드바 토글 (기본)
  toggleSettings: () =>
    set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),

  // 특정 화면으로 설정 사이드바 열기
  openSettings: (viewName = 'MENU') =>
    set({ isSettingsOpen: true, settingsView: viewName }),

  // 사이드바 내부에서 화면 전환
  setSettingsView: (viewName) => set({ settingsView: viewName }),

  // 보드 공유 모달 토글
  toggleShare: () => set((state) => ({ isShareOpen: !state.isShareOpen })),

  // 보드 데이터 초기화 (페이지 나갈 때 사용)
  resetBoard: () =>
    set({
      isSettingsOpen: false,
      settingsView: 'MENU',
      isShareOpen: false,
      filter: {
        keyword: '',
        memberIds: [],
        labels: [],
        priorities: [],
        dueDates: [],
        sortBy: 'manual',
      },
    }),

  // 필터 업데이트 액션
  setFilter: (newFilter) =>
    set((state) => ({
      filter: { ...state.filter, ...newFilter },
    })),

  // 필터 초기화 액션
  resetFilter: () =>
    set((state) => ({
      filter: {
        ...state.filter,
        keyword: '',
        memberIds: [],
        labels: [],
        priorities: [],
        dueDates: [],
        sortBy: 'manual',
      },
    })),
})
