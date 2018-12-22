import { Channel } from '../SoundKit.js'

class ChannelSerializer {

    // serialize channel
    static from(channel) {
        const {
            id, 
            mode, 
            duration, 
            soundsTrack
        } = channel

        return {
            id,
            mode,
            duration,
            soundsTrack: soundsTrack.map(ChannelSerializer.serializeSound)
        }
    }

    // return channel
    static parse(obj, presets) {
        obj.soundsTrack = obj.soundsTrack.map(sound => 
            ChannelSerializer.parseSound(sound, presets)
        )

        return new Channel(obj) 
    }

    static serializeSound({ time, audio: { name, params: { preset }}}) {
        return {
            time,
            name,
            preset
        }
    }

    static parseSound({ preset, time, name }, presets) {
        const audio = presets[preset].find(sound => 
            sound.name == name
        )

        return { time, audio }
    }    
}

export default ChannelSerializer