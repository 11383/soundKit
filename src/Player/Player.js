import { EventEmitter, PlayerSerializer, KeyBinder, LocalStorage } from '../utils.js'
import {Channel, Preset} from '../SoundKit.js'

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

        this.event = new EventEmitter()
        this.keyBinder = new KeyBinder()

        document.addEventListener( 'keypress', e =>{ 
            this.playSoundAtIndex( this.keyBinder.indexOf( e.charCode ) )
        })
    }

    // add channel and set it as active
    addChannel(id = Date.now()) {
        const channel = new Channel({ id })

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

    setKeyBindings( bindings ) {
        this.keyBinder = new keyBinder(bindings)
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

    clear() {
        this.channels = []
        this.activePreset = null
        this.activeChannel = null
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
        Preset
        .load( sounds, name )
        .then( preset => this.onPresetLoaded(name, preset) )
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
        this.activePreset = name
        this.presets[name] = preset

        this.event.emit('loaded', preset)
    }

    playSoundAtIndex(index) {
        if(index == -1 || this.getPreset().length - 1 <= index)
            return

        this.run( this.getPreset()[index] )
    }

    playSound(soundName) {
        const sound = this.getPreset().find( sound =>
            sound.name == soundName
        )

        sound && this.run( sound )
    }

    run(sound) {
        sound.play()

        this.event.emit('sound', sound)

        if( this.state === STATE_RECORDING ) {
            this.activeChannel.record( sound )
        }
    }

    on(eventName, callback) {
        this.event.on(eventName, callback)
    }

    save(name, storage = LocalStorage) {
        storage.set(
            name,
            PlayerSerializer.from(this)
        )
    }

    load(name, storage = LocalStorage) {
        const storedData = storage.get(name)

        Object.assign(this,
            PlayerSerializer.parse(storedData, this.presets)    
        )
    }

    isPlaying() { return this.state == STATE_PLAYING }
    isStopped() { return this.state == STATE_STOPED }
    isRecording() { return this.state == STATE_RECORDING }
}

export default soundKit