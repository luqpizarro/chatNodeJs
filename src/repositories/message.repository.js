import { MessageMongoDAO } from '../dao/message.mongo.dao.js';

export class MessageRepository {
    constructor(dao = new MessageMongoDAO()) {
        this.dao = dao
    };

    async create(data) {return await this.dao.create(data)};
    async findById(id) {return await this.dao.getById(id)};
    async update(id, data) {return await this.dao.updateById(id, data)};
    async delete(id) {return await this.dao.deleteById(id)};
    async findAll() {return await this.dao.findAll()}
    async findByWord(word) {return await this.dao.findByWord({ message: { $regex: word, $options: 'i' } })}
}

export const messageRepository = new MessageRepository();