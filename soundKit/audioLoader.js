class AudioLoader {
    constructor(path, name) {
        this.name = name
        this.audio = new Audio()
        this.audio.src = path;

        return new Promise( (resolve, rejected) => {
            this.audio.addEventListener('canplaythrough', () => { resolve(this) })
        })
    }
}

export default AudioLoader