import React, { useEffect, useRef } from 'react'
import { DateRange } from 'react-date-range'

export default function DateRangePickerModal({
  isOpen,
  onClose,
  range,
  setRange,
  onApply,
}) {
  const modalRef = useRef(null)

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose()
      }
    }

    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      <div
        ref={modalRef}
        className="animate-fade-in absolute top-full right-0 z-50 mt-2 rounded-xl border border-gray-300 bg-white shadow-xl"
      >
        <DateRange
          editableDateInputs={true}
          onChange={(item) => setRange([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={
            range || [
              {
                startDate: new Date(),
                endDate: new Date(),
                key: 'selection',
              },
            ]
          }
          rangeColors={['#3b82f6']}
        />

        {/* 버튼 영역 */}
        <div className="flex justify-end gap-2 border-t border-gray-200 p-3">
          <button
            onClick={() => {
              // 초기화: range를 null로 설정
              setRange(null)
              onApply(null)
              onClose()
            }}
            className="rounded-md px-3 py-1.5 text-xs font-medium text-blue-500 hover:cursor-pointer hover:bg-blue-200"
          >
            초기화
          </button>
          <button
            onClick={() => {
              onApply(range)
              onClose()
            }}
            className="rounded-md bg-blue-500 px-3 py-1.5 text-xs font-medium text-white hover:cursor-pointer hover:bg-blue-600"
          >
            적용
          </button>
        </div>
      </div>
    </>
  )
}
