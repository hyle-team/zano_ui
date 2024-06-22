import { Component, inject } from '@angular/core';
import { VariablesService } from '@parts/services/variables.service';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { AssetInfo } from '@api/models/assets.model';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-burn-custom-asset',
  templateUrl: './burn-custom-asset.component.html',
  styleUrls: ['./burn-custom-asset.component.scss']
})
export class BurnCustomAssetComponent {
    public readonly variablesService = inject(VariablesService);

    private readonly fb = inject(NonNullableFormBuilder);

    public readonly form = this.fb.group(
        {
            amount: this.fb.control('', [Validators.required]),
        }
    );

    public readonly data: { assetInfo: AssetInfo } = inject(DIALOG_DATA);

    public readonly dialogRef = inject(DialogRef);

    public submit(): void {
        // TODO: Unknown api for burn
    }
}
