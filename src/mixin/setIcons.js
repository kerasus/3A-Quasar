import { useQuasar } from 'quasar'

const mixinSetIcons = {
  methods: {
    setIcons () {
      const $q = useQuasar()
      $q.iconMapFn = (iconName) => {
        if (iconName.startsWith('isax:') === true) {
          const name = iconName.substring(5)
          console.log(name)
          return {
            cls: 'isax ' + name
          }
        }
      }
    }
  }
}

export default mixinSetIcons
