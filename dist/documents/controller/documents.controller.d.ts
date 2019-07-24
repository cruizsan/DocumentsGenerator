import { Documents } from "../model/documents";
import { DocumentsService } from "../service/documents.service";
export declare class DocumentsController {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    getDocumentById(id: number): Promise<Documents>;
    getDocuments(): Promise<Documents[]>;
    createDocument(file: any): Promise<Documents>;
    updateDocument(): Promise<Documents>;
    deleteDocument(id: number): Promise<Documents>;
    generateDocument(jsonData: any, res: any): Promise<void>;
}
