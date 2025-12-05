import React, { useState, useEffect } from 'react'
import useBoardStore from '../../stores/useBoardStore'
import {
  X,
  Check,
  AlignLeft,
  CheckSquare,
  MessageSquare,
  User,
  Tag,
  Clock,
  ArrowRight,
  Trash2,
  MoreHorizontal,
  Plus,
  Calendar,
} from 'lucide-react'

export default function CardDetailModal() {
  const {
    activeBoard,
    selectedCard,
    closeCardModal,
    moveCard,
    updateCard,
    // addComment,
    // deleteCard
  } = useBoardStore()

  // --- Local State ---
  const [description, setDescription] = useState('')
  const [isEditingDesc, setIsEditingDesc] = useState(false)
  const [commentText, setCommentText] = useState('')

  // 완료(체크) 버튼 상태
  const [isComplete, setIsComplete] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // [변경] Mock 데이터 삭제 -> 빈 배열로 초기화
  const [comments, setComments] = useState([])
  const [checklists, setChecklists] = useState([])

  // 체크리스트 항목 추가용 입력 State
  const [checklistInput, setChecklistInput] = useState('')

  useEffect(() => {
    if (selectedCard) {
      setDescription(selectedCard.description || '')
    }
  }, [selectedCard])

  if (!selectedCard || !activeBoard) return null

  const currentListId = selectedCard.listId
  const currentColumn = activeBoard.columns[currentListId]
  const allColumns = activeBoard.columns
    ? Object.values(activeBoard.columns)
    : []

  // --- Handlers ---

  const handleSaveDescription = () => {
    setIsEditingDesc(false)
    updateCard(selectedCard.id, currentListId, { description })
  }

  const handleAddComment = (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    const newComment = {
      id: Date.now(),
      user: 'Me', // 현재 로그인한 사용자 정보
      text: commentText,
      createdAt: new Date().toISOString(),
    }
    setComments([...comments, newComment])
    setCommentText('')
  }

  // 새 체크리스트 생성 핸들러 (우측 버튼 클릭 시 동작)
  const handleAddChecklist = () => {
    const newChecklist = {
      id: Date.now(),
      title: '체크리스트', // 기본 제목
      items: [],
    }
    setChecklists([...checklists, newChecklist])
  }

  const toggleCheckItem = (listId, itemId) => {
    setChecklists((prev) =>
      prev.map((list) => {
        if (list.id !== listId) return list
        return {
          ...list,
          items: list.items.map((item) =>
            item.id === itemId ? { ...item, done: !item.done } : item,
          ),
        }
      }),
    )
  }

  const handleAddCheckItem = (e, listId) => {
    e.preventDefault()
    // 현재는 단일 input state(checklistInput)를 쓰므로
    // 입력된 값이 있을 때만 해당 listId에 추가
    if (!checklistInput.trim()) return

    setChecklists((prev) =>
      prev.map((list) => {
        if (list.id !== listId) return list
        return {
          ...list,
          items: [
            ...list.items,
            { id: Date.now(), text: checklistInput, done: false },
          ],
        }
      }),
    )
    setChecklistInput('')
  }

  const handleMoveCard = (e) => {
    const newColId = Number(e.target.value) || e.target.value
    if (newColId && newColId !== currentListId) {
      const targetColumn = activeBoard.columns[newColId]
      const newIndex = targetColumn.tasks ? targetColumn.tasks.length : 0
      moveCard(selectedCard.id, currentListId, newColId, newIndex)
    }
  }

  const toggleComplete = () => {
    setIsComplete((prev) => !prev)
    setIsAnimating(true)
    setTimeout(() => {
      setIsAnimating(false)
    }, 300)
  }

  const calculateProgress = (items) => {
    if (!items || items.length === 0) return 0
    const doneCount = items.filter((i) => i.done).length
    return Math.round((doneCount / items.length) * 100)
  }

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm duration-200">
      <div
        className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- Header --- */}
        <div className="flex shrink-0 items-start justify-between border-b border-gray-100 bg-white px-6 py-5">
          <div className="flex w-full gap-4 pr-10">
            <button
              onClick={toggleComplete}
              className={`flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-300 ease-out ${
                isComplete
                  ? 'border-green-500 bg-green-500 text-white shadow-md shadow-green-200'
                  : 'border-gray-300 bg-transparent text-transparent hover:border-gray-400 hover:bg-gray-50'
              } ${isAnimating ? 'scale-125' : 'scale-100'} `}
              title={isComplete ? '완료 취소' : '완료 표시'}
            >
              <Check
                size={18}
                strokeWidth={3}
                className={`transition-all duration-300 ${
                  isComplete ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                }`}
              />
            </button>

            <div className="w-full pt-0.5">
              <h2
                className={`mb-1 text-xl leading-tight font-bold text-gray-900 transition-all duration-300 ${
                  isComplete ? 'text-gray-400 line-through' : ''
                }`}
              >
                {selectedCard.title}
              </h2>
              <p className="flex items-center gap-1 text-sm text-gray-500">
                <span className="font-semibold text-gray-700 underline decoration-gray-300 underline-offset-4">
                  {currentColumn?.title}
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={closeCardModal}
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* --- Body (Scrollable) --- */}
        <div className="flex-1 overflow-y-auto bg-white p-6 md:p-8">
          <div className="flex flex-col gap-10 md:flex-row">
            {/* [Left Column] Main Content */}
            <div className="flex-1 space-y-8">
              {/* Description */}
              <section>
                <div className="mb-3 flex items-center gap-3">
                  <AlignLeft size={20} className="text-gray-600" />
                  <h3 className="text-base font-semibold text-gray-800">
                    Description
                  </h3>
                </div>
                <div className="pl-8">
                  {isEditingDesc ? (
                    <div className="space-y-2">
                      <textarea
                        className="min-h-[120px] w-full resize-none rounded-xl border border-gray-200 p-3 text-sm text-gray-700 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                        placeholder="상세 설명을 입력하세요..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveDescription}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                        >
                          저장
                        </button>
                        <button
                          onClick={() => setIsEditingDesc(false)}
                          className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => setIsEditingDesc(true)}
                      className={`min-h-20 cursor-pointer rounded-xl p-4 transition-colors ${
                        description
                          ? 'bg-transparent hover:bg-gray-50'
                          : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {description ||
                          '이 카드에 대한 상세 설명을 추가하려면 클릭하세요...'}
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Checklist (비어있으면 안 보임, 추가 버튼으로 생성) */}
              {checklists.map((list) => {
                const progress = calculateProgress(list.items)
                return (
                  <section
                    key={list.id}
                    className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckSquare size={20} className="text-gray-600" />
                        <h3 className="text-base font-semibold text-gray-800">
                          {list.title}
                        </h3>
                      </div>
                      <button className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-200">
                        Delete
                      </button>
                    </div>

                    <div className="pl-8">
                      {/* Progress Bar */}
                      <div className="mb-4 flex items-center gap-3">
                        <span className="w-8 text-right text-xs font-bold text-gray-500">
                          {progress}%
                        </span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-blue-500 transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Items */}
                      <div className="mb-3 space-y-2">
                        {list.items.map((item) => (
                          <label
                            key={item.id}
                            className="group flex cursor-pointer items-center gap-3 rounded p-1 hover:bg-gray-50"
                          >
                            <input
                              type="checkbox"
                              checked={item.done}
                              onChange={() => toggleCheckItem(list.id, item.id)}
                              className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span
                              className={`text-sm transition-colors ${item.done ? 'text-gray-400 line-through' : 'text-gray-700 group-hover:text-gray-900'}`}
                            >
                              {item.text}
                            </span>
                          </label>
                        ))}
                      </div>

                      {/* Add Item Input */}
                      <form onSubmit={(e) => handleAddCheckItem(e, list.id)}>
                        <input
                          className="w-full rounded-lg border border-transparent bg-transparent px-3 py-2 text-sm transition-all outline-none placeholder:text-gray-400 hover:bg-gray-50 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
                          placeholder="항목 추가..."
                          // 주의: 실제 구현 시 여러 리스트에 대한 input state 관리가 필요함.
                          // 현재는 편의상 하나의 input state를 공유하여, 마지막으로 타이핑한 곳에 들어감.
                          value={checklistInput}
                          onChange={(e) => setChecklistInput(e.target.value)}
                        />
                      </form>
                    </div>
                  </section>
                )
              })}

              {/* Activity / Comments */}
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare size={20} className="text-gray-600" />
                    <h3 className="text-base font-semibold text-gray-800">
                      Activity
                    </h3>
                  </div>
                </div>

                <div className="space-y-6 pl-8">
                  {/* Comment Input */}
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                      ME
                    </div>
                    <div className="relative flex-1">
                      <textarea
                        className="min-h-[50px] w-full resize-none overflow-hidden rounded-xl border border-gray-200 p-3 pr-16 text-sm shadow-sm transition-shadow outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="댓글을 작성하세요..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        rows={commentText ? 3 : 1}
                      />
                      {commentText && (
                        <button
                          onClick={handleAddComment}
                          className="absolute right-3 bottom-3 rounded bg-blue-600 px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-blue-700"
                        >
                          Save
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Comment List */}
                  {comments.length > 0 && (
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className="group flex gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600">
                            {comment.user[0]}
                          </div>
                          <div className="flex-1">
                            <div className="mb-1 flex items-baseline gap-2">
                              <span className="text-sm font-bold text-gray-900">
                                {comment.user}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(comment.createdAt).toLocaleTimeString(
                                  [],
                                  { hour: '2-digit', minute: '2-digit' },
                                )}
                              </span>
                            </div>
                            <div className="rounded-lg border border-transparent bg-white p-2 text-sm text-gray-700 transition-all group-hover:border-gray-100 group-hover:shadow-sm">
                              {comment.text}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Sidebar Actions */}
            <div className="w-full shrink-0 space-y-6 md:w-60">
              {/* Properties */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="mb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">
                    Properties
                  </h4>
                  <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100">
                    <User size={16} className="text-gray-400" />
                    <span className="text-gray-500">Assignee</span>
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100">
                    <Tag size={16} className="text-gray-400" />
                    <span className="text-gray-500">Labels</span>
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-gray-500">Dates</span>
                  </button>
                </div>
              </div>

              {/* Add to card Section */}
              <div className="space-y-2">
                <h4 className="mb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">
                  Add to card
                </h4>
                {/* Checklist 추가 버튼 */}
                <button
                  onClick={handleAddChecklist}
                  className="flex w-full items-center gap-2 rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  <CheckSquare size={14} />
                  <span>Checklist</span>
                </button>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <h4 className="mb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">
                  Actions
                </h4>

                <div className="group relative">
                  <div className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-gray-500">
                    <ArrowRight size={14} />
                  </div>
                  <select
                    className="w-full cursor-pointer appearance-none rounded-md bg-gray-100 py-1.5 pr-2 pl-8 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={currentListId}
                    onChange={handleMoveCard}
                  >
                    {allColumns.map((col) => (
                      <option key={col.id} value={col.id}>
                        Move to: {col.title}
                      </option>
                    ))}
                  </select>
                </div>

                <button className="flex w-full items-center gap-2 rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-red-50 hover:text-red-600">
                  <Trash2 size={14} />
                  <span>Archive</span>
                </button>

                <button className="flex w-full items-center gap-2 rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200">
                  <MoreHorizontal size={14} />
                  <span>More</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
