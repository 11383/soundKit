class PresetRender {
    constructor(selector, player) {
        const element = document.querySelector(selector)

        if(!element) {
            throw Error(`Element with given selector ${selector} not found!`)
        }

        this.player = player
        this.element = this.createElement(element)

        element.append(this.element)

        this.initEventListeners()
    }

    createElement() {
        return document.createElement('select')
    }

    render() {
        this.element.innerHTML = ''

        const options = 
          Object
          .keys(this.player.presets)
          .map( preset => {
            const option = document.createElement('option')
                  option.value = preset
                  option.innerText = preset

            return option
          })

        this.element.append(...options)
        this.element.value = this.player.activePreset
    }

    onChange(e) {
        this.player.setPreset(
            this.element.value
        )
    }

    initEventListeners() {
        this.element.addEventListener('change', (e) => this.onChange(e))
        this.player.on('preset.loaded', _ => this.render())
    }
}

export default PresetRender