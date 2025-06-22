'use strict'

import DOMPurify from 'dompurify'

document.addEventListener('DOMContentLoaded', runAll)

let loggedUser

function signIn() {
    document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            fetch(import.meta.env.VITE_BACKEND + 'user/read', {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: document.getElementById('username').value,
                    pass: document.getElementById('password').value,
                }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Response was not ok')
                    }
                    return response.json()
                })
                .then((loggedIn) => {
                    loggedUser = loggedIn
                    document.getElementById('signedOut').style.display = 'none'
                })
        }
    })
}

let currentInterval = null

function populateUsers(allUsers) {
    for (let x of allUsers) {
        const user = document.createElement('div')
        user.innerText = x
        user.id = x
        user.classList.add('user')
        const send = document.createElement('input')
        send.placeholder = 'Send a message...'
        send.autocomplete = 'off'
        send.id = 'send' + x
        send.classList = 'send'
        document.getElementById('sidebar').appendChild(user)
        document.getElementById('contentArea').appendChild(send)
        user.addEventListener('click', () => {
            const userSelect = document.getElementsByClassName('user')
            for (let i = 0; i < userSelect.length; i++) {
                userSelect[i].classList.remove('active')
                document.getElementsByClassName('send')[i].style.display =
                    'none'
            }
            user.classList.add('active')
            document.getElementById('send' + x).style.display = 'flex'
            document.getElementById('chatHeader').innerText = user.innerText
            document.getElementById('chatHeader').style.display = 'flex'
            loadMessages(x)
            // Clear previous interval
            if (currentInterval) clearInterval(currentInterval)
            // Start a new interval for the selected user
            currentInterval = setInterval(() => loadMessages(x), 30000)
            document.getElementById('send' + x).focus()
        })
    }
}

function loadUsers() {
    fetch(import.meta.env.VITE_BACKEND + 'user/readAll', { method: 'GET' })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Response was not ok')
            }
            return response.json()
        })
        .then((allUsers) => {
            populateUsers(allUsers)
        })
}

function populateMgs(allMsgs) {
    document.getElementById('chatHistory').innerHTML = ''
    if (allMsgs.length > 0) {
        for (let i = 0; i < allMsgs.length; i++) {
            let msg = document.createElement('div')
            if (allMsgs[i].sender === loggedUser) {
                msg.innerHTML = DOMPurify.sanitize(allMsgs[i].message, {
                    ALLOWED_TAGS: ['b', 'i', 'a'],
                })
                msg.classList.add('sending')
            } else {
                msg.innerHTML = DOMPurify.sanitize(allMsgs[i].message, {
                    ALLOWED_TAGS: ['b', 'i', 'a'],
                })
                msg.classList.add('receiving')
            }
            document.getElementById('chatHistory').appendChild(msg)
        }
    } else {
        const first = document.createElement('div')
        first.innerText = 'Start a Conversation'
        first.classList.add('idleScreen')
        document.getElementById('chatHistory').appendChild(first)
    }

    document.getElementById('chatHistory').scrollTop =
        document.getElementById('chatHistory').scrollHeight
}

function loadMessages(name) {
    let convoId = [name, loggedUser].sort()
    fetch(
        import.meta.env.VITE_BACKEND +
            'chat/read?conversationId=' +
            `${convoId[0]}_${convoId[1]}`,
        {
            method: 'GET',
        }
    )
        .then((response) => {
            if (!response.ok) {
                throw new Error('Response was not ok')
            }
            return response.json()
        })
        .then((allMsgs) => {
            populateMgs(allMsgs, name)
        })
}

function sendMsg() {
    const activeUser = document.querySelector('.user.active')
    if (!activeUser) return
    const name = activeUser.id
    let convoId = [name, loggedUser].sort()
    const input = document.getElementById('send' + name)
    if (!input || input.value.trim() === '') return
    const match = input.value.match(/https?:\/\/www.youtube.com[^\s]+/g)
    for (let i = 0; i < match.length; i++) {
        const send = document.createElement('iframe')
        send.src = match[i]
        document.getElementById('sidebar').appendChild(send)
    }
    fetch(import.meta.env.VITE_BACKEND + 'chat/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: input.value.trim(),
            conversationId: `${convoId[0]}_${convoId[1]}`,
            receiver: name,
            sender: loggedUser,
        }),
    }).then((response) => {
        if (!response.ok) throw new Error('Response was not ok')
        input.value = ''
        loadMessages(name)
        return response.json()
    })
}

function runAll() {
    signIn()
    loadUsers()
    document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            if (loggedUser) {
                sendMsg()
            }
        }
    })
}
