import { Component, inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from '@parts/components/breadcrumbs/breadcrumbs.component';
import { BreadcrumbItems } from '@parts/components/breadcrumbs/breadcrumbs.models';
import { RouterLinkWithHref } from '@angular/router';
import { InputValidateModule } from '@parts/directives';
import { TranslateModule } from '@ngx-translate/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { VariablesService } from '@parts/services/variables.service';
import { ParamsCallRpc } from '@api/models/call_rpc.model';
import { BackendService } from '@api/services/backend.service';
import { SendMoneyParams } from '@api/models/send-money.model';
import { WalletModalsModule } from '../../../../modals/wallet-modals.module';
import { BigNumber } from 'bignumber.js';

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
    WalletModalsModule,
  ],
  templateUrl: './confirm-swap.component.html',
  styleUrls: ['./confirm-swap.component.scss'],
})
export class ConfirmSwapComponent implements OnInit, OnDestroy {
  sendMoneyParams: SendMoneyParams | null = null;

  breadcrumbItems: BreadcrumbItems = [
    {
      routerLink: '/wallet/swap',
      title: 'CONFIRM_SWAP.BREADCRUMBS.ITEM1',
    },
    {
      title: 'CONFIRM_SWAP.BREADCRUMBS.ITEM2',
    },
  ];

  errorNotDecodeHexRawProposal: { code: number; message: string } = null;

  job_id: number;

  isModalDialogVisible = false;

  isModalDetailsDialogVisible = false;

  variablesService = inject(VariablesService);

  fb = inject(NonNullableFormBuilder);

  form = this.fb.group({
    hex_raw_proposal: this.fb.control<string>('', [Validators.required]),
  });

  proposalDetails:
    | {
        expiration_time: number;
        fee_paid_by_a: number;
        mixins: number;
        destination_address: string;
        to_alice: [
          {
            amount: number | string;
            asset_id: string;
          }
        ];
        to_bob: [
          {
            amount: number | string;
            asset_id: string;
          }
        ];
      }
    | undefined;
  private backendService = inject(BackendService);
  private ngZone = inject(NgZone);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.form.controls.hex_raw_proposal.valueChanges.pipe(distinctUntilChanged(), debounceTime(500), takeUntil(this.destroy$)).subscribe({
      next: (hex_raw_proposal: string) => {
        this.getProposalDetails(hex_raw_proposal);
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  showDialog(): void {
    this.isModalDialogVisible = true;
  }

  confirmed(confirmed: boolean): void {
    this.isModalDialogVisible = false;
    if (confirmed) {
      this.onSend();
    }
  }

  onSend(): void {
    this.backendService.sendMoney(this.sendMoneyParams, (job_id: number) => {
      this.ngZone.run(() => {
        this.job_id = job_id;
        this.isModalDetailsDialogVisible = true;
        this.variablesService.currentWallet.sendMoneyParams = null;
      });
    });
  }

  handeCloseDetailsModal(success: boolean): void {
    this.isModalDetailsDialogVisible = false;
    this.job_id = null;

    if (success) {
      const {
        currentWallet: { wallet_id },
      } = this.variablesService;
      this.variablesService.currentWallet.sendMoneyParams = null;
      this.sendMoneyParams = null;
    }
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
              this.sendMoneyParams = {
                wallet_id: this.variablesService.currentWallet.wallet_id,
                address: proposal.destination_address,
                amount: new BigNumber(proposal.to_alice[0].amount).toString(),
                fee: this.variablesService.default_fee,
                mixin: 10,
                comment: '',
                hide: false,
                asset_id: proposal.to_alice[0].asset_id,
              };
            } else {
              this.errorNotDecodeHexRawProposal = response_data2.error;
            }
          });
        });
      }
    });
  }
}
