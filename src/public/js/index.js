const socket = io()
const box = document.getElementById('box')
const app = document.getElementById('app-chat')
const welcome = document.getElementById('welcome')
const connectedUsers = document.getElementById("connected-user")
const tecla = 'Enter'
let user = '';

app.style.display = 'none'
Swal.fire({
    title: 'Quien sos?',
    input: 'text',
    text: 'Ingresa un nombre para identificarte',
    allowOutsideClick: false,
    inputValidator: (value) => {
        return !value && 'Ingresa tu nombre para poder entrar'
    }
}).then ( name => {
    user = name.value
    console.log(user)
    socket.emit('userList', user)

    app.style.display = 'block'
    welcome.innerHTML = `Bienvenide al chat ${user}`
});

socket.on('updateUsers', (usuario) =>{
    connectedUsers.innerHTML = ''
    usuario.forEach( u => {
        const p = document.createElement('p')
        p.innerHTML = u.data
        connectedUsers.appendChild(p)
    })
})

box.addEventListener('keyup', (e) =>{
    const { key, target } = e;
    if(key === tecla && target.value !== ''){
        socket.emit('msj', {user, msj: target.value});
        box.value = '';
    }
})

socket.on('msjList', (data) => {
    app.innerHTML = '';
    data.forEach( chat => {
        const { user: sender, msj } = chat
        const p = document.createElement('p')
        if(sender === user){
            p.innerText = `yo: ${msj}`;
        } else {
            p.innerText = `${sender}: ${msj}`;
        }
        app.appendChild(p);
    })
})

socket.on('userList', (data) => {
    console.log('usuarios conectados', data)
    connectedUsers.innerHTML = ''
    data.forEach( u => {
        const p = document.createElement('p')
        p.innerHTML = u.data
        connectedUsers.appendChild(p)
    })
})