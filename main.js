/*
* @todo - 4 kanały, ładny html, odliczanie 4,3,2,1... 
* odtwarzanie -> wszystkie pozostałe (może też być checkbox)
*/

window.addEventListener('DOMContentLoaded', appStart)

const sounds = {
    97: 'boom',
    115: 'clap',
    100: 'hihat',
    102: 'kick',
    103: 'openhat',
    104: 'ride',
    106: 'snare',
    107: 'tink',
    108: 'tom'
}

let recording = {
    isRecording: false,
    started: 0,
    channel: false
}

let channels = {}

function appStart() {
    window.addEventListener('keypress', playSound)

    document.querySelectorAll('.rec').forEach( recBtn => {
        recBtn.addEventListener('click', recAudio)
    })
    
    document.querySelector('#play').addEventListener('click', playAudio)
}

function playSound(e) {

    if(!sounds[e.charCode]) { return }
    
    const soundName = sounds[e.charCode]
    const audioDOM = document.querySelector(`#${soundName}`)

    audioDOM.currentTime = 0
    audioDOM.play()

    if(recording.isRecording) {

        channels[recording.channel].push({
            name: soundName,
            time: Date.now() - recording.started
        })

    }
}

function recAudio(e) {

    recording.started = Date.now()
    recording.isRecording = !recording.isRecording
    recording.channel = `#${e.target.getAttribute("data-channel")}`
    
    e.target.innerHTML = recording.isRecording ? 'STOP' : `REC ch.${recording.channel}`

    if(recording.isRecording) {
        channels[recording.channel] = []
        playAudio()
    }
}

function playAudio() {
    Object.keys(channels).forEach( channel => {

        channels[channel].forEach(sound => {

            setTimeout( () => {            
                const audioDOM = document.querySelector(`#${sound.name}`)
                audioDOM.currentTime = 0
                audioDOM.play()
            }, sound.time)
            
        })

    })
}