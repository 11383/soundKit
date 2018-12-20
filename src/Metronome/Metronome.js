import Channel from '../Channel/Channel.js'
import Event from '../Helpers/EventEmitter.js'
import Preset from '../Preset/Preset.js'
import metronomeSounds from './sounds/metronomePreset.js'

const defaultParams = {
    beats: 4,
    tempo: 120,
    preset: metronomeSounds
}

class Metronome extends Channel {

    constructor( params = defaultParams ) {
        super()

        const { beats, tempo, preset } = {...defaultParams, ...params}

        this.beats = beats
        this.tempo = tempo
        this.beatsCounter = 0
        this.event = new Event()

        this.loop( true )
        this.addPreset( preset )
    }

    addPreset(sounds) {
        Preset
        .load( sounds, 'metronome' )
        .then( preset => this.onPresetLoaded(preset) )
    }

    onPresetLoaded(preset) {
        this.preset = preset
        this.update()
        
        this.event.emit('loaded', this)
    }

    update() {
        let step = 60 * 1000 / this.tempo

        this.soundsTrack = 
            Array(this.beats)
            .fill(undefined)
            .map( (_, index) => ({
                time: index * step,
                audio: this.preset[ Number(!!index) ]
            })
        )

        this.duration = this.beats * step
    }

    play( params ) {
        super.play( params )

        this.beatsCounter++

        this.event.emit(`beat_${this.beatsCounter}`)
        this.event.emit('beat', this.beatsCounter)
    }

    playSound( params ) {
        super.playSound( params )
        
        this.event.emit( 'sound', params )
    }

    stop( params ) {
        super.stop( params )

        this.beatsCounter = 0
    }

    setTempo(tempo) {
        this.tempo = tempo

        this.update()
    }   

    setMetrum( beats ) {
        this.beats = beats

        this.update()
    }

    on(eventName, callback) {
        this.event.on(eventName, callback)
    }
}

export default Metronome