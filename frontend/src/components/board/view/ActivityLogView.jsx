import React, { useEffect, useRef } from 'react'
import { ChevronLeft, Loader2, Activity } from 'lucide-react'
import ActivityLogItem from '../../../components/activity_log/ActivityLogItem'
import { useInfiniteBoardLogs } from '../../../hooks/useActivityQuery'

export default function ActivityLogView({ boardId }) {
  // 커스텀 훅 사용
  const {
    data: groupedLogs, // 이미 날짜별로 그룹화된 데이터가 나옴
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteBoardLogs(boardId)

  // 1. 스크롤이 생기는 컨테이너를 잡기 위한 ref 생성
  const scrollContainerRef = useRef(null)

  // 무한 스크롤 트리거
  const observerRef = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          console.log('>>> 스크롤 바닥 감지! 데이터 요청 <<<')
          fetchNextPage()
        }
      },
      {
        root: scrollContainerRef.current,
        threshold: 0.5,
      },
    )

    if (observerRef.current) observer.observe(observerRef.current)

    return () => observer.disconnect()
  }, [hasNextPage, fetchNextPage])

  return (
    <div className="mt-2 flex min-h-0 flex-1 flex-col bg-white">
      {/* 2. 로그 리스트 */}
      <div
        ref={scrollContainerRef}
        className="scrollbar-thin min-h-0 overflow-y-auto"
      >
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="animate-spin text-blue-500" />
          </div>
        ) : isError ? (
          <div className="p-4 text-center text-sm text-red-500">
            로그를 불러오는데 실패했습니다.
          </div>
        ) : !groupedLogs || groupedLogs.length === 0 ? (
          <div className="flex h-60 flex-col items-center justify-center gap-3 text-gray-400">
            <Activity size={40} strokeWidth={1.5} className="opacity-40" />
            <p className="text-sm">아직 기록된 활동이 없습니다.</p>
          </div>
        ) : (
          <div className="flex flex-col pb-2">
            {/* 그룹화된 데이터 렌더링 */}
            {groupedLogs?.map(({ date, logs }) => (
              <div key={date}>
                {/* 날짜 구분선 */}
                <div className="sticky top-0 z-10 border-b border-gray-100 bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-500">
                  {date}
                </div>

                {/* 로그 아이템들 */}
                <div>
                  {logs.map((log) => (
                    <ActivityLogItem key={log.id} log={log} variant="avatar" />
                  ))}
                </div>
              </div>
            ))}

            {/* 로딩 트리거 */}
            {(hasNextPage || isFetchingNextPage) && (
              <div
                ref={observerRef}
                className="flex h-10 items-center justify-center"
              >
                {isFetchingNextPage && (
                  <Loader2 className="animate-spin text-blue-500" />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
