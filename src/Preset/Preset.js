import { AudioLoader } from '../utils.js'

class Preset {

    static load(preset, presetName = 'default') {
        const audioToLoad = preset.map( ({path,name}) => 
            new AudioLoader(
                path, 
                name, 
                { preset: presetName }
            ).load()
        )

        return Promise.all(audioToLoad)
    }

}

export default Preset