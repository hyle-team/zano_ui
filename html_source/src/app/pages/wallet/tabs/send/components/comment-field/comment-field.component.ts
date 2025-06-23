import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IsVisibleControlErrorPipe } from '@parts/pipes/is-visible-control-error.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { VariablesService } from '@parts/services/variables.service';

@Component({
    selector: 'zano-comment-field',
    standalone: true,
    imports: [CommonModule, FormsModule, IsVisibleControlErrorPipe, ReactiveFormsModule, TranslateModule],
    templateUrl: './comment-field.component.html',
    styleUrls: ['./comment-field.component.scss'],
})
export class CommentFieldComponent {
    @Input() control_ref: FormControl<string>;

    variables_service: VariablesService = inject(VariablesService);
}
