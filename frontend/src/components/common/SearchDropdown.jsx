// frontend/src/components/common/SearchDropdown.jsx
import React from 'react'

function SearchDropdown({ results, isSearching, onSelect }) {
  return (
    <div className="absolute top-full right-4 left-4 z-50 mt-2 max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl">
      {isSearching ? (
        <div className="p-4 text-center text-sm text-gray-500">검색 중...</div>
      ) : results.length > 0 ? (
        <ul className="py-2">
          {results.map((board) => (
            <li key={board.id}>
              <button
                onClick={() => onSelect(board.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
              >
                {/* 썸네일 대용 아이콘 */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-blue-100 font-bold text-blue-600">
                  {board.title.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-gray-800">
                    {board.title}
                  </div>
                  <div className="line-clamp-1 truncate text-xs text-gray-500">
                    {board.description || '설명 없음'}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-4 text-center text-sm text-gray-500">
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  )
}

export default SearchDropdown
