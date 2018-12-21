import { Player } from '../SoundKit.js'
import { ChannelSerializer } from '../utils.js'

class PlayerSerializer {

    // serialize player
    static from(player) {
        return {
            activeChannel: player.activeChannel.id,
            activePreset: player.activePreset,
            channels: player.channels.map( channel => 
                ChannelSerializer.from(channel) 
            )
        }
    }

    // create new Player from obj properties
    static parse(obj, presets = []) {
        const {activeChannel, activePreset, channels} = obj
        const player = new Player()

        player.presets = presets
        player.setChannel(activeChannel)
        player.setPreset(activePreset)

        player.channels = channels.map( channel => 
            ChannelSerializer.parse(channel, presets)
        )
        
        return player
    }
}

export default PlayerSerializer