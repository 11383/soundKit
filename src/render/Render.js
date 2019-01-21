import MetronomeRender from './MetronomeRender.js'
import PadRender from './PadRender.js'
import ChannelRender from './ChannelRender.js'
import PresetRender from './PresetRender.js'
import ToolbarRender from './ToolbarRender.js'

class SoundKitRenderer {
    constructor(place, {player, metronome} = {
        player,
        metronome
    }) {

        this.player = player
        this.metronome = metronome
        this.renders = []

        this.renders.push( new MetronomeRender(
            '.metre-counter',
            metronome
        ))

        this.renders.push( new PadRender(
            '.soundKit-pad',
            player
        ))

        this.renders.push( new ChannelRender(
            '.soundKit-channels',
            player
        ))

        this.renders.push( new PresetRender(
            '.soundKit-preset',
            player
        ))

        this.renders.push( new ToolbarRender(
            '.soundKit-toolbar',
            player,
            metronome
        ))

        this.render()

        this.initEventListeners()
    }

    render() {
        this.renders.forEach(render => render.render())
    }

    initEventListeners() {
        this.metronome.on('beat', event => this.onBeat(event))
    }

    onBeat(event) {
        /* last beat on first ber */
        if (
            this.state == 'RECORDING'
            && event.bar == 1 
            && event.beat == event.beats
        ) {
            console.log('recording [renderer]', this.state)
            this.player.recordWithListening()
        }
    }

    record() {
        this.metronome.play()

        /* rerender metronome */
        this.renders[0].render()

        this.state = 'RECORDING'
    }

    play() {
        this.player.play()
    }

    stop() {
        this.state = 'STOP'
        this.player.stop()
        this.metronome.stop()
    }
}

export default SoundKitRenderer