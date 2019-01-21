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

        const padItems = this.player.getPreset().map((audio,index) => { 
            const charcodeKey = this.player.keyBinder[index]
            return this.renderItem(audio, String.fromCharCode(charcodeKey)) 
        })

        this.element.innerHTML = ''
        this.element.append(...padItems)
    }

    renderItem(audioLoader, key) {
        const item = document.createElement('div')
              item.classList.add('card')
              item.setAttribute('data-sound', audioLoader.name)
              item.innerText = audioLoader.name
              item.innerHTML = `
                ${audioLoader.name}
                <span class="card__key">${key}</span>    
            `

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
        ['touchstart', 'click'].forEach(event => {
            item.addEventListener(event, e => {
                this.player.playSound(audioLoader.name)
                e.preventDefault();
            })
        })
    }

    initEventListeners() {
        this.player.on('preset.loaded', _ => this.render() )
        this.player.on('preset.changed', _ => this.render() )
        this.player.on('sound', data => this.onPadItemActive(data) )
    }
}

export default PadRender