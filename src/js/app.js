import { ChatController } from './controller.js';

// main entry point to app, sets up MVC
document.addEventListener('DOMContentLoaded', () => {
    try {
        const chatController = new ChatController();

        console.log('Loaded controller successfully!');

    } catch (error) {
        console.error('App failed at init with error: ', error);
    }
});
