import { Model, Collection } from 'js-abstract-model'
import { QuestSubcategoryList } from 'src/models/QuestSubcategory'

class QuestCategory extends Model {
  constructor (data) {
    super(data, [
      { key: 'id' },
      { key: 'title' },
      { key: 'accept_at' },
      {
        key: 'is_active',
        default: false
      },
      {
        key: 'sub_categories',
        relatedModel: QuestSubcategoryList
      },
      { key: 'order' },
      { key: 'time' },
      { key: 'questions_booklet' },
      { key: 'descriptive_answers_booklet' },
      {
        key: 'editable',
        default: false
      }
    ])
  }

  getSubcategories (subcategoryList) {
    const thisCategoryId = (this.id).toString()
    this.sub_categories = new QuestSubcategoryList(subcategoryList.list.filter((item) => {
      return (item.category_id).toString() === thisCategoryId
    }))
  }
}

class QuestCategoryList extends Collection {
  model () {
    return QuestCategory
  }
}

export { QuestCategory, QuestCategoryList }
