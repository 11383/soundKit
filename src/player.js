import Event from './eventEmitter.js'
import soundKitChannel from './channel.js'
import audioLoader from './audioLoader.js'
import keyGenerator, {defaultGenerator} from './keyBindingGenerator.js'

const STATE_PLAYING = 'play'
const STATE_STOPED = 'stop'
const STATE_INIT = 'init'
const STATE_RECORDING = 'record'

class soundKit {
    constructor() {
        this.state = STATE_INIT

        this.channels = []
        this.presets = []

        this.activePreset = null
        this.activeChannel = null

        this.event = new Event()

        this.setKeyGenerator( defaultGenerator )

        document.addEventListener( 'keypress', e => this.onKeyPress(e) )
    }

    // add channel and set it as active
    addChannel(id = Date.now()) {
        const channel = new soundKitChannel(id)

        this.channels.push(channel)
        this.activeChannel = channel

        return channel.id
    }

    getChannelIndex(id) {
        if(id == null)
            return

        const index = this.channels.findIndex( channel => channel.id == id ) 

        return index != -1 ? index : null
    }

    getChannel(id) {
        const index = this.getChannelIndex(id)

        if(index !== null)
            return this.channels[index]
    }

    setChannel(channelId) {
        const channel = this.getChannel(channelId)

        channel && (this.activeChannel = channel)
    }

    removeChannel(id = null) {
        const index = this.getChannelIndex(id)

        if(index !== null)
            this.channels.splice(index, 1)
    }

    setKeyGenerator( generator ) {
        this.keyGenerator = new keyGenerator(generator)
    }

    toggle(state = null) { // state==true => stop
        const mode = state == null ? this.isPlaying() : state

        mode ? this.stop() : this.play()
    }

    play() {
        this.state = STATE_PLAYING

        this.channels.forEach( channel => channel.play() )
    }

    stop() {
        this.state = STATE_STOPED

        this.channels.forEach( channel => channel.stop() )
    }

    restart() {
        this.stop()
        this.play()
    }

    record( channelId = this.activeChannel.id ) {
        this.stop()
        this.state = STATE_RECORDING

        this.activeChannel = this.getChannel(channelId)
        this.activeChannel.startRecording()
    }

    /* record given channel, with listening other channels */
    recordWithListening( channelId = this.activeChannel.id ) {
        this.record(channelId)

        this.channels.forEach( channel => 
            channel.id != channelId && channel.play() 
        )
    }

    addPreset(name, sounds) {
        const presetSounds = []

        sounds.forEach( sound => {
            sound.charCode && this.keyGenerator.used(sound.charCode)

            presetSounds.push(
                new audioLoader(sound.path, sound.name, { 
                    charCode: sound.charCode ? sound.charCode : this.keyGenerator.get()
                })
            )
        })

        const promise = Promise.all(presetSounds)
              promise.then( (loadedSounds) => this.onPresetLoaded(name, loadedSounds) )

        return promise
    }

    setPreset(presetName) {
        if(!this.presets[presetName])
            throw new Error(`Preset with given name '${presetName}' not exists in player`)

        this.activePreset = presetName
    }

    getPreset(presetName = this.activePreset) {
        return this.presets[presetName]
    }

    getPresetsName() {
        return Object.keys( this.presets )
    }

    onPresetLoaded(name, preset) {
        /* map preset via key bindings */
        this.activePreset = name
        this.presets[name] = preset

        this.event.emit('loaded', preset)
    }

    onKeyPress(e) {
        console.log('keypressed', e.charCode)

        const sound = this.getPreset().find( sound => 
            sound.params.charCode == e.charCode
        )

        sound && this.run( sound )
    }

    playSound(soundName) {
        const sound = this.getPreset().find( sound =>
            sound.name == soundName
        )

        sound && this.run( sound )
    }

    run(sound) {
        sound.play()

        if( this.state === STATE_RECORDING ) {
            this.activeChannel.record( sound )
        }
    }

    on(eventName, callback) {
        this.event.on(eventName, callback)
    }

    isPlaying() { return this.state == STATE_PLAYING }
    isStopped() { return this.state == STATE_STOPED }
    isRecording() { return this.state == STATE_RECORDING }
}

export default soundKit