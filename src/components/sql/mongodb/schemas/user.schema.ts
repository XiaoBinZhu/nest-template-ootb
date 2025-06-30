import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, trim: true, unique: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: false })
    nickName: string;

    @Prop({ unique: true })
    email: string;

    @Prop({ unique: true })
    phoneNumber: string;

    @Prop({ default: '0' })
    sex: string;

    @Prop({ default: '' })
    avatar: string;

    @Prop({ min: 0, max: 100 })
    age: number;

    @Prop({ default: '0' })
    status: string;

    @Prop({ default: '' })
    loginIp: string;

    @Prop()
    loginDate: Date;

    @Prop({ default: Date.now })
    createBy: Date;

    @Prop({ default: Date.now })
    updateBy: Date;

    @Prop({ type: [String], default: ['admin'] })
    roles: string[];

    @Prop({ type: [String], default: ['admin'] })
    permissions: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);