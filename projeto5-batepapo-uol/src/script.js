let nameUser = "";


let newMessages = [undefined];
let oldMessages = [];
let messageCompareCounter = undefined;

let input = document.getElementById("inputText");

input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("inputSend").click();
    }
});

const chat = document.querySelector(".mensagens");

let searchInterval = setInterval(searchData, 3000);
let pingUserInterval = setInterval(locateUser, 5000);

function callUser() {
    nameUser = document.querySelector('.info-login input').value
    verifyUser();
    searchData();
}

function verifyUser() {
    const userObject = {
        name: nameUser
    };

    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", userObject);
    document.querySelector('header').classList.remove('hidden')
    document.querySelector('main').classList.remove('hidden')
    document.querySelector('footer').classList.remove('hidden')
    document.querySelector('section').classList.add('hidden')

    promise.catch(duplicateUser)
}


function duplicateUser(error) {
    const locateError = parseInt(error.response.status);

    if (locateError !== 200) {
        nameUser = prompt("Este nome de usuário já está em uso, utilize outro.");
        verifyUser();
    }
}


function locateUser() {
    const userObject = {
        name: nameUser
    };

    const confirmActivity = axios.post('https://mock-api.driven.com.br/api/v4/uol/status', userObject)
}


function searchData() {
    const chatData = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    chatData.then(renderChatData);
}


function renderChatData(info) {
    let message = document.querySelector('.mensagens');

    let username = null;
    let target = null;
    let sentText = null;
    let type = null;
    let time = null;

    newMessages = info.data;

    messageCompareCounter = 0;
    for (let i = 0; i < newMessages.length; i++) {
        if (newMessages[i] === oldMessages[i]) {
            messageCompareCounter++;
        }
    }
    
    // Não consigo testar a condicional, muita gente logando o tempo todo.
    if (newMessages.length !== messageCompareCounter) {
        chat.innerHTML = "";

        for (let i = 0; i < 100; i++) {
            username = info.data[i].from;
            target = info.data[i].to;
            sentText = info.data[i].text;
            type = info.data[i].type;
            time = info.data[i].time;
    
            if (type === 'status') {
                chat.innerHTML += `<div class="${type} mensagem"><p> <span class="time">(${time})</span> <span><strong>${username}</strong></span> <span>${sentText}</span> </p></div>`
            } else if (type === "message") {
                chat.innerHTML += `<div class="${type} mensagem"><p> <span class="time">(${time})</span> <span><strong>${username}</strong> para <strong>${target}</strong>:</span> <span>${sentText}</span> </p></div>`
            } else if (target === nameUser) {
                chat.innerHTML += `<div class="${type} mensagem" data-identifier="message"><p> <span class="time">(${time})</span> <span><strong>${username}</strong> reservadamente para <strong>${target}</strong>:</span> <span>${sentText}</span> </p></div>`
            }
            message.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
        }
        
    }
    oldMessages = newMessages;
}


function sendMessage() {
    
    let messageLocation = document.querySelector('.messageInput');
    let messageInput = messageLocation.value
    messageSent = {
        from: nameUser,
        to: "Todos",
        text: messageInput,
        type: 'message'
    };
    messageLocation.value = "";

    const sendData = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages', messageSent)
    sendData.catch(relogar);

}


function relogar() {
    alert("Deu xabu, vamos recarregar a página.");
    window.location.reload();
}