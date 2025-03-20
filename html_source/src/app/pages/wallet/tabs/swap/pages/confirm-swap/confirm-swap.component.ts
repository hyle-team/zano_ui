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
import { IntToMoneyPipeModule } from '@parts/pipes';
import { SwapConfirmMasterPasswordComponent } from '../../modals/swap-confirm-master-password/swap-confirm-master-password.component';
import { ProposalDetails } from '@api/models/swap.model';
import { GetAssetInfoPipe } from '@parts/pipes/get-asset-info.pipe';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SwapDetailsComponent } from '../../modals/swap-details/swap-details.component';

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
        IntToMoneyPipeModule,
        GetAssetInfoPipe
    ],
    templateUrl: './confirm-swap.component.html',
    styleUrls: ['./confirm-swap.component.scss']
})
export class ConfirmSwapComponent implements OnInit, OnDestroy {
    breadcrumbItems: BreadcrumbItems = [
        {
            routerLink: '/wallet/swap',
            title: 'CONFIRM_SWAP.BREADCRUMBS.ITEM1'
        },
        {
            title: 'CONFIRM_SWAP.BREADCRUMBS.ITEM2'
        }
    ];

    errorRpc: { code: number; message: string } | undefined;

    variablesService = inject(VariablesService);

    fb = inject(NonNullableFormBuilder);

    form = this.fb.group({
        hex_raw_proposal: this.fb.control<string>('', [Validators.required])
    });

    proposalDetails: ProposalDetails | undefined;

    hex_raw_proposal: string | undefined;

    private backendService: BackendService = inject(BackendService);

    private router: Router = inject(Router);

    private ngZone: NgZone = inject(NgZone);

    private _matDialog: MatDialog = inject(MatDialog);

    private destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.form.controls.hex_raw_proposal.valueChanges
            .pipe(distinctUntilChanged(), debounceTime(500), takeUntil(this.destroy$))
            .subscribe({
                next: (hex_raw_proposal: string) => {
                    this.hex_raw_proposal = hex_raw_proposal;
                    this.getProposalDetails(hex_raw_proposal);
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    swapConfirmMasterPasswordDialog(): void {
        const proposalDetails = this.proposalDetails;
        const config: MatDialogConfig = {
            data: {
                proposalDetails
            },
            disableClose: true
        };
        this._matDialog
            .open(SwapConfirmMasterPasswordComponent, config)
            .afterClosed()
            .pipe(filter(Boolean), take(1))
            .subscribe({
                next: () => this.acceptProposal()
            });
    }

    acceptProposal(): void {
        if (!this.hex_raw_proposal) {
            return;
        }
        const { wallet_id } = this.variablesService.current_wallet;
        const hex_raw_proposal = this.hex_raw_proposal;

        const params: ParamsCallRpc = {
            jsonrpc: '2.0',
            id: 0,
            method: 'ionic_swap_accept_proposal',
            params: { hex_raw_proposal }
        };
        this.backendService.call_wallet_rpc([wallet_id, params], (status, response) => {
            this.ngZone.run(() => {
                const config: MatDialogConfig = {
                    data: {
                        response
                    },
                    disableClose: true
                };
                this._matDialog
                    .open(SwapDetailsComponent, config)
                    .afterClosed()
                    .pipe(filter(Boolean), take(1))
                    .subscribe({
                        next: () => this.router.navigate(['/wallet/history'])
                    });
            });
        });
    }

    private getProposalDetails(hex_raw_proposal: string): void {
        const { wallet_id } = this.variablesService.current_wallet;

        const params: ParamsCallRpc = {
            jsonrpc: '2.0',
            id: 0,
            method: 'ionic_swap_get_proposal_info',
            params: { hex_raw_proposal }
        };

        this.backendService.call_wallet_rpc([wallet_id, params], (status, response_data) => {
            this.ngZone.run(() => {
                const proposal = response_data?.result?.['proposal'];
                if (proposal) {
                    this.proposalDetails = proposal;
                    this.errorRpc = undefined;
                } else {
                    this.proposalDetails = undefined;
                    this.errorRpc = response_data.error;
                }
            });
        });
    }
}
