import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'light', // 기본값
      // 테마 토글 함수
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light'
          // 상태 변경과 동시에 HTML 클래스 제어
          if (newTheme === 'dark') {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
          return { theme: newTheme }
        }),
      // 초기화 (새로고침 시 실행용)
      initTheme: () => {
        // localStorage에 저장된 값을 읽어서 즉시 적용
        const storage = localStorage.getItem('theme-storage')
        if (storage) {
          const { state } = JSON.parse(storage)
          if (state.theme === 'dark') {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        }
      },
    }),
    {
      name: 'theme-storage', // localStorage 키 이름
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export default useThemeStore
