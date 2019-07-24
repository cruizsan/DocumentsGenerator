import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Documents} from "./documents/model/documents";
import {DocumentsModule} from "./documents/documents.module";
require('dotenv').config();

let typeormconfig = null;

if(process.env.TYPEORM_TYPE === 'mysql'){
    typeormconfig = TypeOrmModule.forRoot({
        type: 'mysql',
        host: process.env.TYPEORM_HOST,
        username: process.env.TYPEORM_USERNAME,
        password: process.env.TYPEORM_PASSWORD,
        database: process.env.TYPEORM_DATABASE,
        port: parseInt(process.env.TYPEORM_PORT),
        logging: process.env.TYPEORM_LOGGING === 'true',
        entities: [
            Documents
        ],
        migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN === 'true',
        synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
    });
}else{
    typeormconfig = TypeOrmModule.forRoot({
        type: 'sqlite',
        database: process.env.TYPEORM_DATABASE || 'db.sqlite',
        logging: process.env.TYPEORM_LOGGING ? process.env.TYPEORM_LOGGING === 'true' : true,
        entities: [
            Documents
        ],
        migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN ? process.env.TYPEORM_MIGRATIONS_RUN === 'true' : true,
        synchronize: process.env.TYPEORM_SYNCHRONIZE ? process.env.TYPEORM_SYNCHRONIZE === 'true' : true,
    });
}


@Module({
    imports: [
        typeormconfig,
        DocumentsModule
    ]

})
export class AppModule {}
