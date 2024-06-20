import { Component, inject } from '@angular/core';
import { VariablesService } from '@parts/services/variables.service';
import { NonNullableFormBuilder } from '@angular/forms';
import { ZanoValidators } from '@parts/utils/zano-validators';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DeployAssetParams } from '@api/models/custom-asstest.model';

@Component({
  selector: 'app-confirm-create-custom-asset',
  templateUrl: './confirm-create-custom-asset.component.html',
  styleUrls: ['./confirm-create-custom-asset.component.scss']
})
export class ConfirmCreateCustomAssetComponent {
    public readonly variablesService = inject(VariablesService);

    private readonly fb = inject(NonNullableFormBuilder);

    public readonly confirmForm = this.fb.group(
        {
            password: this.fb.control(''),
            appPass: this.fb.control(this.variablesService.appPass || ''),
        },
        { validators: [ZanoValidators.formMatch('password', 'appPass', 'passwordNotMatch')] }
    );

    public readonly data: { asset_descriptor: DeployAssetParams['asset_descriptor'] } = inject(DIALOG_DATA);

    public readonly dialogRef = inject(DialogRef);
}
