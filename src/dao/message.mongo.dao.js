import { BaseDAO } from "./base.dao.js";
import { Message } from '../models/message.model.js'

export class MessageMongoDAO extends BaseDAO {
    constructor() {super(Message)}

    async findAll() {
        return await this.model.find({}).sort({ createdAt: 1 }).lean()
    }

    async findByWord(filter) {
        return await this.model.find(filter).lean()
    }
}

export const messageMongoDAO = new MessageMongoDAO()