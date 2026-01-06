import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { sendInquiry } from '../../api/support.api'
import { useToast } from '../../hooks/useToast'
import FormInput from '../../components/common/FormInput'
import FormButton from '../../components/common/FormButton'
import { MessageSquare } from 'lucide-react'

const INQUIRY_TYPES = [
  { value: 'ACCOUNT', label: '계정 관련' },
  { value: 'BUG', label: '버그 신고' },
  { value: 'USAGE', label: '이용 문의' },
  { value: 'OTHER', label: '기타' },
]

const SupportPage = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [formData, setFormData] = useState({
    type: 'ACCOUNT',
    title: '',
    content: '',
  })

  const { mutate, isPending } = useMutation({
    mutationFn: sendInquiry.sendInquiry,
    onSuccess: () => {
      showToast('문의가 성공적으로 발송되었습니다.', 'success')
      navigate('/') // 전송 후 홈으로 이동
    },
    onError: () => {
      showToast('문의 발송에 실패했습니다. 잠시 후 다시 시도해주세요.', 'error')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.content.trim()) {
      showToast('제목과 내용을 모두 입력해주세요.', 'warning')
      return
    }
    if (window.confirm('작성하신 내용으로 문의를 보내시겠습니까?')) {
      mutate(formData)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="animate-fade-in mx-auto w-full max-w-4xl space-y-6 p-6 pb-20">
      {/* 1. 페이지 헤더 (다른 설정 페이지와 통일) */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">문의하기</h1>
        <p className="mt-2 text-gray-500">
          서비스 이용 중 궁금한 점이나 건의사항을 남겨주세요.
        </p>
      </div>

      {/* 2. 컨텐츠 카드 (rounded-2xl, border-gray-300 적용) */}
      <div className="rounded-2xl border border-gray-300 bg-white p-6 shadow-sm">
        {/* 카드 내부 헤더 */}
        <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-gray-900">
          <MessageSquare size={20} className="text-gray-500" />
          문의 작성
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* 문의 유형 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              문의 유형
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {INQUIRY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* 제목 */}
          <FormInput
            label="제목"
            name="title"
            placeholder="제목을 입력하세요"
            value={formData.title}
            onChange={handleChange}
          />

          {/* 내용 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              문의 내용
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="h-64 w-full resize-none rounded-lg border border-gray-300 p-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="문의하실 내용을 자세히 적어주세요."
            />
          </div>

          {/* 버튼 영역 */}
          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              취소
            </button>
            <div className="w-32">
              <FormButton
                text={isPending ? '전송 중...' : '문의하기'}
                disabled={isPending}
                type="submit"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SupportPage
