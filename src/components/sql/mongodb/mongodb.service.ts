import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model, Schema } from 'mongoose';
import { GenericSchema } from './schemas/generic.schema';
import { UserSchema } from './schemas/user.schema';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class MongodbService {
    private modelCache = new Map<string, Model<any>>();

    constructor(@InjectConnection() private readonly connection: Connection) { }
    private schemaMap: Record<string, Schema> = {
        users: UserSchema
    };

    private getModel(collection: string): Model<any> {
        let model = this.modelCache.get(collection);

        if (!model) {
            const schema = this.schemaMap[collection] || GenericSchema;
            schema.index({ '$**': 'text' });
            model = this.connection.model(collection, schema, collection);
            this.modelCache.set(collection, model);
        }

        return model;
    }
    async create(collection: string, data: Object = {}) {
        const model = this.getModel(collection);
        return model.create(data);
    }

    async findAll(collection: string, data: Object = {}): Promise<any> {
        const model = this.getModel(collection);
        return model
            .find(data);
    }

    async findAllPage(collection: string, query: PaginationDto = { page: 1, limit: 10 }): Promise<any> {
        const model = this.getModel(collection);
        const { page, limit, keyword, fields, filters = {}, sort } = query;
        const skip = (page - 1) * limit;

        // 构建查询条件
        const conditions: any = { ...filters };

        // 模糊查询
        if (keyword && fields?.length) {
            conditions.$or = fields.map(field => ({
                [field]: { $regex: keyword, $options: 'i' }
            }));
        }

        // 构建排序对象
        const sortObj: Record<string, 1 | -1> = {};
        if (sort) {
            sort.split(',').forEach(sortItem => {
                const [field, order] = sortItem.split(':');
                sortObj[field] = order === 'desc' ? -1 : 1;
            });
        }

        // 使用聚合管道实现高性能分页
        const [results, total] = await Promise.all([
            model
                .find(conditions)
                .sort(sortObj)
                .skip(skip)
                .limit(limit),

            model.countDocuments(conditions).exec()
        ]);

        return {
            data: results,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async findOne(collection: string, id: string) {
        const model = this.getModel(collection);
        const result = await model.findById(id);
        if (!result) throw new Error('查找数据不存在');
        return result;
    }

    async update(collection: string, id: string, updateData: Object = {}) {
        const model = this.getModel(collection);
        const updated = await model.findByIdAndUpdate(id, updateData, { new: true });
        if (!updated) throw new Error('更新数据不存在');
        return updated;
    }

    async delete(collection: string, id: string) {
        const model = this.getModel(collection);
        const result = await model.findByIdAndDelete(id);
        if (!result) throw new Error('删除数据不存在');
        return result;
    }
}
