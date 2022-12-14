const socket = io();

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

//Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

//Join chatroom
socket.emit('joinRoom', { username, room });

//Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

//Message from server
socket.on('message', message => {
  outputMessage(message);

  //Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  //Get message text
  const msg = e.target.elements.msg.value;

  //Emit a message to server
  socket.emit('chatMessage', msg);

  //clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

//Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>
  `;
  document.querySelector('.chat-messages').appendChild(div);
};

//Add room name to the DOM
function outputRoomName(room) {
  document.getElementById('room-name').innerText = room;
};

//Add users list to the DOM
function outputUsers(users) {
  let html = '';
  users.forEach(user => {
    html += `
      <li>${user.username}</li>
    `;
  });
  document.getElementById('users').innerHTML = html;

  // document.getElementById('users').innerHTML = `
  //   ${users.map(user => `<li>${user.username}</li>`).join('')}
  // `;
};