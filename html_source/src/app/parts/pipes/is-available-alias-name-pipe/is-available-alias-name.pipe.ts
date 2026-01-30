import { Pipe, PipeTransform } from '@angular/core';
import { AliasInfo } from '@api/models/alias.model';

@Pipe({
    name: 'isAvailableAliasName',
    standalone: true
})
export class IsAvailableAliasNamePipe implements PipeTransform {
    transform(alias: AliasInfo | null | undefined): boolean {
        return (Boolean(alias) && Boolean(alias.alias) && alias.alias.length >= 1 && alias.alias.length <= 5) || false;
    }
}
