import { Channel, Preset } from '../SoundKit.js'
import { EventEmitter } from '../utils.js'
import metronomePreset from './sounds/metronomePreset.js'

class Metronome extends Channel {
    constructor({
        beats = 4,
        tempo = 120,
        preset = metronomePreset
    } = {}) 
    {
        super()

        this.beats = beats
        this.tempo = tempo
        this.barCounter = 0
        this.event = new EventEmitter()

        this.loop(true)
        this.addPreset(preset)
    }

    addPreset(sounds) {
        Preset
        .load(sounds, 'metronome')
        .then(preset => this.onPresetLoaded(preset))
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
                audio: this.preset[ Number(!!index) ],
                index: index + 1
            })
        )

        this.duration = this.beats * step
    }

    play(params) {
        this.event.emit('bar', this.barCounter)

        super.play(params)

        this.barCounter++
    }

    playSound(params) {
        super.playSound(params)

        this.event.emit('beat', {
            bar: this.barCounter,
            beat: params.index,
            beats: this.beats,
            tempo: this.tempo
        })
    }

    stop(params) {
        super.stop(params)

        this.barCounter = 0
    }

    setTempo(tempo) {
        this.tempo = tempo

        this.update()
    }   

    setBeats(beats) {
        this.beats = beats

        this.update()
    }

    on(eventName, callback) {
        this.event.on(eventName, callback)
    }
}

export default Metronome