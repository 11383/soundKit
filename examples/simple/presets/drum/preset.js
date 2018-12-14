const path = (name) => `./presets/drum/${name}.wav`

export default [
    {charCode: '49', name: "boom", path: path('boom') },
    {charCode: '50', name: "clap", path: path('clap') },
    {charCode: '51', name: "hithat", path: path('hihat') },
    {charCode: '52', name: "kick", path: path('kick') },
    {charCode: '53', name: "openhat", path: path('openhat') },
    {charCode: '54', name: "ride", path: path('ride') },
    {charCode: '55', name: "snare", path: path('snare') },
    {charCode: '56', name: "tink", path: path('tink') },
    {charCode: '57', name: "tom", path: path('tom') },
]