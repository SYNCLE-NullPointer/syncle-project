import { useMutation, useQueryClient } from '@tanstack/react-query'
import { boardApi } from '../api/board.api'

export const useCardMutations = (boardId) => {
  const queryClient = useQueryClient()
  const queryKey = ['board', boardId]

  // 카드 이동
  const moveCardMutation = useMutation({
    mutationFn: ({ cardId, toListId, newIndex }) =>
      boardApi.moveCard(cardId, toListId, newIndex),
    onMutate: async ({ cardId, fromListId, toListId, newIndex }) => {
      await queryClient.cancelQueries({ queryKey })
      const previousBoard = queryClient.getQueryData(queryKey)

      queryClient.setQueryData(queryKey, (oldBoard) => {
        if (!oldBoard) return oldBoard
        const newColumns = { ...oldBoard.columns }
        const sourceList = { ...newColumns[fromListId] }
        const destList =
          fromListId === toListId ? sourceList : { ...newColumns[toListId] }

        sourceList.tasks = [...sourceList.tasks]
        destList.tasks =
          fromListId === toListId ? sourceList.tasks : [...destList.tasks]

        const cardIndex = sourceList.tasks.findIndex((t) => t.id === cardId)
        if (cardIndex === -1) return oldBoard

        const [movedCard] = sourceList.tasks.splice(cardIndex, 1)
        const updatedCard = { ...movedCard, listId: toListId }
        destList.tasks.splice(newIndex, 0, updatedCard)

        newColumns[fromListId] = sourceList
        newColumns[toListId] = destList
        return { ...oldBoard, columns: newColumns }
      })
      return { previousBoard }
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(queryKey, context.previousBoard)
      alert('카드 이동에 실패했습니다.')
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  // 카드 생성
  const addCardMutation = useMutation({
    mutationFn: ({ listId, title }) => boardApi.addCard(listId, title),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  })

  // 카드 수정
  const updateCardMutation = useMutation({
    mutationFn: ({ cardId, updates }) => boardApi.updateCard(cardId, updates),
    onMutate: async ({ cardId, listId, updates }) => {
      await queryClient.cancelQueries({ queryKey })
      const previousBoard = queryClient.getQueryData(queryKey)

      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old
        const newColumns = { ...old.columns }
        const column = { ...newColumns[listId] }
        column.tasks = column.tasks.map((task) =>
          task.id === cardId ? { ...task, ...updates } : task,
        )
        newColumns[listId] = column
        return { ...old, columns: newColumns }
      })
      return { previousBoard }
    },
    onError: (err, vars, ctx) =>
      queryClient.setQueryData(queryKey, ctx.previousBoard),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  return {
    moveCard: moveCardMutation.mutate,
    addCard: addCardMutation.mutate,
    updateCard: updateCardMutation.mutate,
  }
}
