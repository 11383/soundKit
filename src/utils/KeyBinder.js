/* default key order, used by keyBinder */
const defaultKeyOrder = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
    'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
    'z', 'x', 'c', 'v', 'b', 'n', 'm'
]

class KeyBinder {
    constructor(scheme = defaultKeyOrder) {
        return scheme.map(key => key.charCodeAt())
    }
}

export default KeyBinder