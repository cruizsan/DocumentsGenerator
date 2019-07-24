"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const documents_1 = require("./documents/model/documents");
const documents_module_1 = require("./documents/documents.module");
require('dotenv').config();
let typeormconfig = null;
if (process.env.TYPEORM_HOST === 'mysql') {
    typeormconfig = typeorm_1.TypeOrmModule.forRoot({
        type: 'mysql',
        host: process.env.TYPEORM_HOST,
        username: process.env.TYPEORM_USERNAME,
        password: process.env.TYPEORM_PASSWORD,
        database: process.env.TYPEORM_DATABASE,
        port: parseInt(process.env.TYPEORM_PORT),
        logging: process.env.TYPEORM_LOGGING === 'true',
        entities: [
            documents_1.Documents
        ],
        migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN === 'true',
        synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
    });
}
else {
    typeormconfig = typeorm_1.TypeOrmModule.forRoot({
        type: 'sqlite',
        database: process.env.TYPEORM_DATABASE || 'db.sqlite',
        logging: process.env.TYPEORM_LOGGING === 'true',
        entities: [
            documents_1.Documents
        ],
        migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN === 'true',
        synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
    });
}
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            typeormconfig,
            documents_module_1.DocumentsModule
        ]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map