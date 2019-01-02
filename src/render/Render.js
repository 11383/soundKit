import MetronomeRender from './MetronomeRender.js'
import PadRender from './PadRender.js'
import ChannelRender from './ChannelRender.js'

class SoundKitRenderer {
    constructor(place, {player, metronome} = {
        player,
        metronome
    }) {

        this.player = player
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

        this.render()
    }

    render() {
        this.renders.forEach( render => render.render() )
    }
}

export default SoundKitRenderer