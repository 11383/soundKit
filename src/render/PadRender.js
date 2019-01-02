class PadRender {
    constructor(selector, player) {
        const element = document.querySelector(selector)

        if(!element) {
            throw Error(`Element with given selector ${selector} not found!`)
        }

        this.element = element
        this.player = player

        this.initEventListeners()
    }

    render() {
        if(!this.player.getPreset()) 
            return

        const padItems = this.player.getPreset().map(audio => 
            this.renderItem(audio) 
        )

        this.element.innerHTML = ''
        this.element.append(...padItems)
    }

    renderItem(audioLoader) {
        const item = document.createElement('div')
              item.classList.add('card')
              item.setAttribute('data-sound', audioLoader.name)
              item.innerText = audioLoader.name

        this.itemEventListeners(item, audioLoader)

        return item
    }

    onPadItemActive(data) {
        const item = this.element.querySelector(`[data-sound="${data.name}"]`)

        if (!item)
            return

        item.classList.add('card--tapped')
        item.setAttribute('data-update', Date.now())

        setTimeout( _ => {
            if (Date.now() - item.getAttribute('data-update') >= 200)
                item.classList.remove('card--tapped')
        }, 200)
    }

    itemEventListeners(item, audioLoader) {
        item.addEventListener('touchstart', _ => {
            this.player.playSound(audioLoader.name)
        })
    }

    initEventListeners() {
        this.player.on('preset.changed', _ => this.render() )
        this.player.on('sound', data => this.onPadItemActive(data) )
    }
}

export default PadRender