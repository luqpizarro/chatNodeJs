// DTO de entrada: valida y filtra lo que llega al crear un usuario
export function toCreateUserDTO(body) {
    const { username, email, password, age, role } = body ?? {}

    if (!username || !email || !password || !age || isNaN(Number(age)) || Number(age) < 16) {
        throw new Error('All fields are mandatory')
    }
    return {
        username: String(username).trim(),
        email: String(email).trim().toLowerCase(),
        password,
        age: Number(age),
        role: role || 'user'
    }
}

// DTO de salida: filtra lo que se devuelve al cliente (sin datos sensibles)
export function toUserResponseDTO(user) {
    return {
        _id: user._id,
        username: user.username,
        email: user.email,
        age: user.age,
        role: user.role
    }
}