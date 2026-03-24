import { MessageRepository } from "../repositories/message.repository.js";

export class MessageService {
    constructor(repository = new MessageRepository()) {
        this.repository = repository
    }

    async create(data) {
        if(!data.message) throw new Error('You must write a text');
        
        return await this.repository.create(data)
    }

    async update(id, data) {
        const msj = await this.repository.findById(id)
        if(!msj) throw new Error('Message not found');
        
        return await this.repository.update(id, data)
    }

    async findByWord(word) {
        if(!word) throw new Error('You must provide a word to search');
        
        return await this.repository.findByWord(word)
    }

    async findAll() {
        return this.repository.findAll()
    }

    async delete(id) {
        const msj = await this.repository.findById(id)
        if(!msj) throw new Error('Message not found');

        return await this.repository.delete(id)
    }
}

export const messageService = new MessageService()