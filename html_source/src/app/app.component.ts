import { Component, NgZone, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BackendService, Commands } from '@api/services/backend.service';
import { Router } from '@angular/router';
import { VariablesService } from '@parts/services/variables.service';
import { IntToMoneyPipe } from '@parts/pipes';
import { BigNumber } from 'bignumber.js';
import { ModalService } from '@parts/services/modal.service';
import { StateKeys, Store } from '@store/store';
import { interval, of, Subject } from 'rxjs';
import { catchError, retry, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { paths, pathsChildrenAuth } from './pages/paths';
import { hasOwnProperty } from '@parts/functions/has-own-property';
import { Dialog } from '@angular/cdk/dialog';
import { ZanoLoadersService } from '@parts/services/zano-loaders.service';
import { ParamsCallRpc } from '@api/models/call_rpc.model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '@api/services/api.service';
import { WalletsService } from '@parts/services/wallets.service';
import { WrapInfo } from '@api/models/wrap-info';
import { AliasInfo } from '@api/models/alias.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
    intervalUpdateContractsState;

    expMedTsEvent;

    onQuitRequest = false;

    firstOnlineState = false;

    translateUsed = false;

    needOpenWallets = [];

    currentScreenSize: string;

    displayNameMap = new Map([
        [Breakpoints.XSmall, 'XSmall'],
        [Breakpoints.Small, 'Small'],
        [Breakpoints.Medium, 'Medium'],
        [Breakpoints.Large, 'Large'],
        [Breakpoints.XLarge, 'XLarge'],
    ]);

    private _destroy$: Subject<void> = new Subject<void>();

    constructor(
        public variablesService: VariablesService,
        public translate: TranslateService,
        private renderer: Renderer2,
        private backendService: BackendService,
        private router: Router,
        private ngZone: NgZone,
        private intToMoneyPipe: IntToMoneyPipe,
        private modalService: ModalService,
        private store: Store,
        private dialog: Dialog,
        private matDialog: MatDialog,
        public zanoLoadersService: ZanoLoadersService,
        private _apiService: ApiService,
        private _walletsService: WalletsService,
        private _breakpointObserver: BreakpointObserver
    ) {
        this._setTranslate();
        this._setResponseClasses();
    }

    setBackendLocalization(): void {
        if (this.translateUsed) {
            const stringsArray = [
                this.translate.instant('BACKEND_LOCALIZATION.QUIT'),
                this.translate.instant('BACKEND_LOCALIZATION.IS_RECEIVED'),
                this.translate.instant('BACKEND_LOCALIZATION.IS_CONFIRMED'),
                this.translate.instant('BACKEND_LOCALIZATION.INCOME_TRANSFER_UNCONFIRMED'),
                this.translate.instant('BACKEND_LOCALIZATION.INCOME_TRANSFER_CONFIRMED'),
                this.translate.instant('BACKEND_LOCALIZATION.MINED'),
                this.translate.instant('BACKEND_LOCALIZATION.LOCKED'),
                this.translate.instant('BACKEND_LOCALIZATION.IS_MINIMIZE'),
                this.translate.instant('BACKEND_LOCALIZATION.RESTORE'),
                this.translate.instant('BACKEND_LOCALIZATION.TRAY_MENU_SHOW'),
                this.translate.instant('BACKEND_LOCALIZATION.TRAY_MENU_MINIMIZE'),
            ];
            this.backendService.setBackendLocalization(stringsArray, this.variablesService.settings.language);
        } else {
            console.warn('Wait Translate Use');
            setTimeout(() => {
                this.setBackendLocalization();
            }, 10000);
        }
    }

    ngOnInit(): void {
        this.backendService.initService().subscribe({
            next: (initMessage) => {
                console.log('Init message: ', initMessage);
                this.backendService.webkitLaunchedScript();

                this.backendService.start_backend(false, '127.0.0.1', 11512, (st2, dd2) => {
                    console.log(st2, dd2);
                });

                this.backendService.eventSubscribe(Commands.quit_requested, () => {
                    if (this.onQuitRequest) {
                        return;
                    }

                    // this.ngZone.run(async () => {
                    //     this.router.navigate(['/']);
                    // });

                    this.dialog.closeAll();
                    this.matDialog.closeAll();

                    this.needOpenWallets = [];
                    this.variablesService.daemon_state = 5;

                    const saveFunction = (): void => {
                        this.backendService.storeAppData((): void => {
                            const recursionCloseWallets = (): void => {
                                if (this.variablesService.wallets.length > 0) {
                                    const lastIndex = this.variablesService.wallets.length - 1;
                                    this.backendService.closeWallet(this.variablesService.wallets[lastIndex].wallet_id, () => {
                                        this.variablesService.wallets.splice(lastIndex, 1);
                                        recursionCloseWallets();
                                    });
                                } else {
                                    this.ngZone.run(() => {
                                        this.backendService.quitRequest();
                                    });
                                }
                            };
                            recursionCloseWallets();
                        });
                    };
                    if (this.variablesService.appPass) {
                        this.backendService.storeSecureAppData(saveFunction);
                    } else {
                        saveFunction();
                    }

                    this.onQuitRequest = true;
                });

                this.backendService.eventSubscribe(Commands.update_wallet_status, (data) => {
                    console.log('----------------- update_wallet_status -----------------');
                    console.log(data);

                    const wallet_state = data.wallet_state;
                    const is_mining = data.is_mining;
                    const wallet = this.variablesService.getWallet(data.wallet_id);
                    // 1-synch, 2-ready, 3 - error
                    if (wallet) {
                        this.ngZone.run(() => {
                            wallet.loaded = false;
                            wallet.staking = is_mining;
                            if (wallet_state === 2) {
                                // ready
                                wallet.loaded = true;
                            }
                            if (wallet_state === 3) {
                                // error
                                // wallet.error = true;
                            }
                            wallet.balances = data.balances;
                            wallet.mined_total = data.minied_total;
                            wallet.alias_available = data.is_alias_operations_available;
                            wallet.has_bare_unspent_outputs = data.has_bare_unspent_outputs;
                        });
                    }
                });

                this.backendService.eventSubscribe(Commands.wallet_sync_progress, (data) => {
                    console.log('----------------- wallet_sync_progress -----------------');
                    console.log(data);
                    const wallet = this.variablesService.getWallet(data.wallet_id);
                    if (wallet) {
                        this.ngZone.run(() => {
                            wallet.progress = data.progress < 0 ? 0 : data.progress > 100 ? 100 : data.progress;
                            if (!this.variablesService.sync_started) {
                                this.variablesService.sync_started = true;
                                this.variablesService.sync_wallets[wallet.wallet_id] = true;
                            }
                            this.addToStore(wallet, true); // subscribe on data
                            if (wallet.progress === 0) {
                                wallet.loaded = false;
                            } else if (wallet.progress === 100) {
                                wallet.loaded = true;
                                this.addToStore(wallet, false);
                                this.variablesService.sync_started = false;
                                this.variablesService.sync_wallets[wallet.wallet_id] = false;
                            }
                        });
                    }
                });

                this.backendService.eventSubscribe(Commands.update_daemon_state, (data) => {
                    console.log('----------------- update_daemon_state -----------------');
                    console.log('DAEMON:' + data.daemon_network_state);
                    console.log(data);
                    // this.variablesService.exp_med_ts = data['expiration_median_timestamp'] + 600 + 1;
                    this.variablesService.setExpMedTs(data['expiration_median_timestamp'] + 600 + 1);
                    this.variablesService.net_time_delta_median = data.net_time_delta_median;
                    this.variablesService.last_build_available = data.last_build_available;
                    this.variablesService.last_build_displaymode = data.last_build_displaymode;
                    this.variablesService.setHeightApp(data.height);
                    this.variablesService.setHeightMax(data.max_net_seen_height);

                    this.variablesService.setDownloadedBytes(data.downloaded_bytes);
                    this.variablesService.setTotalBytes(data.download_total_data_size);

                    this.ngZone.run(() => {
                        const daemon_state: number = data['daemon_network_state'];
                        this.variablesService.daemon_state = daemon_state;
                        this.variablesService.daemon_state$.next(daemon_state);

                        if (data['daemon_network_state'] === 1) {
                            const max = data['max_net_seen_height'] - data['synchronization_start_height'];
                            const current = data.height - data['synchronization_start_height'];
                            const return_val = Math.floor(((current * 100) / max) * 100) / 100;
                            if (max === 0 || return_val < 0) {
                                this.variablesService.sync.progress_value = 0;
                                this.variablesService.sync.progress_value_text = '0.00';
                                this.variablesService.sync.blocks.current = 0;
                                this.variablesService.sync.blocks.max = 0;
                            } else if (return_val >= 100) {
                                this.variablesService.sync.progress_value = 100;
                                this.variablesService.sync.progress_value_text = '99.99';
                                this.variablesService.sync.blocks.current = current;
                                this.variablesService.sync.blocks.max = max;
                            } else {
                                this.variablesService.sync.progress_value = return_val;
                                this.variablesService.sync.progress_value_text = return_val.toFixed(2);
                                this.variablesService.sync.blocks.current = current;
                                this.variablesService.sync.blocks.max = max;
                            }
                        }

                        if (data['daemon_network_state'] === 6) {
                            const max = data['download_total_data_size'];
                            const current = data['downloaded_bytes'];
                            const return_val = Math.floor((current / max) * 100);
                            if (max === 0 || return_val < 0) {
                                this.variablesService.download.progress_value = 0;
                                this.variablesService.download.progress_value_text = '0.00';
                            } else if (return_val >= 100) {
                                this.variablesService.download.progress_value = 100;
                                this.variablesService.download.progress_value_text = '99.99';
                            } else {
                                this.variablesService.download.progress_value = return_val;
                                this.variablesService.download.progress_value_text = return_val.toFixed(2);
                            }
                        }
                    });

                    if (!this.firstOnlineState && data['daemon_network_state'] === 2) {
                        this.getAllAliases();
                        this._walletsService.loadAliasInfoListForWallets();
                        this.backendService.getDefaultFee((status_fee, data_fee) => {
                            this.variablesService.default_fee_big = new BigNumber(data_fee);
                            this.variablesService.default_fee = this.intToMoneyPipe.transform(data_fee);
                        });
                        this.firstOnlineState = true;
                    }
                });

                this.backendService.eventSubscribe(Commands.money_transfer, (data) => {
                    console.log('----------------- money_transfer -----------------');
                    console.log(data);

                    if (!data.ti) {
                        return;
                    }

                    const wallet_id = data.wallet_id;
                    const tr_info = data.ti;

                    const wallet = this.variablesService.getWallet(wallet_id);
                    if (wallet) {
                        if (wallet.history.length > 40) {
                            wallet.history.splice(40, 1);
                        }
                        this.ngZone.run(() => {
                            wallet.balances = data.balances;

                            if (tr_info.tx_type === 6) {
                                this.variablesService.refreshStakingEvent$.next();
                            }

                            let tr_exists = wallet.excluded_history.some((elem) => elem.tx_hash === tr_info.tx_hash);
                            tr_exists = !tr_exists ? wallet.history.some((elem) => elem.tx_hash === tr_info.tx_hash) : tr_exists;

                            if (wallet.currentPage === 1) {
                                wallet.prepareHistory([tr_info]);
                                if (wallet.restore) {
                                    wallet.total_history_item = wallet.history.length;
                                    wallet.totalPages = Math.ceil(wallet.total_history_item / this.variablesService.count);
                                    wallet.totalPages > this.variablesService.maxPages
                                        ? (wallet.pages = new Array(5).fill(1).map((value, index) => value + index))
                                        : (wallet.pages = new Array(wallet.totalPages).fill(1).map((value, index) => value + index));
                                }
                            }

                            if (hasOwnProperty(tr_info, 'contract')) {
                                const exp_med_ts = this.variablesService.exp_med_ts;
                                const height_app = this.variablesService.height_app;
                                const contract = tr_info.contract[0];
                                if (tr_exists) {
                                    for (let i = 0; i < wallet.contracts.length; i++) {
                                        if (
                                            wallet.contracts[i].contract_id === contract.contract_id &&
                                            wallet.contracts[i].is_a === contract.is_a
                                        ) {
                                            wallet.contracts[i].cancel_expiration_time = contract.cancel_expiration_time;
                                            wallet.contracts[i].expiration_time = contract.expiration_time;
                                            wallet.contracts[i].height = contract.height;
                                            wallet.contracts[i].timestamp = contract.timestamp;
                                            break;
                                        }
                                    }
                                    // $rootScope.getContractsRecount();
                                    return;
                                }

                                if (contract.state === 1 && contract.expiration_time < exp_med_ts) {
                                    contract.state = 110;
                                } else if (contract.state === 5 && contract.cancel_expiration_time < exp_med_ts) {
                                    contract.state = 130;
                                } else if (contract.state === 1) {
                                    const searchResult2 = this.variablesService.settings.notViewedContracts.find(
                                        (elem) =>
                                            elem.state === 110 && elem.is_a === contract.is_a && elem.contract_id === contract.contract_id
                                    );
                                    if (searchResult2) {
                                        if (searchResult2.time === contract.expiration_time) {
                                            contract.state = 110;
                                        } else {
                                            for (let j = 0; j < this.variablesService.settings.notViewedContracts.length; j++) {
                                                if (
                                                    this.variablesService.settings.notViewedContracts[j].contract_id ===
                                                        contract.contract_id &&
                                                    this.variablesService.settings.notViewedContracts[j].is_a === contract.is_a
                                                ) {
                                                    this.variablesService.settings.notViewedContracts.splice(j, 1);
                                                    break;
                                                }
                                            }
                                            for (let j = 0; j < this.variablesService.settings.viewedContracts.length; j++) {
                                                if (
                                                    this.variablesService.settings.viewedContracts[j].contract_id ===
                                                        contract.contract_id &&
                                                    this.variablesService.settings.viewedContracts[j].is_a === contract.is_a
                                                ) {
                                                    this.variablesService.settings.viewedContracts.splice(j, 1);
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                } else if (contract.state === 2 && (contract.height === 0 || height_app - contract.height < 10)) {
                                    contract.state = 201;
                                } else if (contract.state === 2) {
                                    const searchResult3 = this.variablesService.settings.viewedContracts.some(
                                        (elem) =>
                                            elem.state === 120 && elem.is_a === contract.is_a && elem.contract_id === contract.contract_id
                                    );
                                    if (searchResult3) {
                                        contract.state = 120;
                                    }
                                } else if (contract.state === 5) {
                                    const searchResult4 = this.variablesService.settings.notViewedContracts.find(
                                        (elem) =>
                                            elem.state === 130 && elem.is_a === contract.is_a && elem.contract_id === contract.contract_id
                                    );
                                    if (searchResult4) {
                                        if (searchResult4.time === contract.cancel_expiration_time) {
                                            contract.state = 130;
                                        } else {
                                            for (let j = 0; j < this.variablesService.settings.notViewedContracts.length; j++) {
                                                if (
                                                    this.variablesService.settings.notViewedContracts[j].contract_id ===
                                                        contract.contract_id &&
                                                    this.variablesService.settings.notViewedContracts[j].is_a === contract.is_a
                                                ) {
                                                    this.variablesService.settings.notViewedContracts.splice(j, 1);
                                                    break;
                                                }
                                            }
                                            for (let j = 0; j < this.variablesService.settings.viewedContracts.length; j++) {
                                                if (
                                                    this.variablesService.settings.viewedContracts[j].contract_id ===
                                                        contract.contract_id &&
                                                    this.variablesService.settings.viewedContracts[j].is_a === contract.is_a
                                                ) {
                                                    this.variablesService.settings.viewedContracts.splice(j, 1);
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                } else if (contract.state === 6 && (contract.height === 0 || height_app - contract.height < 10)) {
                                    contract.state = 601;
                                }

                                const searchResult = this.variablesService.settings.viewedContracts.some(
                                    (elem) =>
                                        elem.state === contract.state &&
                                        elem.is_a === contract.is_a &&
                                        elem.contract_id === contract.contract_id
                                );
                                contract.is_new = !searchResult;

                                let findContract = false;
                                for (let i = 0; i < wallet.contracts.length; i++) {
                                    if (
                                        wallet.contracts[i].contract_id === contract.contract_id &&
                                        wallet.contracts[i].is_a === contract.is_a
                                    ) {
                                        for (const prop in contract) {
                                            if (hasOwnProperty(contract, prop)) {
                                                wallet.contracts[i][prop] = contract[prop];
                                            }
                                        }
                                        findContract = true;
                                        break;
                                    }
                                }
                                if (findContract === false) {
                                    wallet.contracts.push(contract);
                                }
                                // wallet.recountNewContracts();
                            }
                        });
                    }
                });

                this.backendService.backendObject[Commands.handle_deeplink_click].connect((data) => {
                    console.log('----------------- handle_deeplink_click -----------------');
                    console.log(data);
                    this.ngZone.run(() => {
                        if (data) {
                            this.variablesService.deeplink$.next(data);
                        }
                    });
                });

                this.backendService.eventSubscribe(Commands.money_transfer_cancel, (data) => {
                    console.log('----------------- money_transfer_cancel -----------------');
                    console.log(data);

                    if (!data.ti) {
                        return;
                    }

                    const wallet_id = data.wallet_id;
                    const tr_info = data.ti;
                    const wallet = this.variablesService.getWallet(wallet_id);

                    if (wallet) {
                        if (hasOwnProperty(tr_info, 'contract')) {
                            for (let i = 0; i < wallet.contracts.length; i++) {
                                if (
                                    wallet.contracts[i].contract_id === tr_info.contract[0].contract_id &&
                                    wallet.contracts[i].is_a === tr_info.contract[0].is_a
                                ) {
                                    if (wallet.contracts[i].state === 1 || wallet.contracts[i].state === 110) {
                                        wallet.contracts[i].is_new = true;
                                        wallet.contracts[i].state = 140;
                                        // wallet.recountNewContracts();
                                    }
                                    break;
                                }
                            }
                        }

                        wallet.removeFromHistory(tr_info.tx_hash);

                        let error_tr = '';
                        switch (tr_info.tx_type) {
                            case 0:
                                error_tr =
                                    this.translate.instant('ERRORS.TX_TYPE_NORMAL') +
                                    '<br>' +
                                    tr_info.tx_hash +
                                    '<br>' +
                                    wallet.name +
                                    '<br>' +
                                    wallet.address +
                                    '<br>' +
                                    this.translate.instant('ERRORS.TX_TYPE_NORMAL_TO') +
                                    ' ' +
                                    this.intToMoneyPipe.transform(tr_info.amount) +
                                    ' ' +
                                    this.translate.instant('ERRORS.TX_TYPE_NORMAL_END');
                                break;
                            case 1:
                                // this.translate.instant('ERRORS.TX_TYPE_PUSH_OFFER');
                                break;
                            case 2:
                                // this.translate.instant('ERRORS.TX_TYPE_UPDATE_OFFER');
                                break;
                            case 3:
                                // this.translate.instant('ERRORS.TX_TYPE_CANCEL_OFFER');
                                break;
                            case 4:
                                error_tr =
                                    this.translate.instant('ERRORS.TX_TYPE_NEW_ALIAS') +
                                    '<br>' +
                                    tr_info.tx_hash +
                                    '<br>' +
                                    wallet.name +
                                    '<br>' +
                                    wallet.address +
                                    '<br>' +
                                    this.translate.instant('ERRORS.TX_TYPE_NEW_ALIAS_END');
                                break;
                            case 5:
                                error_tr =
                                    this.translate.instant('ERRORS.TX_TYPE_UPDATE_ALIAS') +
                                    '<br>' +
                                    tr_info.tx_hash +
                                    '<br>' +
                                    wallet.name +
                                    '<br>' +
                                    wallet.address +
                                    '<br>' +
                                    this.translate.instant('ERRORS.TX_TYPE_NEW_ALIAS_END');
                                break;
                            case 6:
                                error_tr = this.translate.instant('ERRORS.TX_TYPE_COIN_BASE');
                                break;
                        }
                        if (error_tr) {
                            this.modalService.prepareModal('error', error_tr);
                        }
                    }
                });

                this.backendService.eventSubscribe(Commands.on_core_event, (data) => {
                    console.log('----------------- on_core_event -----------------');
                    console.log(data);

                    data = JSON.parse(data);

                    if (data.events != null) {
                        for (let i = 0, length = data.events.length; i < length; i++) {
                            switch (data.events[i].method) {
                                case 'CORE_EVENT_BLOCK_ADDED':
                                    break;
                                case 'CORE_EVENT_ADD_ALIAS':
                                    if (this.variablesService.all_aliases_loaded) {
                                        const newAlias: AliasInfo = data.events[i].detail;
                                        this.variablesService.all_aliases.push(newAlias);
                                    }
                                    const wallet1 = this._walletsService.getWalletByAddress(data.events[i].details.address);
                                    if (wallet1) {
                                        this._walletsService.loadAliasInfoList(wallet1);
                                    }
                                    break;
                                case 'CORE_EVENT_UPDATE_ALIAS':
                                    if (this.variablesService.all_aliases_loaded) {
                                        const findAlias = this.variablesService.all_aliases.find(
                                            ({ address, alias }) =>
                                                address === data.events[i].details.details.address && alias === data.events[i].details.alias
                                        );
                                        if (findAlias) {
                                            findAlias.address = data.events[i].details.details.address;
                                            findAlias.comment = data.events[i].details.details.comment;
                                        }
                                    }
                                    const wallet2 = this._walletsService.getWalletByAddress(data.events[i].details.details.address);
                                    if (wallet2) {
                                        this._walletsService.loadAliasInfoList(wallet2);
                                    }

                                    if (data.events[i].details.old_address !== data.events[i].details.details.address) {
                                        const wallet3 = this._walletsService.getWalletByAddress(data.events[i].details.old_address);
                                        if (wallet3) {
                                            this._walletsService.loadAliasInfoList(wallet3);
                                        }
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                });

                this.intervalUpdateContractsState = setInterval(() => {
                    this.variablesService.wallets.forEach((wallet) => {
                        wallet.contracts.forEach((contract) => {
                            if (
                                contract.state === 201 &&
                                contract.height !== 0 &&
                                this.variablesService.height_app - contract.height >= 10
                            ) {
                                contract.state = 2;
                                contract.is_new = true;
                                console.warn('need check state in contracts');
                            } else if (
                                contract.state === 601 &&
                                contract.height !== 0 &&
                                this.variablesService.height_app - contract.height >= 10
                            ) {
                                contract.state = 6;
                                contract.is_new = true;
                            }
                        });
                    });
                }, 30000);

                this.expMedTsEvent = this.variablesService.getExpMedTsEvent.subscribe({
                    next: (newTimestamp: number) => {
                        this.variablesService.wallets.forEach((wallet) => {
                            wallet.contracts.forEach((contract) => {
                                if (contract.state === 1 && contract.expiration_time <= newTimestamp) {
                                    contract.state = 110;
                                    contract.is_new = true;
                                } else if (contract.state === 5 && contract.cancel_expiration_time <= newTimestamp) {
                                    contract.state = 130;
                                    contract.is_new = true;
                                }
                            });
                        });
                    },
                });

                this.backendService.getAppData((status, data) => {
                    if (data && Object.keys(data).length > 0) {
                        for (const key in data) {
                            if (hasOwnProperty(data, key) && hasOwnProperty(this.variablesService.settings, key)) {
                                this.variablesService.settings[key] = data[key];
                            }
                        }

                        const { isDarkTheme$, visibilityBalance$, settings } = this.variablesService;

                        isDarkTheme$.next(settings.isDarkTheme);
                        visibilityBalance$.next(settings.visibilityBalance);
                        settings.appUseTor = false; // TODO: Delete this line after return appUseTor
                        if (hasOwnProperty(settings, 'scale') && ['8px', '10px', '12px', '14px'].indexOf(settings.scale) !== -1) {
                            this.renderer.setStyle(document.documentElement, 'font-size', settings.scale);
                        } else {
                            settings.scale = '10px';
                            this.renderer.setStyle(document.documentElement, 'font-size', settings.scale);
                        }

                        this.renderer.setAttribute(document.documentElement, 'class', settings.isDarkTheme ? 'dark' : 'light');
                    }
                    this.translate.use(this.variablesService.settings.language);
                    this.setBackendLocalization();

                    this.backendService.setLogLevel(this.variablesService.settings.appLog);
                    this.backendService.setEnableTor(this.variablesService.settings.appUseTor);

                    if (!this.variablesService.settings.wallets || this.variablesService.settings.wallets.length === 0) {
                        this.ngZone.run(() => {
                            this.router.navigate([`${paths.auth}/${pathsChildrenAuth.noWallet}`]).then();
                        });
                        return;
                    }

                    if (this.router.url !== '/login') {
                        this.backendService.haveSecureAppData((statusPass) => {
                            console.log('--------- haveSecureAppData ----------', statusPass);
                            if (statusPass) {
                                this.ngZone.run(() => {
                                    this.router.navigate(['/login'], {
                                        queryParams: { type: 'auth' },
                                    });
                                });
                            } else {
                                if (Object.keys(data).length !== 0) {
                                    this.needOpenWallets = JSON.parse(JSON.stringify(this.variablesService.settings.wallets));
                                    this.ngZone.run(() => {
                                        this.variablesService.appLogin = true;
                                        this.router.navigate(['/']);
                                    });
                                } else {
                                    this.ngZone.run(() => {
                                        this.router.navigate(['/login'], {
                                            queryParams: { type: 'reg' },
                                        });
                                    });
                                }
                            }
                        });
                    }
                });

                this.backendService.dispatchAsyncCallResult();

                this.backendService.handleCurrentActionState();

                this.getVersion();

                this.getInfo();

                this._startWrapInfoPolling();

                this.backendService.isRemnoteNodeModePreconfigured((is_remote_node: boolean) => {
                    this.variablesService.is_remote_node = is_remote_node;
                });

                setTimeout(() => {
                    this.backendService.getOptions();
                    this._getZanoCurrentSupply();
                }, 10 * 1000);
            },
            error: (error) => {
                console.log(error);
            },
        });

        const updateTime = 10 * 60 * 1000; // 10 minutes
        interval(updateTime)
            .pipe(takeUntil(this._destroy$))
            .subscribe({
                next: () => {
                    this.variablesService.loadCurrentPriceForAllAssets();
                },
            });

        this.variablesService.isDarkTheme$.pipe(takeUntil(this._destroy$)).subscribe({
            next: (isDarkTheme) => {
                this.renderer.setAttribute(document.documentElement, 'class', isDarkTheme ? 'dark' : 'light');
            },
        });
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();

        if (this.intervalUpdateContractsState) {
            clearInterval(this.intervalUpdateContractsState);
        }

        this.expMedTsEvent.unsubscribe();
    }

    getAllAliases(): void {
        this.backendService.getAllAliases((status, data, error) => {
            console.warn(error);

            if (error === 'CORE_BUSY') {
                window.setTimeout(() => {
                    this.getAllAliases();
                }, 10000);
            } else if (error === 'OVERFLOW') {
                this.variablesService.all_aliases = [];
                this.variablesService.all_aliases_loaded = false;
            } else {
                this.variablesService.all_aliases_loaded = true;
                if (data.aliases && data.aliases.length) {
                    this.variablesService.all_aliases = [];
                    this.variablesService.all_aliases = data.aliases.filter(Boolean).sort((a: AliasInfo, b: AliasInfo) => {
                        if (a.alias.length > b.alias.length) {
                            return 1;
                        }
                        if (a.alias.length < b.alias.length) {
                            return -1;
                        }
                        if (a.alias > b.alias) {
                            return 1;
                        }
                        if (a.alias < b.alias) {
                            return -1;
                        }
                        return 0;
                    });
                }
            }
        });
    }

    addToStore(wallet, boolean): void {
        const value = this.store.state.sync;
        if (value && value.length > 0) {
            const sync = value.filter((item) => item.wallet_id === wallet.wallet_id);
            if (sync && sync.length > 0) {
                const result = value.map((item) => {
                    if (item.wallet_id === wallet.wallet_id) {
                        return { sync: boolean, wallet_id: wallet.wallet_id };
                    } else {
                        return item;
                    }
                });
                this.store.set(StateKeys.sync, result);
            } else {
                value.push({ sync: boolean, wallet_id: wallet.wallet_id });
                this.store.set(StateKeys.sync, value);
            }
        } else {
            this.store.set(StateKeys.sync, [{ sync: boolean, wallet_id: wallet.wallet_id }]);
        }
    }

    getVersion(): void {
        this.backendService.getVersion((version, type, error) => {
            this.ngZone.run(() => {
                if (!error) {
                    console.log('----------------- version -----------------', version);
                    console.log('----------------- type -----------------', type);
                    this.variablesService.testnet = type === 'testnet';
                    this.variablesService.networkType = type;

                    this._loadVerifiedAssetInfoWhitelist(type);
                }
            });
        });
    }

    private _loadVerifiedAssetInfoWhitelist(type: 'mainnet' | 'testnet'): void {
        const updateTime: number = 10 * 60 * 1000; // 10 minutes

        interval(updateTime)
            .pipe(
                startWith(0),
                switchMap(() => this._apiService.getVerifiedAssetInfoWhitelist(type).pipe(retry(2))),
                takeUntil(this._destroy$)
            )
            .subscribe({
                next: ({ assets }) => {
                    this.variablesService.verifiedAssetInfoWhitelist = assets;
                    this._walletsService.setVerifiedAssetInfoWhitelist(assets);
                },
            });
    }

    getInfo(): void {
        const updateTime: number = 60 * 1000; // 1 minutes

        interval(updateTime)
            .pipe(startWith(0), takeUntil(this._destroy$))
            .subscribe({
                next: () => {
                    const params = {
                        jsonrpc: '2.0',
                        method: 'getinfo',
                    };

                    this.backendService.call_rpc(params, (status, response_data) => {
                        this.ngZone.run(() => {
                            this.variablesService.info$.next(response_data.result);
                        });
                    });
                },
            });
    }

    private _getZanoCurrentSupply(): void {
        const params: ParamsCallRpc = {
            jsonrpc: '2.0',
            id: 0,
            method: 'getinfo',
            params: {
                flags: 1024,
            },
        };

        this.backendService.call_rpc(params, (status, response_data) => {
            this.ngZone.run(() => {
                this.variablesService.zano_current_supply = response_data?.['result']?.['total_coins'];
            });
        });
    }

    private _setTranslate(): void {
        this.translate.addLangs(['en', 'fr', 'de', 'it', 'pt']);
        this.translate.setDefaultLang('en');
        this.translate
            .use('en')
            .pipe(takeUntil(this._destroy$))
            .subscribe({
                next: () => {
                    this.translateUsed = true;
                },
            });
    }

    private _setResponseClasses(): void {
        this._breakpointObserver
            .observe([
                Breakpoints.XSmall, // XSmall	(max-width: 599.98px)
                Breakpoints.Small, // Small	(min-width: 600px) and (max-width: 959.98px)
                Breakpoints.Medium, // Medium	(min-width: 960px) and (max-width: 1279.98px)
                Breakpoints.Large, // Large	(min-width: 1280px) and (max-width: 1919.98px)
                Breakpoints.XLarge, // XLarge	(min-width: 1920px)
            ])
            .pipe(takeUntil(this._destroy$))
            .subscribe((result) => {
                for (const query of Object.keys(result.breakpoints)) {
                    if (result.breakpoints[query]) {
                        this.currentScreenSize = this.displayNameMap.get(query) ?? 'Unknown';

                        document.body.classList.remove(...this.displayNameMap.values());
                        document.body.classList.add(this.currentScreenSize);
                    }
                }
            });
    }

    private _startWrapInfoPolling(): void {
        interval(3 * 60 * 1000)
            .pipe(
                startWith(0),
                switchMap(() =>
                    this._apiService.getWrapInfo().pipe(
                        retry(2),
                        catchError((error) => {
                            this.variablesService.is_wrap_info_service_inactive$.next(true);
                            this.backendService.printLog({
                                is_wrap_info_service_inactive: true,
                                wrap_info_error: error,
                            });
                            return of(null);
                        })
                    )
                ),
                takeUntil(this._destroy$)
            )
            .subscribe((wrap_info: WrapInfo | null) => {
                if (wrap_info) {
                    this.variablesService.is_wrap_info_service_inactive$.next(false);
                    this.variablesService.wrap_info$.next(wrap_info);

                    this.backendService.printLog({
                        is_wrap_info_service_inactive: false,
                        wrap_info,
                    });
                }
            });
    }
}
