import { UserRepository } from "../repositories/user.repository.js"
import { toCreateUserDTO } from '../models/dto/user.dto.js'
import bcrypt from 'bcrypt'

export class UserService {
    constructor(repository = new UserRepository()) {
        this.repository = repository
    }

    async register(data) {
        const dto = toCreateUserDTO(data)
        const exists = await this.repository.findByEmail(dto.email)
        if (exists) throw new Error('Mail in use')
        if (dto.age < 16) throw new Error('You must be at least 16 years old');
        const hash = await bcrypt.hash(dto.password, 10)

        return await this.repository.create({...dto, password: hash})
    }

    async login(email, password) {
        if(!email || !password) throw new Error('All fields are mandatory');
        
        const user = await this.repository.findByEmail(email)
        if(!user) throw new Error('Invalid Email');

        const pwd = await bcrypt.compare(password, user.password)
        if(!pwd) throw new Error('Invalid Password');

        return user
    }

    async current(id) {
        const user = await this.repository.findById(id)
        if(!user) throw new Error('User not founded');

        return user        
    }

    async update(id, data) {
        const user = await this.repository.findById(id)
        if(!user) throw new Error('User not founded');
        if(data.password) {
            data.password = await bcrypt.hash(data.password, 10)
        }

        return await this.repository.update(id, data)
    }

    async delete(id) {
        const user = await this.repository.findById(id)
        if(!user) throw new Error('User not founded');

        return await this.repository.delete(id)
    }
}

export const userService = new UserService()