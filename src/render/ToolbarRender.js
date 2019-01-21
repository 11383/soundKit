import FileStorage from '../storage/FileStorage.js'

class ToolbarRender {
    constructor(selector, player, metronome) {
        const element = document.querySelector(selector)

        if(!element) {
            throw Error(`Element with given selector ${selector} not found!`)
        }

        this.element = element
        this.player = player
        this.metronome = metronome
    }

    render() {
        this.element.innerHTML = `
            <div class="toolbar__item">
                <div class="soundKit-record">
                    <div class="icon icon-record" onclick="render.record()"></div>
                </div>

                <div class="soundKit-play">
                    <div class="icon icon-play" onclick="render.play()"></div>
                </div>
                
                <div class="soundKit-stop" style="display:none">
                    <div class="icon icon-stop" onclick="render.stop()"></div>
                </div>
            </div>

            <div class="toolbar__item soundKit-metronome">
                <input type="number" value="120" class="soundKit-toolbar-tempo">
                <div class="icon icon-metronome soundKit-metronome-beat"></div>
                <input type="number" value="4" class="soundKit-toolbar-beats">
            </div>

            <div class="toolbar__item">
                <div class="soundKit-save">
                    <div class="icon icon-save"></div>
                </div>

                <div class="soundKit-load">
                    <label for="soundKit-load" class="file-upload">
                        <input type="file" id="soundKit-load">
                        <div class="icon icon-load"></div>
                    </label>
                </div>

                <div class="soundKit-fullscreen">
                    <div class="icon icon-fullscreen"></div>
                </div>
            </div>
        `

        this.initEventListeners()
    }


    initEventListeners() {
        // onPlay
        this.player.on('player.play', _ => this.onPlay() )
        this.player.on('player.record', _ => this.onRecord() )
        this.player.on('player.stop', _ => this.onStop() )
        // onPause
        const tempo = this.element.querySelector('.soundKit-toolbar-tempo')
        const beats = this.element.querySelector('.soundKit-toolbar-beats')
        const metronome = this.metronome;

        // onMetronomeBear
        this.metronome.on('beat', e => this.onBeat(e) )

        //onFullscreen
        this.element.querySelector('.soundKit-fullscreen').addEventListener('click', _ => this.onFullscreen() )
        
        //onSave
        this.element.querySelector('.soundKit-save').addEventListener('click', _ => this.onSave() )
        
        //onLoad
        this.element.querySelector('.soundKit-load').addEventListener('change', _ => this.onLoad() )
        // this.element.querySelector('.soundKit-load', _ => this.onLoad() )


        Array.from([tempo, beats]).forEach( element => {
            element.addEventListener('focusin', () => metronome.play() )
            element.addEventListener('focusout', () => metronome.stop() )
            
            element.addEventListener('change', (e) => {
                metronome.stop()
                metronome.setBeats(parseInt(beats.value))
                metronome.setTempo(parseInt(tempo.value))
                metronome.play()
            })
        })
    }

    onPlay() {
        this.element.querySelector('.soundKit-play').style.display = 'none'
        this.element.querySelector('.soundKit-record').style.display = 'none'
        this.element.querySelector('.soundKit-stop').style.display = ''
    }

    onStop() {
        this.element.querySelector('.soundKit-play').style.display = ''
        this.element.querySelector('.soundKit-record').style.display = ''
        this.element.querySelector('.soundKit-stop').style.display = 'none'
    }

    onRecord() {
        this.element.querySelector('.soundKit-play').style.display = 'none'
        this.element.querySelector('.soundKit-record').style.display = 'none'
        this.element.querySelector('.soundKit-stop').style.display = ''
    }

    onSave() {
        this.player.save('SoundKit', FileStorage)
    }

    onLoad() {
        const input = this.element.querySelector('.soundKit-load input')
        const reader = new FileReader()

        reader.onload = _ => {
            try {
                const json = JSON.parse(reader.result)
                FileStorage.file(json)

                this.player.load('fs', FileStorage)
            } catch(e) {
                console.error(e)
            }
        }

        reader.readAsText(input.files[0])
    }

    onFullscreen() {
        const body = document.body
        const icon = this.element.querySelector('.soundKit-fullscreen .icon')

        if(document.fullscreen || (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
            document.exitFullscreen()
            icon.classList.remove('active')
        } else {
            if (body.requestFullscreen) {
                body.requestFullscreen()
            } else if (body.mozRequestFullScreen) { /* Firefox */
                body.mozRequestFullScreen()
            } else if (body.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                body.webkitRequestFullscreen()
            } else if (body.msRequestFullscreen) { /* IE/Edge */
                body.msRequestFullscreen()
            }
            icon.classList.add('active')
        }
    }

    onBeat(e) {
        const icon = this.element.querySelector('.soundKit-metronome-beat')
        
        if (e.beat == 1) {
            icon.style.backgroundSize = '100%'
        } else {
            icon.style.backgroundSize = `${100 - 40 * (e.beat / e.beats)}%` 
        }
    }

}

export default ToolbarRender