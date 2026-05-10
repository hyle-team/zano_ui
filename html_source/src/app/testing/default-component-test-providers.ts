import { Dialog } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { BackendService } from '@api/services/backend.service';
import { ModalService } from '@parts/services/modal.service';
import { VariablesService } from '@parts/services/variables.service';
import { WalletsService } from '@parts/services/wallets.service';
import { TranslateService } from '@ngx-translate/core';
import { MoneyToIntPipe } from '@parts/pipes/money-to-int-pipe/money-to-int.pipe';

const matDialogMock = {
    open: (): { afterClosed: () => { pipe: () => { subscribe: () => undefined } } } => ({
        afterClosed: (): { pipe: () => { subscribe: () => undefined } } => ({
            pipe: (): { subscribe: () => undefined } => ({
                subscribe: (): undefined => undefined,
            }),
        }),
    }),
    closeAll: (): undefined => undefined,
};

const variablesServiceMock = {
    wallets: [],
    current_wallet: {
        balances: [],
        loaded: false,
        name: '',
        alias_info: null,
    },
    settings: {
        currency: 'usd',
        isDarkTheme: false,
    },
    wrap_info$: {
        value: null,
    },
    onContextMenu: (): undefined => undefined,
};

export const DEFAULT_COMPONENT_TEST_PROVIDERS = [
    { provide: VariablesService, useValue: variablesServiceMock },
    { provide: WalletsService, useValue: { opened_wallet_items: [], closeWallet: (): undefined => undefined } },
    {
        provide: BackendService,
        useValue: {
            alias_lookup: (): undefined => undefined,
            openUrlInBrowser: (): undefined => undefined,
            call_wallet_rpc: (): undefined => undefined,
        },
    },
    { provide: ModalService, useValue: { prepareModal: (): undefined => undefined } },
    { provide: MatDialog, useValue: matDialogMock },
    { provide: Dialog, useValue: { closeAll: (): undefined => undefined } },
    { provide: TranslateService, useValue: { instant: (key: string): string => key, onLangChange: { pipe: (): object => ({}) } } },
    { provide: MoneyToIntPipe, useValue: { transform: (): string => '0' } },
];
