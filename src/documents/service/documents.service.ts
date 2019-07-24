import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Documents} from "../model/documents";
import createReport from 'docx-templates';
import {MimetypeDocument} from "../enum/mimetype.document";

const unoconv = require("unoconv-promise");
const tempWrite = require('temp-write');
const JSZip = require("jszip");
const fs = require('fs');

@Injectable()
export class DocumentsService {
    constructor(
        @InjectRepository(Documents)
        private readonly documentsRepository: Repository<Documents>,
    ) {}

    async findAll(): Promise<Documents[]> {
        return await this.documentsRepository.find();
    }

    async findById(id : number): Promise<Documents> {
        return await this.documentsRepository.findOne({
            where:{
                id: id
            }
        });
    }

    async createDocument(document : Documents): Promise<Documents> {
        return await this.documentsRepository.save(document);
    }

    async deleteById(id: number): Promise<Documents> {
        try{
            let document = await this.findById(id);
            await this.documentsRepository.remove(document);
            fs.unlinkSync(document.path);
            return document;
        }catch(e){return null;}
    }

    /**
     *
     * @param jsonData
     *  + template : string (name hashed from get /documents)
     *  + names : string or array of string
     *  + data : Object or Array of Object (length should match names)
     *  + zipName (optional, only if multiple names) : string (default to "DocumentsGenerator.zip")
     */
    async handleGenerateDocument(jsonData){
        let template = jsonData.template;
        let names = jsonData.names;
        let data = jsonData.data;
        let mimetype = MimetypeDocument.Docx;
        let zipName = null;
        let result = [];
        let zip = null;
        let generateZip = false;
        if(template){
            let document = await this.getDocumentByTemplateName(template);
            if(document){
                if(!(names instanceof Array)){
                    names = [names];
                    data = [data];
                }else{
                    generateZip = true;
                    if('zipName' in jsonData){
                        zipName = jsonData.zipName;
                    }else{
                        zipName = 'DocumentsGenerator.zip';
                    }
                }
                if(names.length === data.length){
                    if(generateZip){
                        zip = new JSZip();
                    }
                    for(let i=0;i<names.length;i++){
                        let name = names[i];
                        if(name.substr(-4).toLowerCase() === ".pdf"){
                            mimetype = MimetypeDocument.Pdf;
                        }else{
                            mimetype = MimetypeDocument.Docx;
                        }
                        let tmp = await DocumentsService.generateDocxDocument(name, document, data[i], mimetype);
                        if(mimetype === MimetypeDocument.Pdf){
                            // @ts-ignore
                            tmp = await DocumentsService.docxToPdf(tmp);
                        }
                        if(generateZip){
                            zip.file(tmp.name, tmp.buffer);
                        }else{
                            result.push(tmp);
                        }
                    }
                }else{
                    throw new BadRequestException("data size !== names size");
                }
            }else{
                throw new BadRequestException("template not found");
            }
        }else{
            throw new BadRequestException("template mandatory");
        }
        return generateZip ? {
            buffer: await zip.generateAsync({type: "nodebuffer"}),
            mimetype: MimetypeDocument.Zip,
            name: zipName
        } : result[0];
    }

    private getDocumentByTemplateName(template) : Promise<Documents>{
        return this.documentsRepository.findOne({
            where : {
                name: template
            }
        });
    }

    /**
     * Generate docx from template + JSON data
     *
     * @param name
     * @param document
     * @param data
     * @param mimetype
     *
     * @return {
     *     name,
     *     document,
     *     data,
     *     mimetype,
     *     buffer
     * }
     */
    static async generateDocxDocument(name, document, data, mimetype) {
        let buffer = await createReport({
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
        }
    }

    /**
     * Convert docx buffer to pdf buffer
     *
     * @param oDocx
     *  - name
     *  - mimetype
     *  - data
     *  - buffer (IN)
     *
     *  @return {
     *      buffer,
     *      name,
     *      data,
     *      mimetype (pdf)
     *  }
     */
    static async docxToPdf(oDocx){
        const filePath = tempWrite.sync(oDocx.buffer);
        let bufferOut = null;
        try{
            bufferOut = await unoconv.convert(filePath).then(fileBuffer => {
                return Promise.resolve(fileBuffer);}
            ).catch(e => {
                throw e;
            });
        }finally {
            fs.unlinkSync(filePath);
        }

        return {
            buffer: bufferOut,
            name: oDocx.name,
            data : oDocx.data,
            mimetype : oDocx.mimetype
        };
    }
}
