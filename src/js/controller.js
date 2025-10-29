import { ChatModel } from './model.js';
import { ChatView } from './view.js';
import { getBotResponse } from './models/eliza.js';
import { getGeminiResponse } from './models/gemini.js';

export class ChatController {
    constructor() {
        this.model = new ChatModel();
        this.view = new ChatView(this);

        // adding || [] for debugging
        this.model.addObserver((messages) => {
            this.view.update(messages || []);
        });

        // sat up view at first with current messages
        this.view.update(this.model.messages || []);
    }


    handleSendMessage() {
        const messageText = this.view.getInputText();

        this.model.createMessage(messageText, true);
        this.view.clearInput();
        this.model.createMessage(this.getModelResponse(messageText), false);
    }

    handleEditMessage(messageId) {
        const message = this.model.getMessage(messageId);
        if (!message || !message.isUser) {
            this.view.showError('error editing message');
            return;
        }

        this.view.editingMessageId = messageId;
        this.view.update(this.model.messages);
    }

    handleSaveEdit(messageId, newText) {
        const updated = this.model.updateMessage(messageId, newText);
        if (updated) {
            this.view.editingMessageId = null;
            this.view.update(this.model.messages);
            this.view.showSuccess('updated message!');
        } else {
            this.view.showError('error updating message');
        }
    }

    // Handle canceling edit
    handleCancelEdit(messageId) {
        this.view.editingMessageId = null;
        this.view.update(this.model.messages);
    }

    handleExport() {
        const data = this.model.exportData();
        const filename = `export-${new Date().toISOString()}.json`;

        this.view.downloadFile(data, filename);
    }

    handleImport() {
        // this is just simpler, just virtually click the input so bring up the file selector
        this.view.fileInput.click();
    }

    handleFileSelected(file) {
        if (!file || !file.name.toLowerCase().endsWith('.json'))
            return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const success = this.model.importData(e.target.result);
                if (success) {
                    this.view.update(this.model.messages);
                    this.view.showSuccess('imported chat!');
                } else {
                    this.view.showError('error importing chat');
                }
            } catch (error) {
                this.view.showError('error importing chat');
            }
        };

        reader.readAsText(file);
        // reset input box
        this.view.fileInput.value = '';
    }


    // Handle deleting a message
    handleDeleteMessage(messageId) {
        const message = this.model.getMessage(messageId);
        if (!message) {
            this.view.showError('error deleting message');
            return;
        }

        this.view.showConfirmationAlert(
            'are you sure you want to delete?',
            () => { }, // do nothign if canceled
            () => {
                const deleted = this.model.deleteMessage(messageId);
                if (deleted)
                    this.view.showSuccess('message deleted');
                else
                    this.view.showError('error deleting message');
            }
        );
    }

    // clear all messages
    handleClear() {
        this.view.showConfirmationAlert(
            `are you sure you want to delete all ${this.model.getMessageCount()} messages? no backsies!`,
            () => { },
            () => {
                this.model.deleteAllMessages();
                this.view.update(this.model.messages);
            }
        );
    }


    // get response from appropriate model
    getModelResponse(text) {
        if (this.model.getCurrentModel() == 'eliza') {
            return getBotResponse(text);
        } else if (this.model.getCurrentModel() == 'gemini') {
            return getGeminiResponse(text, this.model.getApiKey());
        }
    }

    // handle model change

    handleModelChange(modelName) {
        this.model.setCurrentModel(modelName);
        if (this.model.getCurrentModel() == 'gemini') {
            console.log(this.model.getCurrentModel());

            if (this.model.apiKey == '')
                // ask for api key
                this.view.askForApiKey(
                    () => {
                        this.view.showError("invalid api key!");
                        this.handleModelChange('eliza');
                    },
                    (key) => {
                        this.model.setApiKey(key);
                    }
                )
        }
    }
}
