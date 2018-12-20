import StorageInterface from './IStorage.js'

class LocalStorage extends StorageInterface {

    static get(name) {
        return JSON.parse(localStorage.getItem(name))
    }

    static set(name, obj) {
        localStorage.setItem(name, JSON.stringify(obj))        
    }

    static remove(name) {
        localStorage.removeItem(name)
    }

    static clear(name) {}

    static clearAll() {}

    static files() {
        return Object.keys(localStorage)
    }
}

export default LocalStorage