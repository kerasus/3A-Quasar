/* eslint-disable camelcase,array-callback-return */
import Time from 'src/plugins/time'
import { Model, Collection } from 'js-abstract-model'
import { ChoiceList } from './Choice'
import { CheckingTimeList } from '../models/CheckingTime'
import axios from 'axios'
import API_ADDRESS from '../api/Addresses'
import TurndownService from 'turndown/lib/turndown.browser.umd'
import { QuestionStatus } from '../models/QuestionStatus'
import { LogList } from '../models/Log'
import { createApp } from 'vue'
if (!window.app) {
// window.app
  window.app = createApp({})
}
class Question extends Model {
  constructor (data) {
    super(data, [
      {
        key: 'baseRoute',
        default: API_ADDRESS.question.base
      },
      { key: 'id' },
      { key: '_id' },
      { key: 'title' },
      { key: 'index' },
      { key: 'statement' },
      { key: 'statement_photo' },
      { key: 'rendered_statement' },
      { key: 'in_active_category' },
      { key: 'photo' },
      { key: 'order' },
      { key: 'exams' },
      { key: 'type_id' },
      {
        key: 'author',
        default: []
      },
      {
        key: 'type',
        default: {
          id: null,
          type: null, // question_type
          value: null // psychometric
        }
      },
      {
        key: 'isInView',
        default: false
      },
      { key: 'sub_category' },
      { key: 'sub_category_id' },
      {
        key: 'checking_times',
        relatedModel: CheckingTimeList
      },
      {
        key: 'logs',
        relatedModel: LogList
      },
      { key: 'answer' },
      {
        key: 'answer_photos',
        default: []
      },
      { key: 'descriptive_answer' },
      { key: 'rendered_descriptive_answer' },
      { key: 'selected_at' },
      {
        key: 'choices',
        relatedModel: ChoiceList
      },
      {
        key: 'status',
        relatedModel: QuestionStatus
      },
      {
        key: 'state',
        default: ''
      },
      {
        key: 'ltr',
        default: false
      },
      {
        key: 'bookmarked',
        default: false
      },
      { key: 'lesson' },
      {
        key: 'seen',
        default: false
      },
      {
        key: 'recommendedTime',
        default: 0
      },
      {
        key: 'difficulty',
        default: 1
      },
      {
        key: 'creator',
        default: 1
      },
      {
        key: 'confirmed',
        default: false
      },
      {
        key: 'confirmers',
        default: []
      },
      { key: 'created_at' },
      { key: 'updated_at' }
    ])

    if (this.id) {
      this._id = this.id
    }

    if (this._id) {
      this.id = this._id
    }

    const that = this
    this.apiResource = {
      fields: [
        { key: 'statement' },
        { key: 'descriptive_answer' },
        { key: 'sub_category_id' },
        { key: 'exams' },
        { key: 'type_id' },
        { key: 'author' },
        {
          key: 'choices',
          value: function () {
            return that.choices.list
          }
        },
        {
          key: 'recommended_time',
          value: function () {
            return that.recommendedTime
          }
        },
        {
          key: 'level',
          value: function () {
            return that.difficulty
          }
        }
      ]
    }

    if (typeof this.statement === 'string') {
      this.rendered_statement = (this.statement)
      // this.rendered_statement = convert(this.statement)
      // this.rendered_statement = md.render(this.statement)
    }
    if (typeof this.descriptive_answer === 'string') {
      this.rendered_descriptive_answer = (this.descriptive_answer)
      // this.rendered_descriptive_answer = convert(this.descriptive_answer)
      // this.rendered_statement = md.render(this.statement)
    }
    if (this.choices.list.length === 0) {
      const choices = [
        {
          id: 1,
          title: '',
          order: 1,
          answer: false
        },
        {
          id: 2,
          title: '',
          order: 2,
          answer: false
        },
        {
          id: 3,
          title: '',
          order: 3,
          answer: false
        },
        {
          id: 4,
          title: '',
          order: 4,
          answer: false
        }
      ]
      this.choices = new ChoiceList(choices)
    }
  }

