
// main model handles data storage, formatting, and message model
export class ChatModel {

    constructor() {
        this.messages = [];
        this.observers = [];
        this.storageKey = 'chat-messages-data';
        this.currentModel = 'eliza';
        this.apiKey = '';
        this.loadFromLocalStorage();
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(observer) {
        this.observers = this.observers.filter(o => o !== observer);
    }

    notifyObservers() {
        this.observers.forEach(observer => { observer(this.messages) });
    }

    // make unique id for each message
    generateMessageId() {
        return crypto.randomUUID();
    }

    /**
     * create new message
     * (string) text, (bool) isUser
     * returns (objcet) message
    */
    createMessage(text, isUser = true) {
        // main message model
        const message = {
            id: this.generateMessageId(),
            timestamp: new Date().toISOString(),
            text: text,
            isUser: isUser,
            edited: false
        };

        this.messages.push(message);
        this.saveToLocalStorage();
        this.notifyObservers();
        return message;
    }

    // gets one message by id
    getMessage(id) {
        return this.messages.find(msg => msg.id == id) || null;
    }

    /* update message (for editing)
    * (string) id, (string) newText
    * returns the edited message
    */
    updateMessage(id, newText) {
        const message = this.messages.find(msg => msg.id == id);
        if (!message || !message.isUser)
            return null;

        message.text = newText;
        message.edited = true;
        message.lastEdited = new Date().toISOString();

        this.saveToLocalStorage();
        this.notifyObservers();

        return message;
    }

    // delete message (string) id
    deleteMessage(id) {
        const index = this.messages.findIndex(msg => msg.id == id);
        if (index == -1)
            return false;

        this.messages.splice(index, 1);
        this.saveToLocalStorage();
        this.notifyObservers();

        return true;
    }

    // delete all messages
    deleteAllMessages() {
        this.messages = [];
        this.saveToLocalStorage();
        this.notifyObservers();
    }

    // get message count
    getMessageCount() {
        return this.messages.length;
    }

    // save to local storage
    saveToLocalStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.messages));
            localStorage.setItem(this.storageKey + '-timestamp', new Date().toISOString());
        } catch (error) {
            console.error('couldnt save to localstorage: ', error);
        }
    }

    // load from local storage
    loadFromLocalStorage() {
        try {
            const storageData = localStorage.getItem(this.storageKey);
            if (!storageData) {
                this.messages = [];
                return;
            }

            const data = JSON.parse(storageData);
            if (!data) {
                throw new Error('data invalid or empty');
            }

            this.messages = Array.isArray(data) ? data : data.messages;

        } catch (error) {
            console.error('couldnt load from localstorage:', error);
            this.messages = [];
        }
    }

    // just return data as string, then controller will handle actual exporting
    exportData() {
        return JSON.stringify(this.messages);
    }

    // import as json
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);

            if (!data)
                throw new Error('data empty or invalid');

            // works if its array or not
            this.messages = Array.isArray(data) ? data : data.messages;
            this.saveToLocalStorage();
            this.notifyObservers();
            return true;
        } catch (error) {
            console.error('error importing data:', error);
            return false;
        }
    }

    getCurrentModel() { return this.currentModel };

    setCurrentModel(name) { this.currentModel = name };

    getApiKey() { return this.apiKey }

    setApiKey(key) { this.apiKey = key }
}
