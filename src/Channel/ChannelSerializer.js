import Channel from './Channel.js'

class ChannelSerializer {

    // serialize channel
    static from(channel) {
        const {id, mode, duration, soundsTrack} = channel

        return {
            id,
            mode,
            duration,
            soundsTrack: soundsTrack.map( ChannelSerializer.serializeSound )
        }
    }

    // return channel
    static parse( obj, presets ) {
        obj.soundsTrack = obj.soundsTrack.map( sound => ChannelSerializer.parseSound(sound, presets) )

        return new Channel(obj) 
    }

    static serializeSound(sound) {
        return {
            time: sound.time,
            name: sound.audio.name,
            preset: sound.audio.params.preset
        }
    }

    static parseSound(sound, presets) {
        const {preset, time, name} = sound
        
        const audio = presets[preset].find( sound => sound.name == name )

        return { time, audio }
    }    
}

export default ChannelSerializer