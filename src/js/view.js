
// handles all UI and DOM manipulation
export class ChatView {
    constructor(c) {
        this.controller = c;

        // get all ui components by id
        this.chatContainer = document.getElementById('chat-container');
        this.messageInput = document.getElementById('message-input');
        this.chatForm = document.getElementById('chat-area');
        this.messageCount = document.getElementById('message-count');
        this.lastSaved = document.getElementById('last-saved-time');
        this.fileInput = document.getElementById('file-input');
        this.emptyState = document.getElementById('empty-state');

        this.sendButton = document.getElementById('send-button');
        this.exportbutton = document.getElementById('export-button');
        this.importbutton = document.getElementById('import-button');
        this.clearbutton = document.getElementById('clear-button');

        this.modelSelect = document.getElementById('model-select');

        this.setupEventListeners();
    }

    setupEventListeners() {

        // submit and enter key to submit form, same as in lab 6
        this.chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.controller.handleSendMessage();
        });

        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.controller.handleSendMessage();
            }
        });

        // add button event listeners and send to controller functions
        this.exportbutton.addEventListener('click', () => this.controller.handleExport());
        this.importbutton.addEventListener('click', () => this.fileInput.click());
        this.clearbutton.addEventListener('click', () => this.controller.handleClear());

        // model seelct event listener
        this.modelSelect.addEventListener('change', (event) => this.controller.handleModelChange(event.target.value));

        // when anything happens to the fileINput that means a file got selected, so handle that
        this.fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.controller.handleFileSelected(file);
            }
        });
    }

    // update messages (called whenever changed)
    update(messages) {
        this.updateMessages(messages);
        this.updateMessageStats(messages);
        this.updateEmptyState(messages);
    }

    // render all messages (calls createMessageElement for each message)
    updateMessages(messages) {
        // reset
        this.chatContainer.innerHTML = '';

        // create element for each message
        messages.forEach(msg => {
            const messageElement = this.createMessageElement(msg);
            this.chatContainer.appendChild(messageElement);
        });

        // scroll to bottom
        this.chatContainer.scrollTo({
            top: this.chatContainer.scrollHeight,
            behavior: 'smooth'
        });
    }

    // create message in dom
    createMessageElement(message) {
        const isEditing = this.editingMessageId == message.id;

        // clone the appropriate template from html
        const template = document.getElementById(isEditing ? 'edit-template' : 'message-template');
        const messageDiv = template.content.firstElementChild.cloneNode(true);

        messageDiv.className = `message ${message.isUser ? 'user' : 'bot'}`;
        messageDiv.dataset.messageId = message.id;

        // add event listeners depending on if it is editing or not
        if (isEditing) {
            const input = messageDiv.querySelector('.edit-input');
            input.value = message.text;

            // hook up event listeners
            messageDiv.querySelector('.edit-button')
                .addEventListener('click', () => this.controller.handleSaveEdit(message.id, input.value));
            messageDiv.querySelector('.cancel-button')
                .addEventListener('click', () => this.controller.handleCancelEdit(message.id));
        } else {
            const messageContent = messageDiv.querySelector('.message-content');
            messageContent.querySelector('.message-text').textContent = message.text;
            // set metadata to have (edited) if edited
            messageContent.querySelector('.message-metadata').textContent =
                `${new Date(message.timestamp).toLocaleTimeString()}${message.edited ? ' (edited)' : ''}`;

            // add message action button listeners
            if (message.isUser) {
                messageContent.querySelector('.edit-button')
                    .addEventListener('click', () => this.controller.handleEditMessage(message.id));
                messageContent.querySelector('.delete-button')
                    .addEventListener('click', () => this.controller.handleDeleteMessage(message.id));
            } else {
                // hide actions if its a bot message
                messageContent.querySelector('.message-actions').remove();
            }
        }

        return messageDiv;
    }


    // update stats for messages
    updateMessageStats(messages) {
        this.messageCount.textContent = `Number of Messages: ${messages.length}`;

        const lastSavedRaw = localStorage.getItem('chat-messages-data-timestamp');
        if (lastSavedRaw)
            this.lastSaved.textContent = `Last saved: ${new Date(lastSavedRaw).toLocaleString()}`;
        else
            this.lastSaved.textContent = 'Never saved chat';
    }

    // update empty state to disappear when theres not 0 messsages
    updateEmptyState(messages) {
        if (messages.length === 0)
            this.emptyState.style.display = 'block';
        else
            this.emptyState.style.display = 'none';
    }


    // get input text
    getInputText() {
        return this.messageInput.value;
    }

    // clear input text
    clearInput() {
        this.messageInput.value = '';
        this.messageInput.focus();
    }

    // set input text
    setInputText(text) {
        this.messageInput.value = value;
    }

    // download file JSON
    downloadFile(data, filename) {
        // from my research we should use a blob here for sure, but we didnt learn about that in class, hope im doing this right
        const blob = new Blob(
            [data],
            { type: 'application/json' }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    }

    // show confirmation alert with option cancel or accept
    showConfirmationAlert(message, onCancel, onConfirm) {
        // use confrim instead of alert
        const confirmed = confirm(message);
        if (confirmed) {
            onConfirm();
        } else {
            onCancel();
        }
    }

    // show either error or success (we'll probably want to call alerts from other modules, but only view.js should handle this)
    showError(message) {
        alert(`error: ${message}`);
    }

    showSuccess(message) {
        alert(`success: ${message}`);
    }

    // get api key by alert (simplest way)
    askForApiKey(onCancel, onConfirm) {
        const apiKey = prompt("Enter Gemini API Key!: ");
        if (apiKey) {
            onConfirm(apiKey.trim());
        } else {
            onCancel();
        }
    }

}
