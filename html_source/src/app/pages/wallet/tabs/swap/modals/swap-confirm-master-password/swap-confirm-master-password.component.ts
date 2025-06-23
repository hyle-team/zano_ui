import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { GetAssetInfoPipe, IntToMoneyPipeModule } from '@parts/pipes';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { VariablesService } from '@parts/services/variables.service';
import { ZanoValidators } from '@parts/utils/zano-validators';
import { ProposalDetails } from '@api/models/swap.model';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'app-swap-confirm-master-password',
    standalone: true,
    imports: [CommonModule, FlexModule, ReactiveFormsModule, TranslateModule, IntToMoneyPipeModule, GetAssetInfoPipe, MatDialogModule],
    templateUrl: './swap-confirm-master-password.component.html',
    styleUrls: ['./swap-confirm-master-password.component.scss'],
})
export class SwapConfirmMasterPasswordComponent {
    variablesService: VariablesService = inject(VariablesService);

    fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

    confirmForm = this.fb.group(
        {
            password: this.fb.control(''),
            appPass: this.fb.control(this.variablesService.appPass || ''),
        },
        { validators: [ZanoValidators.formMatch('password', 'appPass', 'passwordNotMatch')] }
    );

    data: { proposalDetails: ProposalDetails } = inject(MAT_DIALOG_DATA);
}