  convertToMarkdownKatex1 (string) {
    if (!string) {
      return string
    }

    string = string.replace(/\n/g, '<br>')

    TurndownService.prototype.escape = function (string) {
      const escapes = [
        [/\s\$/g, '$'],
        [/\$\s/g, '$'],
        [/\{align\*\}/g, '{cases}']
        // [/\\/g, '\\\\'],
        // [/\*/g, '\\*'],
        // [/^-/g, '\\-'],
        // [/^\+ /g, '\\+ '],
        // [/^(=+)/g, '\\$1'],
        // [/^(#{1,6}) /g, '\\$1 '],
        // [/`/g, '\\`'],
        // [/^~~~/g, '\\~~~'],
        // [/\[/g, '\\['],
        // [/\]/g, '\\]'],
        // [/^>/g, '\\>'],
        // [/_/g, '\\_'],
        // [/^(\d+)\. /g, '$1\\. ']
      ]
      return escapes.reduce(function (accumulator, escape) {
        return accumulator.replace(escape[0], escape[1])
      }, string)
    }
    // create an instance of Turndown service
    const turndownService = new TurndownService({
      // rules: COMMONMARK_RULES,
      headingStyle: 'setext',
      hr: '* * *',
      bulletListMarker: '*',
      codeBlockStyle: 'indented',
      fence: '```',
      emDelimiter: '_',
      strongDelimiter: '**',
      linkStyle: 'inlined',
      linkReferenceStyle: 'full',
      br: '  ',
      blankReplacement: function (content, node) {
        return node.isBlock ? '\n\n' : ''
      },
      keepReplacement: function (content, node) {
        return node.isBlock ? '\n\n' + node.outerHTML + '\n\n' : node.outerHTML
      },
      defaultReplacement: function (content, node) {
        return node.isBlock ? '\n\n' + content + '\n\n' : content
      }
    })
    // turndownService.keep(['$'])

    // convert HTML to Markdown
    return turndownService.turndown(string)
    // return string
  }

  getAnsweredChoice () {
    return this.choices.list.find((item) => {
      return (item.active === true)
    })
  }

  isAnswered () {
    const answeredChoice = this.getAnsweredChoice()

    if (answeredChoice) {
      return true
    } else {
      return false
    }
  }

  changeState (newState) {
    if (newState === 'x') {
      this.uncheckChoices()
    }
    if (newState === this.state) {
      window.app.set(this, 'state', '')
      return
    }
    window.app.set(this, 'state', newState)
  }

  bookmark () {
    this.bookmarked = !this.bookmarked
  }

  enterQuestion () {
    this.checking_times.addStart()
  }

  leaveQuestion () {
    this.checking_times.addEnd()
  }

  setTrueChoice (choiceId) {
    this.choices.list.map((item) => {
      if (item.id === choiceId) {
        item.answer = true
        window.app.set(item, 'answer', true)
      } else {
        item.answer = false
        window.app.set(item, 'answer', false)
      }

      return item
    })
  }

  selectChoice (choiceId, selected_at) {
    let answeredAt = Time.now()
    if (selected_at) {
      answeredAt = selected_at
    }
    const that = this
    this.choices.list.map((item) => {
      window.app.set(item, 'answered_at', answeredAt)
      if (that.state === 'x') {
        that.state = ''
        window.app.set(that, 'state', '')
      }
      if (item.id !== choiceId) {
        item.active = false
        window.app.set(item, 'active', false)
      } else if (choiceId === null || typeof choiceId === 'undefined' || item.active) {
        window.app.set(item, 'active', false)
        // item.active = false
      } else {
        window.app.set(item, 'active', true)
        // item.active = true
      }
    })
  }

  uncheckChoices () {
    this.choices.list.map((item) => {
      item.active = false
      window.app.set(item, 'active', false)
    })
  }

  sendAnswer (exam_user_id, { question_id, choice_id, selected_at }) {
    return axios.post(API_ADDRESS.exam.sendAnswers, { exam_user_id, questions: [{ question_id, choice_id, selected_at }] })
  }

  sendStatus (exam_user_id, { question_id, status }) {
    return axios.post(API_ADDRESS.exam.sendStatus, { exam_user_id, question_id, status })
  }

  sendBookmark (exam_user_id, question_id) {
    return axios.post(API_ADDRESS.exam.sendBookmark, { exam_user_id, question_id })
  }

  sendUnBookmark (exam_user_id, question_id) {
    return axios.post(API_ADDRESS.exam.sendUnBookmark, { exam_user_id, question_id })
  }
}

class QuestionList extends Collection {
  model () {
    return Question
  }

  changeOrderToInt () {
    this.list.forEach((item, index, questions) => {
      questions[index].order = parseInt(questions[index].order)
    })
  }

  sortByOrder () {
    this.changeOrderToInt()
    return this.sortByKey('order')
  }

  getQuestionById (questionId) {
    return this.list.find(
      (item) =>
        questionId !== null && (item.id).toString() === (questionId).toString()
    )
  }

  getFirstActiveQuestion () {
    return this.list.find((item) => !!(item.in_active_category))
  }
}

export { Question, QuestionList }
