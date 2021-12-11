import Assistant from 'src/plugins/assistant'
export function mergeDbAnswersIntoLocalstorage (state, payload) {
  const dbAnswers = payload.dbAnswers
  const examId = Assistant.getId(payload.exam_id)

  if (!examId) {
    return
  }
  if (!state.userQuizListData[examId]) {
    // Vue.set(state.userQuizListData, examId, {})
  }

  function merge (collection1, collection2) {
    collection1.map(item1 => {
      const targetCollect2Index = collection2.findIndex(item2 => item1.question_id === item2.question_id)
      if (targetCollect2Index < 0) {
        // eslint-disable-next-line array-callback-return
        return
      }
      item1.status = (!collection2[targetCollect2Index].status) ? null : collection2[targetCollect2Index].status
      item1.bookmarked = (!collection2[targetCollect2Index].bookmark) ? false : collection2[targetCollect2Index].bookmark
      collection2.splice(targetCollect2Index, 1)

      return item1
    })

    collection2.forEach(item2 => {
      collection1.push({
        question_id: item2.question_id,
        answered_at: item2.selected_at,
        answered_choice_id: item2.choice_id,
        bookmarked: item2.bookmark,
        status: item2.status,
        check_in_times: []
      })
    })
  }

  merge(dbAnswers.choices, dbAnswers.statuses)
  merge(dbAnswers.choices, dbAnswers.bookmarks)

  const userData = dbAnswers.choices

  userData.forEach((item) => {
    const questionId = Assistant.getId(item.question_id)
    if (!questionId) {
      return
    }
    if (!state.userQuizListData[examId][questionId]) {
      // Vue.set(state.userQuizListData[examId], questionId, {})
    }
    const check_in_times = state.userQuizListData[examId][questionId].check_in_times || []
    // Vue.set(state.userQuizListData[examId], questionId, {
    //   answered_at: item.selected_at,
    //   answered_choice_id: item.choice_id,
    //   bookmarked: item.bookmarked,
    //   status: item.status,
    //   check_in_times
    // })
  })
}
