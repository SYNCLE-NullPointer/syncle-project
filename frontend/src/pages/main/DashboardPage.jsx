import React from 'react'
import BoardCard from '../../components/common/BoardCard'
import CreateBoardButton from '../../components/common/CreateBoardButton'

function DashboardPage() {
  return (
    <main className="flex-1 overflow-y-auto bg-white p-8">
      {/* ---------------- 최근 본 보드 ---------------- */}
      <div className="mx-auto max-w-5xl">
        <section className="mb-10">
          <h2 className="mb-3 text-lg font-semibold">최근에 본 목록</h2>

          <div className="grid grid-cols-4 gap-4">
            <BoardCard
              imageUrl="https://picsum.photos/400/200"
              title="default board"
            />
            <BoardCard imageUrl="https://picsum.photos/400/200" title="test" />
            <BoardCard imageUrl="https://picsum.photos/400/200" title="asdfw" />
            <BoardCard
              imageUrl="https://picsum.photos/400/200"
              title="A Team"
            />
          </div>
        </section>

        {/* ---------------- 각 팀별 보드 ---------------- */}
        <section className="space-y-10">
          {/* default */}
          <div>
            <div className="grid grid-cols-4 gap-4">
              <BoardCard
                imageUrl="https://picsum.photos/400/200"
                title="test"
              />
              <BoardCard
                imageUrl="https://picsum.photos/400/200"
                title="default board"
              />
              <CreateBoardButton />
            </div>
          </div>

          {/* Team A */}
          <div>
            <div className="grid grid-cols-4 gap-4">
              <BoardCard
                imageUrl="https://picsum.photos/400/200"
                title="A Team"
              />

              <CreateBoardButton />
            </div>
          </div>

          {/* Team B */}
          <div>
            <div className="grid grid-cols-4 gap-4">
              <BoardCard
                imageUrl="https://picsum.photos/400/200"
                title="fsdsf"
              />

              <CreateBoardButton />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default DashboardPage
