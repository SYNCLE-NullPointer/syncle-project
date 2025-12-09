import { useMutation, useQueryClient } from '@tanstack/react-query'
import { boardApi } from '../api/board.api'

export const useListMutations = (boardId) => {
  const queryClient = useQueryClient()
  const queryKey = ['board', boardId]

  // 리스트 이동
  const moveListMutation = useMutation({
    mutationFn: ({ oldIndex, newIndex, currentOrder }) => {
      const newOrder = [...currentOrder]
      const [movedItem] = newOrder.splice(oldIndex, 1)
      newOrder.splice(newIndex, 0, movedItem)

      const payload = newOrder.map((id, index) => ({
        listId: id,
        orderIndex: index,
      }))
      return boardApi.moveList(boardId, payload)
    },
    onMutate: async ({ oldIndex, newIndex }) => {
      await queryClient.cancelQueries({ queryKey })
      const previousBoard = queryClient.getQueryData(queryKey)

      queryClient.setQueryData(queryKey, (oldBoard) => {
        if (!oldBoard) return oldBoard
        const newColumnOrder = [...oldBoard.columnOrder]
        const [movedListId] = newColumnOrder.splice(oldIndex, 1)
        newColumnOrder.splice(newIndex, 0, movedListId)
        return { ...oldBoard, columnOrder: newColumnOrder }
      })
      return { previousBoard }
    },
    onError: (err, vars, context) => {
      queryClient.setQueryData(queryKey, context.previousBoard)
      alert('리스트 이동 실패')
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  // 리스트 생성
  const addListMutation = useMutation({
    mutationFn: (title) => boardApi.addList(boardId, title),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  })

  // 리스트 이름 수정
  const updateListMutation = useMutation({
    mutationFn: ({ listId, title }) => boardApi.updateList(listId, title),
    onMutate: async ({ listId, title }) => {
      await queryClient.cancelQueries({ queryKey })
      const previousBoard = queryClient.getQueryData(queryKey)

      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old
        const newColumns = { ...old.columns }
        if (newColumns[listId]) {
          newColumns[listId] = { ...newColumns[listId], title }
        }
        return { ...old, columns: newColumns }
      })
      return { previousBoard }
    },
    onError: (err, vars, ctx) =>
      queryClient.setQueryData(queryKey, ctx.previousBoard),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  // 리스트 삭제
  const deleteListMutation = useMutation({
    mutationFn: (listId) => boardApi.deleteList(listId),
    onMutate: async (listId) => {
      await queryClient.cancelQueries({ queryKey })
      const previousBoard = queryClient.getQueryData(queryKey)

      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old
        const newColumns = { ...old.columns }
        delete newColumns[listId]
        const newOrder = old.columnOrder.filter((id) => id !== listId)
        return { ...old, columns: newColumns, columnOrder: newOrder }
      })
      return { previousBoard }
    },
    onError: (err, vars, ctx) =>
      queryClient.setQueryData(queryKey, ctx.previousBoard),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  return {
    moveList: moveListMutation.mutate,
    addList: addListMutation.mutate,
    updateList: updateListMutation.mutate,
    deleteList: deleteListMutation.mutate,
  }
}
