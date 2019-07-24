
import { BadRequestException } from '@nestjs/common';
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class JsonGeneratePipe implements PipeTransform<string> {
    async transform(value , metadata: ArgumentMetadata) {
        try{
            if(value){
                let tmp = value;
                if('template' in tmp && 'names' in tmp){
                    if(!('data' in tmp)){tmp['data'] = {};}
                    if(!('zipName' in tmp)){tmp['zipName'] = null;}
                    if(!('callback' in tmp)){
                        tmp['callback'] = null;
                    }else{
                        if(!('url' in tmp['callback'])){throw new BadRequestException();}
                        if(!('headers' in tmp['callback'])){tmp['callback']['headers'] = null;}
                    }
                    return tmp;
                }else{
                    throw new BadRequestException();
                }
            }
        }catch(e){
            throw new BadRequestException('Not a valid Json Generate value');
        }
    }
}
