"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const documents_1 = require("../model/documents");
const platform_express_1 = require("@nestjs/platform-express");
const documents_service_1 = require("../service/documents.service");
const json_generate_pipe_1 = require("../pipes/json.generate.pipe");
const swagger_1 = require("@nestjs/swagger");
let DocumentsController = class DocumentsController {
    constructor(documentsService) {
        this.documentsService = documentsService;
    }
    getDocumentById(id) {
        return this.documentsService.findById(id);
    }
    getDocuments() {
        return this.documentsService.findAll();
    }
    createDocument(file) {
        let document = new documents_1.Documents();
        console.log(file);
        document.name = file.filename;
        document.originalname = file.originalname;
        document.path = file.path;
        return this.documentsService.createDocument(document);
    }
    updateDocument() {
        throw new common_1.NotImplementedException();
    }
    deleteDocument(id) {
        return this.documentsService.deleteById(id);
    }
    generateDocument(jsonData, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.documentsService.handleGenerateDocument(jsonData);
            if (result) {
                res.setHeader('Content-Type', result.mimetype);
                res.setHeader('Content-disposition', 'attachment; filename=' + result.name);
                res.write(result.buffer, 'binary');
                res.end(null, 'binary');
            }
            return;
        });
    }
};
__decorate([
    swagger_1.ApiOperation({ title: 'get template by id' }),
    swagger_1.ApiImplicitParam({ name: "id", description: "id of my template", required: true, type: Number }),
    common_1.Get(':id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "getDocumentById", null);
__decorate([
    swagger_1.ApiOperation({ title: 'get all templates' }),
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "getDocuments", null);
__decorate([
    swagger_1.ApiOperation({ title: 'upload a template' }),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('file')),
    common_1.Post(),
    __param(0, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "createDocument", null);
__decorate([
    swagger_1.ApiNotImplementedResponse({}),
    common_1.Put(),
    common_1.Patch(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "updateDocument", null);
__decorate([
    swagger_1.ApiOperation({ title: 'delete template by id' }),
    swagger_1.ApiImplicitParam({ name: "id", description: "id of my template", required: true, type: Number }),
    common_1.Delete(':id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "deleteDocument", null);
__decorate([
    swagger_1.ApiOperation({ title: 'generate document from a template and data' }),
    swagger_1.ApiImplicitBody({ name: "", description: "data for my template", required: true, type: Object }),
    common_1.Post('generate'),
    __param(0, common_1.Body(new json_generate_pipe_1.JsonGeneratePipe())),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "generateDocument", null);
DocumentsController = __decorate([
    swagger_1.ApiUseTags('documents'),
    common_1.Controller('documents'),
    __metadata("design:paramtypes", [documents_service_1.DocumentsService])
], DocumentsController);
exports.DocumentsController = DocumentsController;
//# sourceMappingURL=documents.controller.js.map