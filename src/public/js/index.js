const connectedUsers = document.getElementById('connectedUsers')
const currentUsername = document.getElementById('currentUsername')
const msjList = document.getElementById('messages')
const sendBtn = document.getElementById('sendBtn')
const logoutBtn = document.getElementById('logoutBtn')
const messageInput = document.getElementById('messageInput')
const searchInput = document.getElementById('searchInput')
const tecla = 'Enter'

async function init() {
    // 1. Fetch a /api/auth/current para saber quién soy
    const res = await fetch('/api/auth/current')
    const { user } = await res.json()
    const currentUser = user.username
    currentUsername.innerHTML = currentUser

    // 2. Conectar al socket con el token
    const token = localStorage.getItem('token')
    console.log('Token: ', token)
    const socket = io({ auth: { token } })

    // Listen msjList
    socket.on('msjList', (data) => {
        msjList.innerHTML = '';
        data.forEach( chat => {
            const div = document.createElement('div')
            const { user: sender, message, _id } = chat

            const p = document.createElement('p')
            if(sender === currentUser){
                p.innerText = `yo: ${message}`;
            } else {
                p.innerText = `${sender}: ${message}`;
            }
            div.appendChild(p)

            if(chat.user === currentUser) {
                const editBtn = document.createElement('button')
                editBtn.innerText = '✏️'
                editBtn.onclick = () => {
                    const text = prompt('Edit your message:', message)
                    socket.emit('updateMsj', { id: _id, message: text})
                }

                const deleteBtn = document.createElement('button')
                deleteBtn.innerText = '🗑️'
                deleteBtn.onclick = () => {
                if(confirm('¿Seguro que querés borrar este mensaje?')) {
                    socket.emit('deleteMsj', { id: _id })
                    }
                }

                div.appendChild(editBtn)
                div.appendChild(deleteBtn)
            }

            msjList.appendChild(div);
        })
    })

    //Emit Msj with BTN
    sendBtn.addEventListener('click', () => {
        const text = messageInput.value
        socket.emit('msj', { user: currentUser, message: text })
        messageInput.value = ''
    })

    //Emit msj with enter key
    messageInput.addEventListener('keyup', (e) => {
        const { key, target } = e
        if(key === tecla && target.value !== '') {
            socket.emit('msj', { user: currentUser, message: target.value })
            messageInput.value = ''
        }
    })

    //Update users
    socket.on('updateUsers', (user) => {
        connectedUsers.innerHTML = ''
        user.forEach( u => {
            const p = document.createElement('p')
            p.innerHTML = `🟢 ${u.username}`
            connectedUsers.appendChild(p)
        })
    })

    //Logout
    logoutBtn.addEventListener('click', async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        localStorage.removeItem('token')
        window.location.href = '/login'
    })

    //Search
    const searchInput = document.getElementById('searchInput')
    searchInput.addEventListener('keyup', async (e) => {
        if(e.key === tecla && searchInput.value !== '') {
            const res = await fetch(`/api/messages/search?word=${searchInput.value}`)
            const { msj } = await res.json()

            msjList.innerHTML = '';
            msj.forEach( chat => {
                const div = document.createElement('div')
                const { user: sender, message, } = chat

                const p = document.createElement('p')
                if(sender === currentUser){
                    p.innerText = `yo: ${message}`;
                } else {
                    p.innerText = `${sender}: ${message}`;
                }
                div.appendChild(p)
                msjList.appendChild(div);
            })
        }
    }) 
}

init()
