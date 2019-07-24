import {
    Body,
    Controller,
    Delete,
    Get, NotImplementedException,
    Param,
    Patch,
    Post,
    Put,
    Res,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import {Documents} from "../model/documents";
import {FileInterceptor} from "@nestjs/platform-express";
import {DocumentsService} from "../service/documents.service";
import {JsonGeneratePipe} from "../pipes/json.generate.pipe";
import {ApiImplicitBody, ApiImplicitParam, ApiImplicitQuery, ApiOperation, ApiUseTags, ApiResponse,
    ApiNotImplementedResponse,
    ApiResponseModelProperty} from '@nestjs/swagger';

@ApiUseTags('documents')
@Controller('documents')
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) {}

    @ApiOperation({title: 'get template by id'})
    @ApiImplicitParam({name: "id", description: "id of my template", required: true, type: Number})
    @Get(':id')
    getDocumentById(@Param('id') id : number): Promise<Documents> {
        return this.documentsService.findById(id);
    }

    @ApiOperation({title: 'get all templates'})
    @Get()
    getDocuments(): Promise<Documents[]> {
        return this.documentsService.findAll();
    }

    @ApiOperation({title: 'upload a template'})
    @UseInterceptors(FileInterceptor('file'))
    @Post()
    createDocument(@UploadedFile() file): Promise<Documents> {
        let document = new Documents();
        console.log(file);
        document.name = file.filename;
        document.originalname = file.originalname;
        document.path = file.path;
        return this.documentsService.createDocument(document);
    }

    @ApiNotImplementedResponse({})
    @Put()
    @Patch()
    updateDocument(): Promise<Documents> {
        throw new NotImplementedException();
        // return null;
    }

    @ApiOperation({title: 'delete template by id'})
    @ApiImplicitParam({name: "id", description: "id of my template", required: true, type: Number})
    @Delete(':id')
    deleteDocument(@Param('id') id : number){
        return this.documentsService.deleteById(id);
    }

    @ApiOperation({title: 'generate document from a template and data'})
    @ApiImplicitBody({name: "", description: "data for my template", required: true, type: Object})
    @Post('generate')
    async generateDocument(
        @Body(new JsonGeneratePipe()) jsonData,
        @Res() res
        ){
        let result = await this.documentsService.handleGenerateDocument(jsonData);
        if(result){
            res.setHeader('Content-Type', result.mimetype);
            res.setHeader('Content-disposition', 'attachment; filename='+result.name);
            res.write(result.buffer,'binary');
            res.end(null, 'binary');
        }
        return
    }
}
