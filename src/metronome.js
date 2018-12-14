import Channel from './channel.js'
import Event from './eventEmitter.js'
import AudioLoader from './audioLoader.js'
import preset from './sounds/metronomePreset.js'

const defaultParams = {
    beats: 4,
    tempo: 120,
    preset
}

class Metronome extends Channel {

    constructor( params = defaultParams ) {
        super()

        const { beats, tempo, preset } = {...defaultParams, ...params}

        this.beats = beats
        this.tempo = tempo
        this.taktCounter = 0
        this.event = new Event()

        this.loop( true )
        this.loadPreset( preset )
    }

    loadPreset( preset ) {
        const soundToLoad = preset.map( (sound) =>
            new AudioLoader(sound.path, sound.name)
        )

        Promise
        .all(soundToLoad)
        .then( (loadedSounds) => this.onPresetLoaded( loadedSounds ) )
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

        this.taktCounter++

        this.event.emit(`beat_${this.taktCounter}`)
        this.event.emit('beat', this.taktCounter)
    }

    playSound( params ) {
        super.playSound( params )
        
        this.event.emit( 'sound', params )
    }

    stop( params ) {
        super.stop( params )

        this.taktCounter = 0
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