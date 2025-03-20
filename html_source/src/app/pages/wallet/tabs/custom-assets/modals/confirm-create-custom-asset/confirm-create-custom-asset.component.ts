import { Component, inject } from '@angular/core';
import { VariablesService } from '@parts/services/variables.service';
import { NonNullableFormBuilder } from '@angular/forms';
import { ZanoValidators } from '@parts/utils/zano-validators';
import { DeployAssetParams } from '@api/models/custom-asstest.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-confirm-create-custom-asset',
    templateUrl: './confirm-create-custom-asset.component.html',
    styleUrls: ['./confirm-create-custom-asset.component.scss']
})
export class ConfirmCreateCustomAssetComponent {
    public readonly variablesService: VariablesService = inject(VariablesService);

    public readonly data: { asset_descriptor: DeployAssetParams['asset_descriptor'] } = inject(MAT_DIALOG_DATA);

    private readonly fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

    public readonly confirmForm = this.fb.group(
        {
            password: this.fb.control(''),
            appPass: this.fb.control(this.variablesService.appPass || '')
        },
        { validators: [ZanoValidators.formMatch('password', 'appPass', 'passwordNotMatch')] }
    );
}
