class MetronomeRender {
    constructor(selector, metronome) {
        const element = document.querySelector(selector)

        if(!element) {
            throw Error(`Element with given selector ${selector} not found!`)
        }

        this.element = element
        this.metronome = metronome

        this.initEventListeners()
    }

    render() {
        const counter = this.element

        if (!this.metronome.soundTrack)
            return
            
        counter.innerHTML = ''
        counter.style.display = 'block'
        counter.classList.add('metre-counter--active')

        this.metronome.soundsTrack.forEach(soundTrack => {
            const item = this.createMetronomeItem(
                soundTrack.index, 
                this.metronome.beats
                )

            counter.appendChild(item)
        })
    }

    createMetronomeItem(beat, beats) {
        const item = document.createElement('div')
        item.classList.add('metre-counter__item')
        item.innerHTML = beats - beat + 1
        item.setAttribute('data-metre-beat', beat)

        return item
    }

    initEventListeners() {
        this.metronome.on('beat', this.onMetronomeBeat)
    }

    onMetronomeBeat(event) {
        /* event: recording couter */
        if(event.bar == 1) { // and recording
            const metreCounterItem = document.querySelector(`[data-metre-beat="${event.beat}"]`)
            
            if(metreCounterItem) {
                metreCounterItem.classList.add('metre-counter__item--active')
                metreCounterItem.style.animationDuration = `${event.step}ms`
            }
        }

        /* event: last beat from first bar */
        if( event.bar == 1 && event.beat == event.beats) {
            console.log('recording')

            const counter = document.querySelector('.metre-counter')
            counter.classList.remove('metre-counter--active')
        }

        if(event.bar == 2) {
            const counter = document.querySelector('.metre-counter')
            counter.style.display = 'none'
            //disable metre counter
        }
    }


}

export default MetronomeRender