const socket = io("http://localhost:8000");

const form = document.getElementById("send-container");
const container = document.querySelector(".container");
const messageInp = document.getElementById("messageInp");
const audio = new Audio("IPhone-SMS-Tone-Original-Notification-tone.mp3");

const userName = prompt("Enter your name to join whatsapp chat");
const append = (message, time, position) => {
  const messageElement = document.createElement("div");
  const timeElement = document.createElement("i");
  timeElement.classList.add("time");
  timeElement.innerText = time;
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageElement.appendChild(timeElement);
  container.append(messageElement);

  if (position == "left") {
    audio.play();
  }
};
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInp.value;
  if (!message == "") {
    var date = new Date();
    const time = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    append(`You:${message}`, `${time}`, "right");
    socket.emit("send", message);
    messageInp.value = "";
  }
});
socket.emit("new-user-joined", userName);
socket.on("user-joined", (name) => {
  var date = new Date();
  const time = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  append(`${name} joined the chat`, `${time}`, "right");
});
socket.on("receive", (data) => {
  var date = new Date();
  const time = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  append(`${data.name}:${data.message}`, `${time}`, "left");
});
socket.on("left", (name) => {
  var date = new Date();
  const time = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  append(`${name} has left the chat`, `${time}`, "right");
  audio.play();
});
