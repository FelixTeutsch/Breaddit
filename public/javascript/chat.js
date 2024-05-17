const wsAddress = 'ws://localhost:8080';
const ws = new WebSocket(wsAddress);
const sender = document.getElementById('sender').value;
let messageCounter = 0;

const chat = {
	chatId: -1,
	chatImg: document.getElementById('chat_info_image'),
	chatName: document.getElementsByClassName('chat_info_text'),
	chatMessages: document.getElementById('messages'),
	opened: {
		chatType: null,
		id: '',
	},
};
ws.onopen = function () {
	console.log('websocket is connected ...');
	ws.send(
		JSON.stringify({
			message: 'connected',
		})
	);
};
ws.onmessage = function (ev) {
	const data = JSON.parse(ev.data);
	if (data.sender && data.message) {
		data.timestamp = Date.now();
		createMessageDiv(data);
		chat.chatMessages.prepend(createMessageDiv(data));
		chat.chatMessages.scrollTop = chat.chatMessages.scrollHeight;
		//addTextMessage(data.message, data.sender);
	}
};

function sendMyMessage() {
	let text = document.getElementById('text_input');
	let message = {
		// chat: chat.opened.id,
		sender: sender, // Replace 'Sender Name' with the actual sender's name
		message: text.value,
	};
	text.value = '';
	ws.send(JSON.stringify(message));
}

function joinRoom() {
	let inputField = document.getElementById('room');
	ws.send(
		JSON.stringify({
			joinRoom: inputField.value,
		})
	);
	chat.opened.id = inputField.value;
	chat.chatName[0].innerText = chat.opened.id;
	chat.chatImg.src = '/public/user/group.svg';
	chat.chatImg.style.borderColor = getColorFromString(chat.opened.id);
	inputField.value = '';
	enableInput();
}

function enableInput() {
	let sendButton = document.getElementById('send_button');
	sendButton.disabled = false;
	let inputField = document.getElementById('text_input');
	inputField.disabled = false;
	inputField.placeholder = 'Type a message...';
	inputField.focus();
	inputField.value = '';
	chat.chatMessages.innerHTML = '';
}

function openChat(chat_id, receiver) {
	enableInput();
	chat.chatName[0].innerText = receiver;
	chat.chatImg.src = '/public/user/' + receiver + '_profile.jpg';
	chat.chatImg.style.borderColor = getColorFromString(receiver);
	// JOIN Chat on server
	joinChat(chat_id);
	fetch('/chat/' + chat_id, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) =>
			response.json().then((data) => {
				data.messages.forEach((message) => {
					chat.chatMessages.prepend(createMessageDiv(message));
				});
				chat.scrollTop = chat.scrollHeight;
			})
		)
		.catch((error) => {
			console.log(error);
		});
}

function createMessageDiv(message) {
	message.id ??= messageCounter++;
	// Container
	const messageContainer = document.createElement('div');
	messageContainer.classList.add('messages_message_container');
	messageContainer.innerHTML = `<span class="material-symbols-rounded" onclick = "deleteMessage(${message.id})">delete</span>`;
	if (message.sender !== sender) messageContainer.classList.add('them');
	messageContainer.id = 'message_container_' + message.id;

	// Visual Element
	message.timestamp = new Date(message.timestamp);
	const messageDiv = document.createElement('div');
	messageDiv.classList.add('messages_message');
	messageDiv.id = 'message_' + message.id;
	if (message.sender !== sender) messageDiv.classList.add('them');
	messageDiv.setAttribute('style', 'border-color:' + getColorFromString(message.sender) + ';');
	messageDiv.innerHTML = `
	<div class="message_sender"> <!--<div class="user_color" style="background-color:${getColorFromString(message.sender)}"></div>-->${message.sender}</div>
	<div class="message_content">${message.message}</div>
	<div class="message_time">${message.timestamp.getHours()}:${message.timestamp.getMinutes() < 10 ? 0 : ''}${message.timestamp.getMinutes()}</div>`;
	messageContainer.appendChild(messageDiv);
	return messageContainer;
}

function joinChat(chat_id) {
	ws.send(
		JSON.stringify({
			joinChat: chat_id,
		})
	);
	chat.opened.id = chat_id;
	chat.id = chat_id;
}

function createChat(sender, receiver) {
	fetch('/chat/create', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			user1: sender,
			user2: receiver,
		}),
	}).then((response) =>
		response.json().then((data) => {
			const chatlist = document.getElementById('chat_list_chats');
			let chat = {
				chat_id: data.chat.id,
				receiver: receiver,
				message: {
					message: data.chat.message,
					sender: data.chat.sender,
					time: new Date(data.chat.last_message_timestamp),
				},
			};
			chatlist.innerHTML += `
								<div class="contacts_contact" onclick="openChat('${chat.chat_id}','${chat.receiver}')">
									<div class="contacts_contact_image">
										<img src="/public/user/${chat.receiver}_profile.jpg" alt="" />
									</div>
									<div class="content">
										<div class="content_name">${chat.receiver}</div>
										<div class="content_lastMessage">`;
			if (chat.message.message && chat.message.time)
				chatlist.innerHTML += `<div class="content_last_message_message">
												${chat.message.sender}: ${chat.message.message}
											</div>
											<div class="content_last_message_time">
												${chat.message.time}
											</div>
											`;
			chatlist.innerHTML += '</div></div></div>';

			openChat(chat.chat_id, receiver);
			closeAddList();
		})
	);
}

document.getElementById('text_input').addEventListener('keydown', function (event) {
	if (event.key === 'Enter' && !event.shiftKey) {
		sendMyMessage();
	}
});

function openAddList(username) {
	fetch('/chat/getChatlessUsers', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			username,
		}),
	})
		.then((response) => response.json())
		.then((data) => {
			let addList = document.getElementById('add_list_content');
			addList.innerHTML = '';

			data.forEach((user) => {
				addList.innerHTML += `<div class="contacts_contact" onclick="createChat('${username}', '${user.username}')">
                                            <div class="contacts_contact_image">
                                                <img src="/public/user/${user.username}_profile.jpg" alt="${user.username} Profile Picture" />
                                            </div>
                                            <div class="content">
                                                <div class="content_name">${user.username}</div>
                                            </div>
                                        </div>`;
			});
		});

	const addList = document.getElementById('add_list');
	addList.classList.add('show');
}
function closeAddList() {
	const addList = document.getElementById('add_list');
	addList.classList.remove('show');
}

function deleteMessage(message_id) {
	if (chat.opened.chatType !== 'group')
		fetch('/chat/' + chat.opened.id + '/messages/' + message_id, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				message_id,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				document.getElementById('message_container_' + message_id).remove();
			});
	else document.getElementById('message_container_' + message_id).remove();
}
