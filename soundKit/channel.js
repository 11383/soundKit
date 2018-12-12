const MODE_PLAY = 'play'
const MODE_LOOP = 'loop'

class channel {
    constructor(id, player) {
        this.id = id
        this.soundsTrack = []
        this.muted = false
        this.mode = MODE_PLAY

        this.timeOffset = 0
        this.playingId = 0
        this.player = player
    }

    /* prepare for recording */
    startRecording() {
        this.clear()
        this.timeOffset = Date.now()
    }

    /* add sound to channel */
    record( audio ) {
        this.soundsTrack.push({
            time: Date.now() - this.timeOffset,
            audio
        })
    }

    /* clear channel sounds */
    clear() {
        this.soundsTrack = []
    }    

    /* play channel */
    play() {
        if(this.muted)
            return

        const playingId = Date.now()
        this.playingId = playingId
        
        this.soundsTrack.forEach( sound => {
            setTimeout( _ => {
                /* prevent to play sound from removed when player is stopped or new version exists */
                if( playingId == this.playingId ) {
                    sound.audio.play()
                }
            }, sound.time )
        })

        if( this.mode == MODE_LOOP ) {
            setTimeout( _ => this.play(), this.soundsTrack[ this.soundsTrack.length - 1 ].time )
        }
    }

    stop() {
        this.playingId = Date.now()
    }
}

export default channel