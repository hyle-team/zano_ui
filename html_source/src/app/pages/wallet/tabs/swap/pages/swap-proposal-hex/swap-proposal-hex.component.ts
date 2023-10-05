import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from '@parts/components/breadcrumbs/breadcrumbs.component';
import { BreadcrumbItems } from '@parts/components/breadcrumbs/breadcrumbs.models';
import { RouterLinkWithHref } from '@angular/router';
import { InputValidateModule } from '@parts/directives';
import { TranslateModule } from '@ngx-translate/core';
import { BackendService } from '@api/services/backend.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IDeactivateComponent } from '@parts/interfaces/deactivete-component.interface';
import { Observable } from 'rxjs';
import { Dialog, DialogConfig } from '@angular/cdk/dialog';
import { ConfirmModalComponent, ConfirmModalData } from '@parts/modals/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-swap-proposal-hex',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent, RouterLinkWithHref, InputValidateModule, TranslateModule, ReactiveFormsModule],
  templateUrl: './swap-proposal-hex.component.html',
  styleUrls: ['./swap-proposal-hex.component.scss'],
})
export class SwapProposalHexComponent implements OnInit, IDeactivateComponent {
  breadcrumbItems: BreadcrumbItems = [
    {
      routerLink: '/wallet/swap',
      title: 'SWAP_PROPOSAL_HEX.BREADCRUMBS.ITEM1',
    },
    {
      title: 'SWAP_PROPOSAL_HEX.BREADCRUMBS.ITEM2',
    },
  ];

  copyAnimation = false;

  copyAnimationTimeout: any;

  fb = inject(FormBuilder);

  form = this.fb.group({
    hex_raw_proposal: this.fb.control('', [Validators.required]),
  });

  private backendService = inject(BackendService);

  private dialog = inject(Dialog);

  ngOnInit(): void {
    this.setSwapProposalHexFromHistoryState();
  }

  copy(): void {
    const { hex_raw_proposal } = this.form.getRawValue();
    this.backendService.setClipboard(hex_raw_proposal);
    this.copyAnimation = true;
    this.copyAnimationTimeout = setTimeout(() => {
      this.copyAnimation = false;
      clearTimeout(this.copyAnimationTimeout);
    }, 2000);
  }

  canExit(): Observable<boolean> | Promise<boolean> | boolean {
    const dialogConfig: DialogConfig<ConfirmModalData> = {
      disableClose: true,
      data: {
        title: 'SWAP_PROPOSAL_HEX.MODALS.CONFIRM_MODAL.TITLE',
        message: 'SWAP_PROPOSAL_HEX.MODALS.CONFIRM_MODAL.MESSAGE',
        buttons: {
          submit: 'SWAP_PROPOSAL_HEX.MODALS.CONFIRM_MODAL.BUTTONS.SUBMIT',
          close: 'SWAP_PROPOSAL_HEX.MODALS.CONFIRM_MODAL.BUTTONS.CLOSE',
        },
      },
    };
    const dialogRef = this.dialog.open<boolean>(ConfirmModalComponent, dialogConfig);
    return dialogRef.closed;
  }

  private setSwapProposalHexFromHistoryState(): void {
    const historyState = history.state || {};
    const hex_raw_proposal = historyState['hex_raw_proposal'];
    if (hex_raw_proposal) {
      this.form.controls.hex_raw_proposal.patchValue(hex_raw_proposal, { emitEvent: false });
    }
  }
}
