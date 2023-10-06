import { Component, inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from '@parts/components/breadcrumbs/breadcrumbs.component';
import { BreadcrumbItems } from '@parts/components/breadcrumbs/breadcrumbs.models';
import { Router, RouterLinkWithHref } from '@angular/router';
import { InputValidateModule } from '@parts/directives';
import { TranslateModule } from '@ngx-translate/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, take, takeUntil } from 'rxjs/operators';
import { VariablesService } from '@parts/services/variables.service';
import { ParamsCallRpc } from '@api/models/call_rpc.model';
import { BackendService } from '@api/services/backend.service';
import { GetWhiteAssetPipe, IntToMoneyPipeModule } from '@parts/pipes';
import { Dialog, DialogConfig } from '@angular/cdk/dialog';
import { SwapConfirmMasterPasswordComponent } from '../../modals/swap-confirm-master-password/swap-confirm-master-password.component';
import { ProposalDetails } from '@api/models/swap.model';

@Component({
  selector: 'app-confirm-swap',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbsComponent,
    RouterLinkWithHref,
    InputValidateModule,
    TranslateModule,
    ReactiveFormsModule,
    GetWhiteAssetPipe,
    IntToMoneyPipeModule,
  ],
  templateUrl: './confirm-swap.component.html',
  styleUrls: ['./confirm-swap.component.scss'],
})
export class ConfirmSwapComponent implements OnInit, OnDestroy {
  breadcrumbItems: BreadcrumbItems = [
    {
      routerLink: '/wallet/swap',
      title: 'CONFIRM_SWAP.BREADCRUMBS.ITEM1',
    },
    {
      title: 'CONFIRM_SWAP.BREADCRUMBS.ITEM2',
    },
  ];

  errorRpc: { code: number; message: string } | undefined;

  variablesService = inject(VariablesService);

  fb = inject(NonNullableFormBuilder);

  form = this.fb.group({
    hex_raw_proposal: this.fb.control<string>('', [Validators.required]),
  });

  proposalDetails: ProposalDetails | undefined;

  hex_raw_proposal: string | undefined;

  private backendService = inject(BackendService);

  private router = inject(Router);

  private ngZone = inject(NgZone);

  private dialog = inject(Dialog);

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.form.controls.hex_raw_proposal.valueChanges.pipe(distinctUntilChanged(), debounceTime(500), takeUntil(this.destroy$)).subscribe({
      next: (hex_raw_proposal: string) => {
        this.hex_raw_proposal = hex_raw_proposal;
        this.getProposalDetails(hex_raw_proposal);
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  swapConfirmMasterPasswordDialog(): void {
    const proposalDetails = this.proposalDetails;
    const config: DialogConfig = {
      data: {
        proposalDetails,
      },
      disableClose: true,
      width: '54rem',
      maxHeight: '90vh',
    };
    this.dialog
      .open(SwapConfirmMasterPasswordComponent, config)
      .closed.pipe(filter(Boolean), take(1))
      .subscribe({
        next: () => this.acceptProposal(),
      });
  }

  acceptProposal(): void {
    if (!this.hex_raw_proposal) {
      return;
    }
    const { wallet_id } = this.variablesService.currentWallet;
    const hex_raw_proposal = this.hex_raw_proposal;
    const params1: ParamsCallRpc = {
      jsonrpc: '2.0',
      id: wallet_id,
      method: 'mw_select_wallet',
      params: { wallet_id },
    };
    const params2: ParamsCallRpc = {
      jsonrpc: '2.0',
      id: wallet_id,
      method: 'ionic_swap_accept_proposal',
      params: { hex_raw_proposal },
    };
    this.backendService.call_rpc(params1, (status1, response_data1) => {
      if (response_data1.result.status === 'OK') {
        this.backendService.call_rpc(params2, (status2, response_data2) => {
          this.ngZone.run(() => {
            if (response_data2.result?.['result_tx_id']) {
              this.router.navigate(['/wallet/history']).then();
            } else {
              this.errorRpc = response_data2.error;
            }
          });
        });
      }
    });
  }

  private getProposalDetails(hex_raw_proposal: string): void {
    const { wallet_id } = this.variablesService.currentWallet;
    const params1: ParamsCallRpc = {
      jsonrpc: '2.0',
      id: wallet_id,
      method: 'mw_select_wallet',
      params: { wallet_id },
    };
    const params2: ParamsCallRpc = {
      jsonrpc: '2.0',
      id: wallet_id,
      method: 'ionic_swap_get_proposal_info',
      params: { hex_raw_proposal },
    };

    this.backendService.call_rpc(params1, (status1, response_data1) => {
      if (response_data1.result.status === 'OK') {
        this.backendService.call_rpc(params2, (status2, response_data2) => {
          this.ngZone.run(() => {
            const proposal = response_data2?.result?.['proposal'];
            if (proposal) {
              this.proposalDetails = proposal;
              this.errorRpc = undefined;
            } else {
              this.proposalDetails = undefined;
              this.errorRpc = response_data2.error;
            }
          });
        });
      }
    });
  }
}
