/* Storage Interface */
class IStorage {

    static get(name) {
        throw new Error('method not implemented')
    }

    static set(name, obj) {
        throw new Error('method not implemented')   
    }

    static remove(name) {
        throw new Error('method not implemented')   
    }

    static clear(name) {
        throw new Error('method not implemented')
    }

    static clearAll() {
        throw new Error('method not implemented')   
    }

    static savedFiles() {
        throw new Error('method not implemented')   
    }
}

export default IStorage