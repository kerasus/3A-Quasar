/* eslint-disable array-callback-return,camelcase */
import { Model, Collection } from 'js-abstract-model'
import { QuestionList } from '../models/Question'
import { QuestCategoryList } from '../models/QuestCategory'
import { QuestSubcategoryList } from '../models/QuestSubcategory'
import { CheckingTimeList } from '../models/CheckingTime'
import Assistant from '../plugins/assistant'
import axios from 'axios'
import API_ADDRESS from '../api/Addresses'

class Exam extends Model {
  constructor (data) {
    super(data, [
      {
        key: 'baseRoute',
        default: API_ADDRESS.exam.base
      },
      { key: 'id' },
      { key: 'title' },
      { key: 'photo' },
      { key: 'price' },
      { key: 'order' },
      { key: 'delay_time' },
      { key: 'exam_actions' },
      { key: 'holding_status' }, // not_started - holding - in_extra_time - finished
      { key: 'user_exam_id' },
      { key: 'user_exam_status' },
      { key: 'alaa_product_link' },
      { key: 'questions_file_url' },
      { key: 'accept_at_is_passed' },
      { key: 'total_question_number' },
      {
        key: 'is_open',
        default: false
      },
      {
        key: 'is_register_open',
        default: false
      },
      {
        key: 'opening_policy',
        default: false
      },
      {
        key: 'questions',
        relatedModel: QuestionList
      },
      {
        key: 'categories',
        relatedModel: QuestCategoryList
      },
      {
        key: 'sub_categories',
        relatedModel: QuestSubcategoryList
      },
      { key: 'start_at' },
      { key: 'finish_at' },
      { key: 'accept_at' },
      { key: 'created_at' },
      { key: 'finished_at' },
      { key: 'is_registered' },
      { key: 'exam_id' },
      { key: 'type' },
      {
        key: 'type_id',
        default: null
      }
      { key: 'exam_id' },
      {
        key: 'holding_config',
        default: {
          has_konkur_view: false,
          has_exam_progress_bar: true,
          has_category_navigation: false,
          can_skip_question: false,
          randomize_questions: false
        }
      },
      {
        key: 'enable',
        default: false
      },
      {
        key: 'is_free',
        default: false
      },
      {
        key: 'confirm',
        default: false
      },
      {
        key: 'generate_questions_automatically',
        default: false
      },
      {
        key: 'report_config',
        default: {
          maximum_question_answered: 5,
          include_abnormal: false,
          include_unranked: false,
          make_report_for_before_delay: false,
          make_report_for_remaining_only: false,
          temp_exams_in_exam_interval: false,
          consider_negative_point: false,
          populate_school_ranking: false
        }
      },
      {
        key: 'type_id',
        default: null
      }

    ])

    const that = this

    this.apiResource = {
      fields: [
        { key: 'id' },
        { key: 'title' },
        { key: 'photo' },
        { key: 'price' },
        { key: 'order' },
        { key: 'delay_time' },
        { key: 'exam_actions' },
        { key: 'type' },
        { key: 'holding_status' },
        { key: 'user_exam_id' },
        { key: 'user_exam_status' },
        { key: 'questions_file_url' },
        { key: 'total_question_number' },
        { key: 'is_open' },
        { key: 'is_register_open' },
        { key: 'opening_policy' },
        { key: 'questions' },
        { key: 'sub_categories' },
        { key: 'exam_id' },
        { key: 'enable' },
        { key: 'is_free' },
        { key: 'confirm' },
        { key: 'generate_questions_automatically' },
        { key: 'type_id' },
        { key: 'start_at' },
        { key: 'finish_at' },
        {
          key: 'categories',
          value: function () {
            return that.categories.list
          }
        }
      ]
    }
    if (this.type && this.type.id) {
      this.type_id = this.type.id
    }
    const that = this

    this.apiResource = {
      fields: [
        { key: 'id' },
        { key: 'title' },
        { key: 'photo' },
        { key: 'price' },
        { key: 'order' },
        { key: 'delay_time' },
        { key: 'exam_actions' },
        { key: 'type' },
        { key: 'holding_status' },
        { key: 'user_exam_id' },
        { key: 'user_exam_status' },
        { key: 'questions_file_url' },
        { key: 'total_question_number' },
        { key: 'is_open' },
        { key: 'is_register_open' },
        { key: 'opening_policy' },
        { key: 'questions' },
        { key: 'sub_categories' },
        { key: 'exam_id' },
        { key: 'enable' },
        { key: 'is_free' },
        { key: 'confirm' },
        { key: 'generate_questions_automatically' },
        { key: 'type_id' },
        { key: 'start_at' },
        { key: 'finish_at' },
        {
          key: 'categories',
          value: function () {
            return that.categories.list
          }
        }
      ]
    }

    if (this.type && this.type.id) {
      this.type_id = this.type.id
    }
    this.exam_id = this.id
    this.questions.sortByOrder()
    this.categories.sortByKey('end_at', 'asc')
    this.setQuestionsLtr()
    const temp = {
      maximum_question_answered: 5,
      include_abnormal: false,
      include_unranked: false,
      make_report_for_before_delay: false,
      make_report_for_remaining_only: false,
      temp_exams_in_exam_interval: false,
      consider_negative_point: false,
      populate_school_ranking: false
    }
    Object.assign(temp, this.report_config)
    this.report_config = temp
  }

