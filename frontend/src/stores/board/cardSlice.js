const DONE_LIST_ID = 'virtual-done-list'

export const createCardSlice = (set) => ({
  selectedCard: null, // 현재 열린 카드 객체
  selectedCardId: null, // 선택된 카드 id
  selectedCardColumnId: null, // 현재 열린 카드가 속한 리스트 ID
  isCardActionsOpen: false, // 카드 상세 내 액션 메뉴 드롭다운

  // 카드 상세 모달 열기
  openCardModal: (card, columnId) =>
    set({
      selectedCard: card,
      selectedCardId: card.id,
      selectedCardColumnId: columnId,
      isCardActionsOpen: true,
    }),

  // 카드 상세 모달 닫기
  closeCardModal: () =>
    set({
      selectedCard: null,
      selectedCardId: null,
      selectedCardColumnId: null,
      isCardActionsOpen: false,
    }),

  toggleCardActions: () =>
    set((state) => ({ isCardActionsOpen: !state.isCardActionsOpen })),

  // id로 카드를 찾아서 선택
  setSelectedCardId: (cardId) => set({ selectedCardId: cardId }),

  // 보드 데이터와 카드 id를 받아서 해당 카드를 찾아 모달 열기
  findAndSelectCard: (board, cardId) => {
    if (!board || !board.columns || !cardId) return

    // 보드의 모든 컬럼을 순회하며 해당 id를 가진 카드 찾기
    const columns = board.columns
    for (const colId of Object.keys(columns)) {
      const column = columns[colId]
      const foundCard = column.tasks?.find((c) => c.id === Number(cardId))

      if (foundCard) {
        set({
          selectedCard: foundCard,
          selectedCardId: foundCard.id,
          selectedCardColumnId: colId,
          isCardActionsOpen: true,
        })
        console.log('카드 찾음:', foundCard)
        return
      }
    }
    // 못 찾았을 경우
    console.warn(`${cardId} 카드 존재하지 않음`)
  },
})
