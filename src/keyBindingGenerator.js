/* default key order, used by keyBinding generator */
const defaultKeyOrder = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
    'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
    'z', 'x', 'c', 'v', 'b', 'n', 'm'
]

/* default keyGenerator, returns charCodes of strings from given array with given order */
function* keyBinding( order = defaultKeyOrder ) {
    let index = -1;

    while(index++ < order.length) {
        yield order[index].charCodeAt()
    }

}

/* class used to return unique charCode key in every time when get() is called */
class keyBindingGenerator {

    constructor( generator = keyBinding ) {
        this.generator = generator()
        this.generatedKeys = []
    }

    /* add key in use */
    used( charCode ) {
        this.generatedKeys.push(charCode)
    }

    /* generate new key */
    get() {
        let generatedKey = { value: null }

        do{
            generatedKey = this.generator.next()
        } while ( 
            this.generatedKeys.includes(generatedKey.value) 
            && !generatedKey.done 
        )

        generatedKey != null && this.used(generatedKey.value)
        
        return generatedKey.value
    }
}


export const defaultGenerator = keyBinding 
export default keyBindingGenerator