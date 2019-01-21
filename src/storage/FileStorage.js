import StorageInterface from './IStorage.js'

class FileStorage extends StorageInterface {
    
    static file(file) {
        this.file = file
    }

    static get() {
        return this.file
    }

    static set(name, obj) {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", name + ".json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();    
    }

    static remove(name) {}
    static removeAll() {}
    static keys() {}
}

export default FileStorage