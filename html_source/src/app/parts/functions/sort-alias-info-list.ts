import { AliasInfo } from '@api/models/alias.model';

export const predicateSortAliasInfoList = (a: AliasInfo, b: AliasInfo) => {
    if (a.alias.length > b.alias.length) {
        return 1;
    }
    if (a.alias.length < b.alias.length) {
        return -1;
    }
    if (a.alias > b.alias) {
        return 1;
    }
    if (a.alias < b.alias) {
        return -1;
    }
    return 0;
};
