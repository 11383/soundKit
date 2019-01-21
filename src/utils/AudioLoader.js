class AudioLoader {
    constructor(path, name, params = {}) {
        this.name = name
        this.audio = new Audio()
        this.audio.src = path
        this.params = params
    }

    load() {
        return new Promise( (resolve, rejected) => {
            this.audio.addEventListener('canplaythrough', () => {
                resolve(this) 
            })

            this.audio.addEventListener('error', () => {
                rejected(e)
            })

            setTimeout( _ => this.audio.load(), 100) //chrome:fix
        })
    }

    play() {
        this.audio.currentTime = 0
        this.audio.play()
    }
}

export default AudioLoader