class ChannelRender {
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
        const channelsItems = this.player.channels.map(channel => this.renderItem)
        
        channelsItems.push(this.renderItemAdd())

        this.element.append(...channelsItems)
    }

    renderItem(channel) {
        const item = document.createElement('div')
              item.classList.add('card')
              item.setAttribute('data-channel-id', channel.id)
              item.innerText = channel.id

        this.itemEventListeners(item, channel)

        return item
    }

    renderItemAdd() {
        const item = document.createElement('div')
              item.classList.add('card')
              item.innerText = '+'
              item.addEventListener('click', _ => this.addItem() )

        return item
    }

    addItem() {
        const name = prompt(
            'name of channel', 
            `channel #${this.player.channels.length}`
            )

        name && this.player.addChannel(name)
    }

    onItemAdd(channel) {
        this.element.prepend( this.renderItem(channel) )
    }

    onItemRemove() {}

    onItemSet(channel) {
        const item = this.element.querySelector(`[data-channel-id="${channel.id}"]`)
        const activeItems = this.element.querySelectorAll('.card--active')

        activeItems.forEach( item => item.classList.remove('card--active') ) 

        item && item.classList.add('card--active')
    }

    itemEventListeners(item, channel) {
        item.addEventListener('click', _ => {
            player.setChannel(channel.id)
        })
    }

    initEventListeners() {
        this.player.on('channel.add', channel => this.onItemAdd(channel) )
        this.player.on('channel.remove', channel => this.onItemRemove(channel) )
        this.player.on('channel.set', channel => this.onItemSet(channel) )
        
    }
}

export default ChannelRender