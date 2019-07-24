import { Repository } from 'typeorm';
import { Documents } from "../model/documents";
export declare class DocumentsService {
    private readonly documentsRepository;
    constructor(documentsRepository: Repository<Documents>);
    findAll(): Promise<Documents[]>;
    findById(id: number): Promise<Documents>;
    createDocument(document: Documents): Promise<Documents>;
    deleteById(id: number): Promise<Documents>;
    handleGenerateDocument(jsonData: any): Promise<any>;
    private getDocumentByTemplateName;
    static generateDocxDocument(name: any, document: any, data: any, mimetype: any): Promise<{
        name: any;
        document: any;
        data: any;
        mimetype: any;
        buffer: any;
    }>;
    static docxToPdf(oDocx: any): Promise<{
        buffer: any;
        name: any;
        data: any;
        mimetype: any;
    }>;
}
