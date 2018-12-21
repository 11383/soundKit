import { AudioLoader } from '../utils.js'

class Preset {

    static load(preset, name = 'default') {
        const audioToLoad = preset.map( sound => 
            new AudioLoader(sound.path, sound.name, {preset: name}).load()
        )

        return Promise.all(audioToLoad)
    }

}

export default Preset