import { Pipe, PipeTransform } from '@angular/core';
import { extractErrorCode } from '@parts/utils/extract-error-code';

@Pipe({
    name: 'extractErrorCode',
    standalone: true,
})
export class ExtractErrorCodePipe implements PipeTransform {
    transform<T>(value: T): T | string {
        return extractErrorCode(value);
    }
}
