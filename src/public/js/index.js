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



// app.style.display = 'none'
// Swal.fire({
//     title: 'Quien sos?',
//     input: 'text',
//     text: 'Ingresa un nombre para identificarte',
//     allowOutsideClick: false,
//     inputValidator: (value) => {
//         return !value && 'Ingresa tu nombre para poder entrar'
//     }
// }).then ( name => {
//     user = name.value
//     console.log(user)
//     socket.emit('userList', user)

//     app.style.display = 'block'
//     welcome.innerHTML = `Bienvenide al chat ${user}`
// });

// socket.on('updateUsers', (usuario) =>{
//     connectedUsers.innerHTML = ''
//     usuario.forEach( u => {
//         const p = document.createElement('p')
//         p.innerHTML = u.data
//         connectedUsers.appendChild(p)
//     })
// })

// box.addEventListener('keyup', (e) =>{
//     const { key, target } = e;
//     if(key === tecla && target.value !== ''){
//         socket.emit('msj', {user, msj: target.value});
//         box.value = '';
//     }
// })

// socket.on('msjList', (data) => {
//     app.innerHTML = '';
//     data.forEach( chat => {
//         const { user: sender, msj } = chat
//         const p = document.createElement('p')
//         if(sender === user){
//             p.innerText = `yo: ${msj}`;
//         } else {
//             p.innerText = `${sender}: ${msj}`;
//         }
//         app.appendChild(p);
//     })
// })

// socket.on('userList', (data) => {
//     console.log('usuarios conectados', data)
//     connectedUsers.innerHTML = ''
//     data.forEach( u => {
//         const p = document.createElement('p')
//         p.innerHTML = u.data
//         connectedUsers.appendChild(p)
//     })
// })

// socket.on('userExist', () => {
// app.style.display = 'none'
// Swal.fire({
//     title: 'Usuario Repetido, elije otro',
//     input: 'text',
//     text: 'Ingresa un nombre para identificarte',
//     allowOutsideClick: false,
//     inputValidator: (value) => {
//         return !value && 'Ingresa tu nombre para poder entrar'
//     }
// }).then ( name => {
//     user = name.value
//     console.log(user)
//     socket.emit('userList', user)

//     app.style.display = 'block'
//     welcome.innerHTML = `Bienvenide al chat ${user}`
// });
// })