// const url = "https://driving-tests.org/dmv-assistant.ai.php";
// let data = [
//   { role: "assistant", content: "Hello user!" },
//   { role: "user", content: "Hello bot!" },
// ];

// let messageBox = document.getElementById("js-bot-message-text");
// let userInput = document.getElementById("js-user-input-message");
// let chatLog = document.getElementById("js-main-conversation");

// document.addEventListener("DOMContentLoaded", (event) => {
//   console.log("DOM полностью загружен и разобран");
//   // let newBotMessage = document.createElement("div");
//   // newBotMessage.className =
//   messageBox.innerHTML =
//     "DOM полностью загружен и разобран <br> DOM полностью загружен и разобран";
// });
// userInput.addEventListener("keydown", (event) => {
//   if (event.key === "Enter") {
//     let userMessagesLog = document.createElement("span");
//     userMessagesLog.textContent = userInput.value;
//     userMessagesLog.className = "user-message-log-text";
//     let userMessageLogContainer = document.createElement("div");
//     userMessageLogContainer.className = "user-message-log";
//     userMessageLogContainer.appendChild(userMessagesLog);
//     chatLog.insertBefore(userMessageLogContainer, null);
//     setTimeout(() => {
//       userInput.value = "";
//       userInput.disabled = true;
//     }, 300);
//     // requestAnswer();
//     addBotMessage("Ssome response from the Bot");
//   }
// });

// function requestAnswer() {
//   fetch(url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// }

// function addBotMessage(data) {
//   let botMessage = document.createElement("div");
//   botMessage.className = "bot-message";

//   let botMessageAvatar = document.createElement("div");
//   botMessageAvatar.className = "bot-message-avatar";

//   let botMessageContainer = document.createElement("div");
//   botMessageContainer.className = "bot-message-container";

//   let botMessageText = document.createElement("div");
//   botMessageText.className = "bot-message-text";
//   botMessageText.textContent = data;

//   botMessageContainer.appendChild(botMessageAvatar);
//   botMessageContainer.appendChild(botMessageText);
//   botMessage.appendChild(botMessageContainer);

//   chatLog.insertBefore(botMessage, null);
  
//   setTimeout(() => {
//     userInput.disabled = false;
//   }, 300);

// }