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
var DocumentsService_1;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const documents_1 = require("../model/documents");
const docx_templates_1 = require("docx-templates");
const mimetype_document_1 = require("../enum/mimetype.document");
const unoconv = require("unoconv-promise");
const tempWrite = require('temp-write');
const JSZip = require("jszip");
const fs = require('fs');
let DocumentsService = DocumentsService_1 = class DocumentsService {
    constructor(documentsRepository) {
        this.documentsRepository = documentsRepository;
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.documentsRepository.find();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.documentsRepository.findOne({
                where: {
                    id: id
                }
            });
        });
    }
    createDocument(document) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.documentsRepository.save(document);
        });
    }
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let document = yield this.findById(id);
                yield this.documentsRepository.remove(document);
                fs.unlinkSync(document.path);
                return document;
            }
            catch (e) {
                return null;
            }
        });
    }
    handleGenerateDocument(jsonData) {
        return __awaiter(this, void 0, void 0, function* () {
            let template = jsonData.template;
            let names = jsonData.names;
            let data = jsonData.data;
            let mimetype = mimetype_document_1.MimetypeDocument.Docx;
            let zipName = null;
            let result = [];
            let zip = null;
            let generateZip = false;
            if (template) {
                let document = yield this.getDocumentByTemplateName(template);
                if (document) {
                    if (!(names instanceof Array)) {
                        names = [names];
                        data = [data];
                    }
                    else {
                        generateZip = true;
                        if ('zipName' in jsonData) {
                            zipName = jsonData.zipName;
                        }
                        else {
                            zipName = 'DocumentsGenerator.zip';
                        }
                    }
                    if (names.length === data.length) {
                        if (generateZip) {
                            zip = new JSZip();
                        }
                        for (let i = 0; i < names.length; i++) {
                            let name = names[i];
                            if (name.substr(-4).toLowerCase() === ".pdf") {
                                mimetype = mimetype_document_1.MimetypeDocument.Pdf;
                            }
                            else {
                                mimetype = mimetype_document_1.MimetypeDocument.Docx;
                            }
                            let tmp = yield DocumentsService_1.generateDocxDocument(name, document, data[i], mimetype);
                            if (mimetype === mimetype_document_1.MimetypeDocument.Pdf) {
                                tmp = yield DocumentsService_1.docxToPdf(tmp);
                            }
                            if (generateZip) {
                                zip.file(tmp.name, tmp.buffer);
                            }
                            else {
                                result.push(tmp);
                            }
                        }
                    }
                    else {
                        throw new common_1.BadRequestException("data size !== names size");
                    }
                }
                else {
                    throw new common_1.BadRequestException("template not found");
                }
            }
            else {
                throw new common_1.BadRequestException("template mandatory");
            }
            return generateZip ? {
                buffer: yield zip.generateAsync({ type: "nodebuffer" }),
                mimetype: mimetype_document_1.MimetypeDocument.Zip,
                name: zipName
            } : result[0];
        });
    }
    getDocumentByTemplateName(template) {
        return this.documentsRepository.findOne({
            where: {
                name: template
            }
        });
    }
    static generateDocxDocument(name, document, data, mimetype) {
        return __awaiter(this, void 0, void 0, function* () {
            let buffer = yield docx_templates_1.default({
                output: 'buffer',
                template: document.path,
                data: data,
            });
            return {
                name,
                document,
                data,
                mimetype,
                buffer
            };
        });
    }
    static docxToPdf(oDocx) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = tempWrite.sync(oDocx.buffer);
            let bufferOut = null;
            try {
                bufferOut = yield unoconv.convert(filePath).then(fileBuffer => {
                    return Promise.resolve(fileBuffer);
                }).catch(e => {
                    throw e;
                });
            }
            finally {
                fs.unlinkSync(filePath);
            }
            return {
                buffer: bufferOut,
                name: oDocx.name,
                data: oDocx.data,
                mimetype: oDocx.mimetype
            };
        });
    }
};
DocumentsService = DocumentsService_1 = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(documents_1.Documents)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DocumentsService);
exports.DocumentsService = DocumentsService;
//# sourceMappingURL=documents.service.js.map