  getFirstActiveCategory () {
    return this.categories.list.find((item) => !!(item.is_active))
  }

  setQuestionsLtr () {
    // const englishRegex = /^[A-Za-z0-9 :"'ʹ.<>%$&@!+()\-/\n,…?ᵒ*~]*$/
    const englishRegex = /^[A-Za-z0-9 :"'ʹ.<>%$&@!+()\-/\n,…?ᵒ*~]*$/
    this.questions.list.forEach((question) => {
      question.ltr = !!question.statement.match(englishRegex)
    })
  }

  loadSubcategoriesOfCategories () {
    const subcategoryList = this.sub_categories
    this.categories.list.map((item) => {
      item.getSubcategories(subcategoryList)
    })
  }

  getQuestionsHasData () {
    return this.questions.list.filter(
      (item) => {
        const selected = item.choices.getSelected()
        const bookmarked = item.bookmarked
        const state = item.state
        const checkingTimesLength = item.checking_times.list.length

        return (selected || bookmarked || state || checkingTimesLength)
      })
  }

  setUserQuizData (userData) {
    if (!userData) {
      return
    }
    this.questions.list.map((question) => {
      // let userQuestionData = userData.find((questionData)=> questionData.questionId === )
      const userQuestionData = userData[question.id]

      if (userQuestionData) {
        // load choice
        question.uncheckChoices()
        question.selectChoice(userQuestionData.choicesId)

        question.checking_times = new CheckingTimeList(userQuestionData.checking_times.list)
        question.bookmarked = userQuestionData.bookmarked
        question.state = userQuestionData.state
      }
    })
  }

  mergeUserQuizData (userQuizData) {
    if (Assistant.getId(userQuizData.examId) !== Assistant.getId(this.id)) {
      return
    }
    const questionsHasData = this.getQuestionsHasData()
    questionsHasData.forEach((question) => {
      if (!userQuizData.examData) {
        userQuizData.examData = []
        this.addUserQuestionData(question, userQuizData.examData)
      } else {
        const userQuestionDataIndex = userQuizData.examData.findIndex((questionData) => Assistant.getId(questionData.questionId) === Assistant.getId(question.id))
        if (!userQuestionDataIndex) {
          this.addUserQuestionData(question, userQuizData.examData)
        } else {
          this.loadUserQuestionData(question, userQuizData.examData[userQuestionDataIndex])
        }
      }
    })
    return userQuizData
  }

  addUserQuestionDataCheckingTimes (question, checkingTimes) {
    if (!checkingTimes) {
      return
    }

    question.checking_times.list.forEach((checkingTime) => {
      const oldCheckingTimeIndex = checkingTimes.findIndex((item) => {
        return item.start === checkingTime.start &&
              item.end === null &&
              checkingTime.end !== null
      })
      if (oldCheckingTimeIndex !== -1) {
        checkingTimes.splice(oldCheckingTimeIndex, 1)
      }
      checkingTimes.push({
        start: checkingTime.start,
        end: checkingTime.end
      })
    })
  }

  loadCheckingTimesFromUserData (question, userQuizData) {
    const userQuestionData = userQuizData[question.id]
    // const userQuestionData = userQuizData.find((questionData) => questionData.questionId === question.id)
    if (userQuestionData) {
      question.checking_times = new CheckingTimeList(userQuestionData.checking_times)
    }
  }

  loadUserQuestionData (question, userQuestionData) {
    const answeredChoice = question.getAnsweredChoice()
    if (!userQuestionData) {
      userQuestionData = {}
    }
    userQuestionData.choicesId = null
    if (answeredChoice) {
      userQuestionData.choicesId = answeredChoice.id
    }

    this.addUserQuestionDataCheckingTimes(question, userQuestionData.checking_times)

    userQuestionData.answered_at = (answeredChoice) ? answeredChoice.answered_at : null
    userQuestionData.bookmarked = question.bookmarked
    userQuestionData.state = question.state

    window.app.set(userQuestionData, 'answered_at', (answeredChoice) ? answeredChoice.answered_at : null)
    window.app.set(userQuestionData, 'bookmarked', question.bookmarked)
    window.app.set(userQuestionData, 'state', question.state)
  }

  addUserQuestionData (question, userQuizData) {
    const answeredChoice = question.getAnsweredChoice()
    let answeredChoiceId = null
    let answered_at = null
    if (answeredChoice) {
      answeredChoiceId = answeredChoice.id
      answered_at = answeredChoice.answered_at
    }
    const checkingTimes = []
    this.addUserQuestionDataCheckingTimes(question, checkingTimes)

    userQuizData.push({
      questionId: question.id,
      checking_times: checkingTimes,
      bookmarked: question.bookmarked,
      state: question.state,
      choicesId: answeredChoiceId,
      answered_at
    })
  }

  sendAnswersAndFinishExam () {
    const answers = []
    this.questions.list.forEach((item) => {
      const answeredChoice = item.getAnsweredChoice()
      if (answeredChoice) {
        answers.push({
          question_id: item.id,
          choice_id: answeredChoice.id,
          selected_at: answeredChoice.answered_at
        })
      }
    })
    return axios.post(API_ADDRESS.exam.sendAnswers, { exam_user_id: this.user_exam_id, finish: true, questions: answers })
  }

  mergeDbAnswerToLocalstorage (dbAnswers) {
    this.questions.list.forEach((item) => {
      const dbAnswer = dbAnswers.find((answerItem) => answerItem.question_id === item.id)
      if (dbAnswer) {
        item.selectChoice(dbAnswer.choice_id, dbAnswer.selected_at)
        item.state = dbAnswer.status
        item.bookmarked = dbAnswer.bookmark
        console.log(item.order)
      }
    })
  }

  getAnswerOfUserInExam () {
    // return axios.get(API_ADDRESS.exam.getAnswerOfUser(this.user_exam_id))
    return axios.get(API_ADDRESS.exam.getAllAnswerOfUser(this.user_exam_id))
  }

  getAnswerOfUserInResultPage () {
    const that = this
    return new Promise(function (resolve, reject) {
      axios.get(API_ADDRESS.exam.getAnswerOfUserWithCorrect(that.user_exam_id))
        .then((response) => {
          const questions_file_url = response.data.data.exam.questions_file_url
          const examTitle = response.data.data.exam.title
          const answers = response.data.data.answers
          that.questions_file_url = questions_file_url
          that.title = examTitle
          that.loadQuestionsFromFile()
            .then(() => {
              that.mergeDbAnswerToLocalstorage(answers)
              console.log(answers)
              resolve()
            })
            .catch(({ jqXHR, textStatus, errorThrown }) => {
              reject({ jqXHR, textStatus, errorThrown })
            })
        })
        .catch(() => {
          Assistant.reportErrors('exam.js -> getAnswerOfUserInResultPage() -> axios.get.catch')
          reject(null)
        })
    })
  }
}

class ExamList extends Collection {
  model () {
    return Exam
  }
}

export { Exam, ExamList }
