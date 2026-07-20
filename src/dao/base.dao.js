export class BaseDAO {
    constructor(model) {this.model = model}

    async create(data) {return await this.model.create(data)};
    async getById(id) {return await this.model.findById(id).lean()}
    async updateById(id, data) {return await this.model.findByIdAndUpdate(id, data, {new: true, runValidators: true}).lean()}
    async deleteById(id) {return await this.model.findByIdAndDelete(id)}
}