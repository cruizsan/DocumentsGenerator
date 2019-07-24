import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class JsonGeneratePipe implements PipeTransform<string> {
    transform(value: any, metadata: ArgumentMetadata): Promise<any>;
}
