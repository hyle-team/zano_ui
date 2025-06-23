import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsVisibleControlErrorPipe } from '@parts/pipes/is-visible-control-error.pipe';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputValidateModule } from '@parts/directives';
import { TranslateModule } from '@ngx-translate/core';
import { VariablesService } from '@parts/services/variables.service';

@Component({
    selector: 'zano-mixin-field',
    standalone: true,
    imports: [CommonModule, IsVisibleControlErrorPipe, ReactiveFormsModule, InputValidateModule, TranslateModule],
    templateUrl: './mixin-field.component.html',
    styleUrls: ['./mixin-field.component.scss'],
})
export class MixinFieldComponent {
    @Input()
    control_ref: FormControl<number>;

    variablesService: VariablesService = inject(VariablesService);
}
