import { Module } from '@nestjs/common';
import {DocumentsController} from "./controller/documents.controller";
import {DocumentsService} from "./service/documents.service";
import {TypeOrmModule} from '@nestjs/typeorm';
import {Documents} from './model/documents';
import {MulterModule} from "@nestjs/platform-express";

@Module({
    imports: [
        TypeOrmModule.forFeature([Documents]),
        MulterModule.register({
            dest: './files',
        })
    ],
    controllers: [DocumentsController],
    providers: [DocumentsService],
})
export class DocumentsModule {}
