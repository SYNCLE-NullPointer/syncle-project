import React, { useState, useRef, useEffect } from 'react'
import CreateBoardMenu from '../modals/CreateBoardMenu'

function CreateBoardButton() {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef(null) // 버튼과 팝업 전체를 감쌀 div

  // "바깥 클릭"을 감지해서 팝업을 닫는 로직
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [wrapperRef])

  return (
    <div ref={wrapperRef} className="relative">
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex h-42 cursor-pointer items-center justify-center rounded-lg bg-gray-100 text-sm font-medium hover:bg-gray-200`}
      >
        + 보드 추가하기
      </div>

      {/* 3. isOpen이 true일 때만 팝업을 렌더링 (조건부 렌더링)
         CreateBoardMenu는 여기서 onClose 함수만 받습니다.
      */}
      {isOpen && <CreateBoardMenu onClose={() => setIsOpen(false)} />}
    </div>
  )
}

export default CreateBoardButton
