import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  // 프로젝트 루트 경로에서 현재 모드에 맞는 .env 파일 로드
  const env = loadEnv(mode, '.', '')

  return {
    plugins: [react(), tailwindcss()],

    build: {
      // 1. 빌드 결과물이 저장될 경로 설정 (상대 경로 주의)
      // '../backend' 부분은 실제 백엔드 프로젝트 폴더명으로 수정해야 합니다.
      outDir: '../backend/src/main/resources/static',

      // 2. 빌드 시 기존 폴더(static) 내용을 비울지 여부
      emptyOutDir: true,
    },

    server: {
      host: '0.0.0.0', // 외부 네트워크에서 IP로 접속 허용
      proxy: {
        // '/api'로 시작하는 요청이 오면 target으로 보냄
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
