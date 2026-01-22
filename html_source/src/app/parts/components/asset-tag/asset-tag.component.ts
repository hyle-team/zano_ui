import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZANO_ASSET_INFO } from '@parts/data/zano-assets-info';
import { VariablesService } from '@parts/services/variables.service';

type AssetTagType = 'NATIVE' | 'WHITELISTED';

@Component({
    selector: 'zano-asset-tag',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './asset-tag.component.html',
    styleUrls: ['./asset-tag.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetTagComponent implements OnChanges {
    @Input()
    assetId!: string;

    type: AssetTagType | null = null;

    constructor(private _variablesService: VariablesService) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes['assetId']) {
            this.type = this._getType(this.assetId);
        }
    }

    private _getType(assetId): AssetTagType | null {
        if (!assetId) return null;

        // ZANO is always native
        if (assetId === ZANO_ASSET_INFO.asset_id) {
            return 'NATIVE';
        }

        if (this._variablesService.verifiedAssetIdWhitelist.includes(assetId)) {
            return 'WHITELISTED';
        }

        return null;
    }
}
