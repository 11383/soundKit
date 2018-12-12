class AudioLoader {
    constructor(path, name, params = {}) {
        this.name = name
        this.audio = new Audio()
        this.audio.src = path
        this.params = params

        return new Promise( (resolve, rejected) => {
            this.audio.addEventListener('canplaythrough', () => { resolve(this) })
        })
    }

    play() {
        this.audio.currentTime = 0
        this.audio.play()
    }
}

export default AudioLoader