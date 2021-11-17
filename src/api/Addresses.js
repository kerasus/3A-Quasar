const lumenServer = '/3a/api/v1'
// const lumenServer = process.env.VUE_APP_LUMEN_INTERNAL_API_SERVER
// // const lumenRabbitMQ = process.env.VUE_APP_LUMEN_RABBIT_MQ_API_SERVER
const authServer = '/alaa/api/v2'
// const authServer = process.env.VUE_APP_AUTH_INTERNAL_API_SERVER
const API_ADDRESS = {
  server: {
    lumen: lumenServer,
    auth: authServer
  },
  auth: {
    login: authServer + '/login'
  },
  user: {
    base: authServer + '/user',
    mobile: {
      resend: authServer + '/mobile/resend',
      verify: authServer + '/mobile/verify'
    },
    formData: authServer + '/megaroute/getUserFormData',
    show_user: authServer + '/getUserFor3a'
  },
  set: {
    base: authServer + '/set'
  },
  content: {
    base: authServer + '/c'
  },
  option: {
    base: lumenServer + '/option'
  },
  log: {
    base: lumenServer + '/activity-log',
    addComment (id) {
      return lumenServer + '/activity-log/' + id + '/comment'
    }
  },
  exam: {
    editExam: lumenServer + '/exam',
    sendAnswers: lumenServer + '/temp-exam/answer/choice',
    sendStatus: lumenServer + '/temp-exam/answer/status',
    sendBookmark: lumenServer + '/temp-exam/answer/bookmark',
    sendUnBookmark: lumenServer + '/temp-exam/answer/unbookmark',
    userExamsList: lumenServer + '/examAndUser',
    takhminRotbe: lumenServer + '/exam-report/rankSimulator',
    analysisVideo: lumenServer + '/exam-question/attach/sub-category',
    getAnalysisVideo (examId) {
      return lumenServer + '/exam-question/videos/' + examId
    },
    examReportIndex (type) {
      return lumenServer + '/exam-report/index/' + type
    },
    pdf (examId) {
      return lumenServer + '/exam-question/booklet-file/' + examId
    },
    base (pageNumber) {
      if (pageNumber) {
        return lumenServer + '/exam?with_pagination=1&page=' + pageNumber
      } else {
        return lumenServer + '/exam?with_pagination=0'
      }
    },
    generateExamFile (examId, withAnswer) {
      const baseFileRoute = lumenServer + '/exam-question/file/' + examId
      return withAnswer ? (baseFileRoute + '/with_answer') : baseFileRoute
    },
    getAnswerOfUser (userExamId) {
      return lumenServer + '/temp-exam/answer/' + userExamId
    },
    getAllAnswerOfUser (userExamId) {
      return lumenServer + '/temp-exam/allAnswer/' + userExamId
    },
    getSubCategoriesWithPermissions (examId) {
      return lumenServer + '/exam-question/show/sub-categories/' + examId
    },
    getAnswerOfUserWithCorrect (userExamId) {
      return lumenServer + '/temp-exam/answer/' + userExamId + '/withCorrect'
    },
    registerExam: lumenServer + '/user/registerExam',
    examUser: lumenServer + '/exam-user',
    examQuestion (quizId) {
      return lumenServer + '/exam-question/attach/show/' + quizId
    },
    report: {
      getReport (userExamId) {
        return lumenServer + '/exam-report/show?user_exam_id=' + userExamId
      },
      updateReportOptions (examId) {
        return lumenServer + '/exam/config/' + examId
      }
    },
    examBookletUpload (examId) {
      return lumenServer + '/exam-question/booklet-file/' + examId
    }
  },
  question: {
    indexMonta: lumenServer + '/question/search-monta',
    index (statuses, page) {
      statuses = statuses.join('&statuses[]=')
      if (statuses) {
        statuses = '&statuses[]=' + statuses
      }

      if (typeof page !== 'undefined') {
        page = '&page=' + page
      } else {
        page = ''
      }
      let queryParam = statuses + page
      if (queryParam.length > 0) {
        queryParam = queryParam.substr(1)
      }
      return lumenServer + '/question?' + queryParam
    },
    status: {
      base: lumenServer + '/question/statuses',
      changeStatus (questionId) {
        return lumenServer + '/question/' + questionId + '/status'
      }
    },
    log: {
      base (questionId, pagination) {
        if (!pagination) {
          pagination = 0
        }
        return lumenServer + '/activity-log?subject_id=' + questionId + '&subject=question&title=update&description=update_question_status&with_pagination=0'
      }
    },
    base: lumenServer + '/exam-question/attach',
    createAndAttach: () => lumenServer + '/exam-question/attach/',
    create: lumenServer + '/question',
    attachSubCategoryToQuestion: lumenServer + '/exam-question/attach/sub-category',
    updateQuestion (questionId) {
      return lumenServer + '/question/' + questionId
    },
    attach: lumenServer + '/exam-question/attach/v2',
    detach (questionId) {
      return lumenServer + '/exam-question/detach/' + questionId
    },
    delete (questionId) {
      return lumenServer + '/question/' + questionId
    },
    getCurrentQuestion (questionId) {
      return lumenServer + '/question/' + questionId
    },
    confirm (questionId) {
      return lumenServer + '/question/confirm/' + questionId
    },
    uploadImage (questionId) {
      return lumenServer + '/question/upload/' + questionId
    }
  },
  questionSubcategory: {
    base: lumenServer + '/sub-category',
    update (id) {
      return lumenServer + '/sub-category/' + id
    }
  },
  questionCategory: {
    base: lumenServer + '/category',
    update (id) {
      return lumenServer + '/category/' + id
    }
  },
  subGroups: {
    base (examId) {
      return lumenServer + '/exam-question/zirgorooh/' + examId
    },
    all () {
      return lumenServer + '/option?with_pagination=0&type=zirgorooh_type'
    }
  }
}
export default API_ADDRESS
