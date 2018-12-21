class EventEmitter {
    constructor() {
        this.events = []
    }

    on(eventName, callback) {
        !this.events[eventName] && ( this.events[eventName] = [] )

        this.events[eventName].push(callback)
    }

    emit(eventName, ...params) {
        this.events[eventName] 
        && this.events[eventName].map( callback => callback(...params) ) 
    }
}

// share events between modules
export const globalEvents = new EventEmitter() 

// keep events for more "local" scope
export default EventEmitter