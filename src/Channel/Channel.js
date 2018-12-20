const MODE_PLAY = 'play'
const MODE_LOOP = 'loop'

class Channel {
    constructor({
        id = Date.now(), 
        muted = false, 
        mode = MODE_PLAY, 
        timeOffset = 0,
        playingId = 0,
        duration = 0,
        soundsTrack = []
    } = {} ) {

        this.id = id
        this.muted = muted
        this.mode = mode
        this.timeOffset = timeOffset
        this.playingId = playingId
        this.duration = duration
        this.soundsTrack = soundsTrack

        return id
    }

    /* prepare for recording */
    startRecording() {
        this.clear()
        this.timeOffset = Date.now()
    }

    /* add sound to channel */
    record( audio ) {
        const time = Date.now() - this.timeOffset
        const duration = time + audio.audio.duration

        this.soundsTrack.push({
            time,
            audio
        })

        this.duration < duration && (this.duration = duration)
    }

    setDuration(duration) {
        this.duration = duration
    }

    /* enable or disable 'play in loop' mode, default change state in toggle mode  */
    loop( on = !this.loop ) { // @todo this.loop not exists!
        this.mode = on ? MODE_LOOP : MODE_PLAY
    }

    /* enable or disable muted, default change state in toggle mode */
    mute( on = !this.muted ) {
        this.muted = on
    }

    /* clear channel sounds */
    clear() {
        this.soundsTrack = []
        this.duration = 0
        this.muted = false
        this.mode = MODE_PLAY
    }

    /* play channel */
    play() {
        if(this.muted)
            return

        const playingId = Date.now()
        this.playingId = playingId
        
        this.soundsTrack.forEach( sound => {
            setTimeout( _ => {
                /* prevent to play removed sounds or old verion sound (from with previous revision) */
                if( playingId == this.playingId ) {
                    this.playSound(sound.audio)
                }
            }, sound.time )
        })

        if( this.mode == MODE_LOOP ) {
            setTimeout( _ => 
                this.playingId == playingId && this.play(), 
                this.duration
            )
        }
    }

    playSound(audio) {
        audio.play()
    }

    stop() {
        this.playingId = Date.now()
    }
}

export default Channel