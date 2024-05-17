const WebSocket = require('ws');
const wsPort = 8080;
const wss = new WebSocket.Server({ port: 8080 });
const db = require('./database').config;
const messageModel = require('../models/messageModel');

wss.on('connection', (ws) => {
	ws.chat = {
		id: null,
		chatType: null,
	};
	ws.on('message', (message) => {
		// console.log(`Received message => ${message}`);
		let msg = JSON.parse(message);
		if (msg.joinRoom) {
			ws.chat.chatType = 'room';
			ws.chat.id = msg.joinRoom;
			// console.log('Joining Room: ' + ws.chat.id);
		}
		if (msg.joinChat) {
			ws.chat.chatType = 'chat';
			ws.chat.id = msg.joinChat;
			// console.log('Joining chat: ' + ws.chat.id);
		}

		if (msg.sender && msg.message && ws.chat.chatType && ws.chat.id) {
			const data = {
				sender: msg.sender,
				message: msg.message,
				time: new Date(),
				chat: ws.chat,
			};
			if (ws.chat.chatType === 'chat') saveMessage(ws.chat.id, msg.sender, msg.message);
			websocketSendToAll(JSON.stringify(data));
		}
	});
	ws.send(JSON.stringify({ message: 'Connected to server...' }));
});

function saveMessage(chatId, sender, message) {
	messageModel.createMessage(chatId, sender, message);
}

function websocketSendToAll(text) {
	wss.clients.forEach(function each(client) {
		if (client.readyState === WebSocket.OPEN) {
			if (client.chat.id === JSON.parse(text).chat.id && client.chat.chatType === JSON.parse(text).chat.chatType) {
				client.send(text);
			}
		}
	});
}
