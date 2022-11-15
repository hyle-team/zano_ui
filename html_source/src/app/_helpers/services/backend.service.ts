import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { VariablesService } from './variables.service';
import { ModalService } from './modal.service';
import { MoneyToIntPipe } from '../pipes/money-to-int.pipe';
import JSONBigNumber from 'json-bignumber';
import { BigNumber } from 'bignumber.js';
import { Alias, Wallet } from '../models/wallet.model';
import { Assets, AssetsInfo } from '../models/assets';
import { StateKeys, Store } from 'store';

export interface PramsObj {
  [key: string]: any;
}

export type PramsArray = (string | PramsObj)[];

export type Params = string | PramsObj | PramsArray;

export enum ParamsType {
  array = 'array',
  object = 'object',
  string = 'string',
}

export const getParamsType = (value: Params): ParamsType | null => {
  if (!value) {
    return null;
  }
  const array: false | ParamsType.array =
    Array.isArray(value) && ParamsType.array;
  const object: false | ParamsType =
    Object.keys(ParamsType).includes(typeof value) && ParamsType[typeof value];
  return array || object || null;
};

export type ConvertersObjectForTypes = {
  [key in ParamsType]: (value: Params) => string | string[];
};

export const convertersObjectForTypes: ConvertersObjectForTypes = {
  [ParamsType.string]: (value: string): string => value,
  [ParamsType.object]: (value: PramsObj): string =>
    JSONBigNumber.stringify(value),
  [ParamsType.array]: (value: PramsArray): string[] =>
    value.map(v => {
      return typeof v === ParamsType.string
        ? (v as string)
        : JSONBigNumber.stringify(v);
    }),
};

export const convertorParams = (value: Params): string | string[] => {
  const type: ParamsType = getParamsType(value);
  return convertersObjectForTypes[type](value);
};

export interface ResponseAsyncTransfer {
  error_code: string;
  response_data: {
    success: boolean;
    tx_blob_size: number;
    tx_hash: string;
  };
}

export interface AsyncCommandResults {
  job_id: number;
  response: ResponseAsyncTransfer;
}

export enum StatusCurrentActionState {
  STATE_SENDING = 'STATE_SENDING',
  STATE_SENT_SUCCESS = 'STATE_SENT_SUCCESS',
  STATE_SEND_FAILED = 'STATE_SEND_FAILED',
  STATE_INITIALIZING = 'STATE_INITIALIZING',
  STATE_DOWNLOADING_CONSENSUS = 'STATE_DOWNLOADING_CONSENSUS',
  STATE_MAKING_TUNNEL_A = 'STATE_MAKING_TUNNEL_A',
  STATE_MAKING_TUNNEL_B = 'STATE_MAKING_TUNNEL_B',
  STATE_CREATING_STREAM = 'STATE_CREATING_STREAM',
  STATE_FAILED = 'STATE_FAILED',
  STATE_SUCCESS = 'STATE_SUCCESS',
}

export interface CurrentActionState {
  status: StatusCurrentActionState;
  wallet_id: number;
}

@Injectable()
export class BackendService {
  dispatchAsyncCallResult$ = new Subject<AsyncCommandResults>();
  handleCurrentActionState$ = new Subject<CurrentActionState>();

  backendObject: any;

  backendLoaded = false;

  constructor(
    private translate: TranslateService,
    private variablesService: VariablesService,
    private modalService: ModalService,
    private moneyToIntPipe: MoneyToIntPipe,
    private ngZone: NgZone,
    private store: Store
  ) {
    this.getAssetsInfo();
  }

  static bigNumberParser(key, val): any {
    if (
      val.constructor.name === 'BigNumber' &&
      [
        'balance',
        'unlocked_balance',
        'amount',
        'fee',
        'b_fee',
        'to_pay',
        'a_pledge',
        'b_pledge',
        'coast',
        'a',
      ].indexOf(key) === -1
    ) {
      return val.toNumber();
    }
    if (key === 'rcv' || key === 'spn') {
      for (let i = 0; i < val.length; i++) {
        val[i] = new BigNumber(val[i]);
      }
    }
    return val;
  }

  static Debug(type, message) {
    switch (type) {
      case 0:
        console.error(message);
        break;
      case 1:
        console.warn(message);
        break;
      case 2:
        console.log(message);
        break;
      default:
        console.log(message);
        break;
    }
  }

  eventSubscribe(command, callback): void {
    if (command === 'on_core_event') {
      this.backendObject[command].connect(callback);
    } else {
      this.backendObject[command].connect(str => {
        callback(JSONBigNumber.parse(str, BackendService.bigNumberParser));
      });
    }
  }

  initService(): Observable<unknown> {
    return new Observable(observer => {
      if (!this.backendLoaded) {
        this.backendLoaded = true;
        const that = this;
        (<any>window).QWebChannel(
          (<any>window).qt.webChannelTransport,
          function (channel) {
            that.backendObject = channel.objects.mediator_object;
            observer.next('ok');
          }
        );
      } else {
        if (!this.backendObject) {
          observer.error('error');
          observer.error('error');
        }
      }
    });
  }

  webkitLaunchedScript(): any {
    return this.runCommand('webkit_launched_script');
  }

  quitRequest(): any {
    return this.runCommand('on_request_quit');
  }

  getAppData(callback): void {
    this.runCommand('get_app_data', {}, callback);
  }

  storeAppData(callback?): void {
    if (this.variablesService.wallets.length > 0) {
      this.variablesService.settings.wallets = [];
      this.variablesService.wallets.forEach(wallet => {
        this.variablesService.settings.wallets.push({
          name: wallet.name,
          path: wallet.path,
        });
      });
    }
    this.runCommand('store_app_data', this.variablesService.settings, callback);
  }

  getSecureAppData(pass, callback): void {
    this.runCommand('get_secure_app_data', pass, callback);
  }

  setMasterPassword(pass, callback): void {
    this.runCommand('set_master_password', pass, callback);
  }

  checkMasterPassword(pass, callback): void {
    this.runCommand('check_master_password', pass, callback);
  }

  getIsDisabledNotifications(callback): void {
    const params = {};
    this.runCommand('get_is_disabled_notifications', params, callback);
  }

  setIsDisabledNotifications(state): void {
    this.runCommand('set_is_disabled_notifications', state);
  }

  storeSecureAppData(callback?): void {
    const wallets = [];
    const contacts = [];
    this.variablesService.wallets.forEach(wallet => {
      wallets.push({
        name: wallet.name,
        pass: wallet.pass,
        path: wallet.path,
        staking: wallet.staking,
      });
    });
    this.variablesService.contacts.forEach(contact => {
      contacts.push({
        name: contact.name,
        address: contact.address,
        notes: contact.notes,
      });
    });
    const data = { wallets: wallets, contacts: contacts };
    this.backendObject['store_secure_app_data'](
      JSON.stringify(data),
      this.variablesService.appPass,
      dataStore => {
        this.backendCallback(dataStore, {}, callback, 'store_secure_app_data');
      }
    );
  }

  dropSecureAppData(callback?): void {
    this.backendObject['drop_secure_app_data'](dataStore => {
      this.backendCallback(dataStore, {}, callback, 'drop_secure_app_data');
    });
  }

  haveSecureAppData(callback): void {
    this.runCommand('have_secure_app_data', {}, callback);
  }

  saveFileDialog(caption, fileMask, default_path, callback): void {
    const dir = default_path ? default_path : '/';
    const params = {
      caption: caption,
      filemask: fileMask,
      default_dir: dir,
    };
    this.runCommand('show_savefile_dialog', params, callback);
  }

  openFileDialog(caption, fileMask, default_path, callback): void {
    const dir = default_path ? default_path : '/';
    const params = {
      caption: caption,
      filemask: fileMask,
      default_dir: dir,
    };
    this.runCommand('show_openfile_dialog', params, callback);
  }

  storeFile(path, buff): void {
    this.backendObject['store_to_file'](path, buff);
  }

  loadFile(path, callback): void {
    this.runCommand('load_from_file', path, callback);
  }

  push_offer(params, callback): void {
    this.runCommand('push_offer', params, callback);
  }

  generateWallet(path, pass, callback): void {
    const params = {
      path: path,
      pass: pass,
    };
    this.runCommand('generate_wallet', params, callback);
  }

  exportWalletHistory(json_string): void {
    this.runCommand('export_wallet_history', json_string);
  }

  openWallet(path, pass, txs_to_return, testEmpty, callback): void {
    const params = {
      path: path,
      pass: pass,
      txs_to_return: txs_to_return,
    };
    params['testEmpty'] = !!testEmpty;
    this.runCommand('open_wallet', params, callback);
  }

  closeWallet(wallet_id, callback?): void {
    this.runCommand('close_wallet', { wallet_id: +wallet_id }, callback);
  }

  getSmartWalletInfo({ wallet_id, seed_password }, callback): void {
    this.runCommand(
      'get_smart_wallet_info',
      { wallet_id: +wallet_id, seed_password },
      callback
    );
  }

  getSeedPhraseInfo(param, callback): void {
    this.runCommand('get_seed_phrase_info', param, callback);
  }

  runWallet(wallet_id, callback?): void {
    this.runCommand('run_wallet', { wallet_id: +wallet_id }, callback);
  }

  isValidRestoreWalletText(param, callback): void {
    this.runCommand('is_valid_restore_wallet_text', param, callback);
  }

  restoreWallet(path, pass, seed_phrase, seed_pass, callback): void {
    const params = {
      seed_phrase: seed_phrase,
      path: path,
      pass: pass,
      seed_pass,
    };
    this.runCommand('restore_wallet', params, callback);
  }

  sendMoney(
    from_wallet_id,
    to_address,
    amount,
    fee,
    mixin,
    comment,
    hide,
    callback
  ): void {
    const params = {
      wallet_id: parseInt(from_wallet_id, 10),
      destinations: [
        {
          address: to_address,
          amount: amount,
        },
      ],
      mixin_count: mixin ? parseInt(mixin, 10) : 0,
      lock_time: 0,
      fee: this.moneyToIntPipe.transform(fee),
      comment: comment,
      push_payer: !hide,
    };

    this.asyncCall('transfer', params, callback);
  }

  validateAddress(address, callback): void {
    this.runCommand('validate_address', address, callback);
  }

  setClipboard(str, callback?): any {
    return this.runCommand('set_clipboard', str, callback);
  }

  getClipboard(callback): any {
    return this.runCommand('get_clipboard', {}, callback);
  }

  createProposal(
    wallet_id,
    title,
    comment,
    a_addr,
    b_addr,
    to_pay,
    a_pledge,
    b_pledge,
    time,
    payment_id,
    callback
  ): void {
    const params = {
      wallet_id: parseInt(wallet_id, 10),
      details: {
        t: title,
        c: comment,
        a_addr: a_addr,
        b_addr: b_addr,
        to_pay: this.moneyToIntPipe.transform(to_pay),
        a_pledge: this.moneyToIntPipe.transform(a_pledge),
        b_pledge: this.moneyToIntPipe.transform(b_pledge),
      },
      payment_id: payment_id,
      expiration_period: parseInt(time, 10) * 60 * 60,
      fee: this.variablesService.default_fee_big,
      b_fee: this.variablesService.default_fee_big,
    };
    BackendService.Debug(1, params);
    this.runCommand('create_proposal', params, callback);
  }

  getContracts(wallet_id, callback): void {
    const params = {
      wallet_id: parseInt(wallet_id, 10),
    };
    BackendService.Debug(1, params);
    this.runCommand('get_contracts', params, callback);
  }

  acceptProposal(wallet_id, contract_id, callback): void {
    const params = {
      wallet_id: parseInt(wallet_id, 10),
      contract_id: contract_id,
    };
    BackendService.Debug(1, params);
    this.runCommand('accept_proposal', params, callback);
  }

  releaseProposal(wallet_id, contract_id, release_type, callback): void {
    const params = {
      wallet_id: parseInt(wallet_id, 10),
      contract_id: contract_id,
      release_type: release_type, // "normal" or "burn"
    };
    BackendService.Debug(1, params);
    this.runCommand('release_contract', params, callback);
  }

  requestCancelContract(wallet_id, contract_id, time, callback): void {
    const params = {
      wallet_id: parseInt(wallet_id, 10),
      contract_id: contract_id,
      fee: this.variablesService.default_fee_big,
      expiration_period: parseInt(time, 10) * 60 * 60,
    };
    BackendService.Debug(1, params);
    this.runCommand('request_cancel_contract', params, callback);
  }

  acceptCancelContract(wallet_id, contract_id, callback): void {
    const params = {
      wallet_id: parseInt(wallet_id, 10),
      contract_id: contract_id,
    };
    BackendService.Debug(1, params);
    this.runCommand('accept_cancel_contract', params, callback);
  }

  getMiningHistory(wallet_id, callback): void {
    this.runCommand(
      'get_mining_history',
      { wallet_id: parseInt(wallet_id, 10) },
      callback
    );
  }

  startPosMining(wallet_id, callback?): void {
    this.runCommand(
      'start_pos_mining',
      { wallet_id: parseInt(wallet_id, 10) },
      callback
    );
  }

  stopPosMining(wallet_id, callback?): void {
    this.runCommand(
      'stop_pos_mining',
      { wallet_id: parseInt(wallet_id, 10) },
      callback
    );
  }

  openUrlInBrowser(url, callback?): void {
    this.runCommand('open_url_in_browser', url, callback);
  }

  start_backend(node, host, port, callback): void {
    const params = {
      configure_for_remote_node: node,
      remote_node_host: host,
      remote_node_port: parseInt(port, 10),
    };
    this.runCommand('start_backend', params, callback);
  }

  getDefaultFee(callback): void {
    this.runCommand('get_default_fee', {}, callback);
  }

  setBackendLocalization(stringsArray, title, callback?): void {
    const params = {
      strings: stringsArray,
      language_title: title,
    };
    this.runCommand('set_localization_strings', params, callback);
  }

  registerAlias(
    wallet_id,
    alias,
    address,
    fee,
    comment,
    reward,
    callback
  ): void {
    const params = {
      wallet_id: wallet_id,
      alias: {
        alias: alias,
        address: address,
        tracking_key: '',
        comment: comment,
      },
      fee: this.moneyToIntPipe.transform(fee),
      reward: this.moneyToIntPipe.transform(reward),
    };
    this.runCommand('request_alias_registration', params, callback);
  }

  updateAlias(wallet_id, alias, fee, callback): void {
    const params = {
      wallet_id: wallet_id,
      alias: {
        alias: alias.name.replace('@', ''),
        address: alias.address,
        tracking_key: '',
        comment: alias.comment,
      },
      fee: this.moneyToIntPipe.transform(fee),
    };
    this.runCommand('request_alias_update', params, callback);
  }

  getAllAliases(callback): void {
    this.runCommand('get_all_aliases', {}, callback);
  }

  getAliasByName(value, callback): any {
    return this.runCommand('get_alias_info_by_name', value, callback);
  }

  getAliasByAddress(value, callback): any {
    return this.runCommand('get_alias_info_by_address', value, callback);
  }

  getAliasCoast(alias, callback): void {
    this.runCommand('get_alias_coast', { v: alias }, callback);
  }

  resyncWallet(id): void {
    this.runCommand('resync_wallet', { wallet_id: id });
  }

  getWalletAlias(address): Partial<Alias> {
    if (address !== null && this.variablesService.daemon_state === 2) {
      if (this.variablesService.aliasesChecked[address] == null) {
        this.variablesService.aliasesChecked[address] = {};
        if (this.variablesService.aliases.length) {
          for (
            let i = 0, length = this.variablesService.aliases.length;
            i < length;
            i++
          ) {
            if (
              i in this.variablesService.aliases &&
              this.variablesService.aliases[i]['address'] === address
            ) {
              this.variablesService.aliasesChecked[address]['name'] =
                this.variablesService.aliases[i].name;
              this.variablesService.aliasesChecked[address]['address'] =
                this.variablesService.aliases[i].address;
              this.variablesService.aliasesChecked[address]['comment'] =
                this.variablesService.aliases[i].comment;
              return this.variablesService.aliasesChecked[address];
            }
          }
        }
        this.getAliasByAddress(address, (status, data) => {
          if (status) {
            this.variablesService.aliasesChecked[data.address]['name'] =
              '@' + data.alias;
            this.variablesService.aliasesChecked[data.address]['address'] =
              data.address;
            this.variablesService.aliasesChecked[data.address]['comment'] =
              data.comment;
          }
        });
      }
      return this.variablesService.aliasesChecked[address];
    }
    return {};
  }

  getContactAlias(): void {
    if (
      this.variablesService.contacts.length > 0 &&
      this.variablesService.daemon_state === 2
    ) {
      this.variablesService.contacts.map(contact => {
        this.getAliasByAddress(contact.address, (status, data) => {
          if (status) {
            if (data.alias) {
              contact.alias = '@' + data.alias;
            }
          } else {
            contact.alias = null;
          }
        });
      });
    }
  }

  getRecentTransfers(id, offset, count, exclude_mining_txs, callback): void {
    const params = {
      wallet_id: id,
      offset: offset,
      count: count,
      exclude_mining_txs: exclude_mining_txs,
    };
    this.runCommand('get_recent_transfers', params, callback);
  }

  getPoolInfo(callback): void {
    this.runCommand('get_tx_pool_info', {}, callback);
  }

  getVersion(callback): void {
    this.runCommand('get_version', {}, (status, version) => {
      this.runCommand('get_network_type', {}, (status_network, type) => {
        callback(version, type);
      });
    });
  }

  setLogLevel(level): any {
    return this.runCommand('set_log_level', { v: level });
  }

  asyncCall(
    command: string,
    params: PramsObj,
    callback?: (job_id?: number) => void | any
  ): any {
    return this.runCommand(
      'async_call',
      [command, params],
      (status, { job_id }: { job_id: number }) => {
        callback(job_id);
      }
    );
  }

  dispatchAsyncCallResult(): void {
    this.backendObject['dispatch_async_call_result'].connect(
      (job_id: string, json_resp: string) => {
        const asyncCommandResults: AsyncCommandResults = {
          job_id: +job_id,
          response: JSON.parse(json_resp),
        };
        this.ngZone.run(() =>
          this.dispatchAsyncCallResult$.next(asyncCommandResults)
        );
      }
    );
  }

  handleCurrentActionState(): void {
    this.backendObject['handle_current_action_state'].connect(
      (response: string) => {
        const currentActionState: CurrentActionState = JSON.parse(response);
        this.ngZone.run(() =>
          this.handleCurrentActionState$.next(currentActionState)
        );
      }
    );
  }

  setEnableTor(value: boolean): any {
    return this.runCommand('set_enable_tor', <{ v: boolean }>{ v: value });
  }

  getOptions(): any {
    return this.runCommand(
      'get_options',
      {},
      (
        status,
        {
          disable_price_fetch,
          use_debug_mode,
        }: { disable_price_fetch: boolean; use_debug_mode: boolean }
      ) => {
        this.variablesService.disable_price_fetch$.next(disable_price_fetch);
        this.variablesService.use_debug_mode$.next(use_debug_mode);
      }
    );
  }

  getWalletInfo(wallet: Wallet): any {
    // const { wallet_id } = wallet;
    // TODO: after change backend
    const mockAssets: Assets = [
      {
        asset_id:
          '4a6013cdcbe82978e043c32b76e8ee9cf91100a8368875063a1eba5034e23d07',
        balance: 200000,
        unlocked_balance: 200000,
      },
      {
        asset_id:
          '5a6013cdcbe82978e043c32b76e8ee9cf91100a8368875063a1eba5034e23d07',
        balance: 100000,
        unlocked_balance: 100000,
      },
    ];
    wallet.assets = mockAssets;
    // return this.runCommand('get_wallet_info', { wallet_id }, ({ assets }: { assets: Assets }) => {
    //   wallet.assets = assets;
    // });
  }

  getAssetsInfo(): any {
    const mockAssetsInfo: AssetsInfo = [
      {
        asset_id:
          '4a6013cdcbe82978e043c32b76e8ee9cf91100a8368875063a1eba5034e23d07',
        logo: 'https://some.link.png',
        ticker: 'WUSD',
        title: 'Wrapped USD',
      },
      {
        asset_id:
          '5a6013cdcbe82978e043c32b76e8ee9cf91100a8368875063a1eba5034e23d07',
        logo: 'https://some.link2.png',
        ticker: 'WBTC',
        title: 'Wrapped BTC',
      },
    ];
    this.store.set(StateKeys.assetsInfo, mockAssetsInfo);
    // return this.runCommand('some_command...', {}, ({ assets }: { assets: AssetsInfo }) => {
    //  this.store.set(StateKeys.assetsInfo, assets);
    // });
  }

  private informerRun(error, params, command): void {
    let error_translate = '';
    switch (error) {
      case 'NOT_ENOUGH_MONEY':
        error_translate = 'ERRORS.NOT_ENOUGH_MONEY';
        // error_translate = 'ERRORS.NO_MONEY'; maybe that one?
        if (command === 'cancel_offer') {
          error_translate = this.translate.instant(
            'ERRORS.NO_MONEY_REMOVE_OFFER',
            {
              fee: this.variablesService.default_fee,
              currency: this.variablesService.defaultCurrency,
            }
          );
        }
        break;
      case 'CORE_BUSY':
        error_translate = 'ERRORS.CORE_BUSY';
        break;
      case 'BUSY':
        error_translate = 'ERRORS.DAEMON_BUSY';
        break;
      case 'OVERFLOW':
        if (command !== 'get_all_aliases') {
          error_translate = '';
        }
        break;
      case 'NOT_ENOUGH_OUTPUTS_FOR_MIXING':
        error_translate = 'ERRORS.NOT_ENOUGH_OUTPUTS_TO_MIX';
        break;
      case 'TX_IS_TOO_BIG':
        error_translate = 'ERRORS.TRANSACTION_IS_TO_BIG';
        break;
      case 'DISCONNECTED':
        error_translate = 'ERRORS.TRANSFER_ATTEMPT';
        break;
      case 'ACCESS_DENIED':
        error_translate = 'ERRORS.ACCESS_DENIED';
        break;
      case 'TX_REJECTED':
        // if (command === 'request_alias_registration') {
        // error_translate = 'INFORMER.ALIAS_IN_REGISTER';
        // } else {
        error_translate = 'ERRORS.TRANSACTION_ERROR';
        // }
        break;
      case 'INTERNAL_ERROR':
        error_translate = 'ERRORS.TRANSACTION_ERROR';
        break;
      case 'BAD_ARG':
        error_translate = 'ERRORS.BAD_ARG';
        break;
      case 'WALLET_WRONG_ID':
        error_translate = 'ERRORS.WALLET_WRONG_ID';
        break;
      case 'WALLET_WATCH_ONLY_NOT_SUPPORTED':
        error_translate = 'ERRORS.WALLET_WATCH_ONLY_NOT_SUPPORTED';
        break;
      // case 'WRONG_PASSWORD':
      // params = JSON.parse(params);
      // if (!params.testEmpty) {
      //   error_translate = 'ERRORS.WRONG_PASSWORD';
      // }
      // break;
      case 'FILE_RESTORED':
        if (command === 'open_wallet') {
          error_translate = 'ERRORS.FILE_RESTORED';
        }
        break;
      case 'FILE_NOT_FOUND':
        if (
          command !== 'open_wallet' &&
          command !== 'get_alias_info_by_name' &&
          command !== 'get_alias_info_by_address'
        ) {
          error_translate = this.translate.instant('ERRORS.FILE_NOT_FOUND');
          params = JSON.parse(params);
          if (params.path) {
            error_translate += ': ' + params.path;
          }
        }
        break;
      case 'NOT_FOUND':
        if (
          command !== 'open_wallet' &&
          command !== 'get_alias_info_by_name' &&
          command !== 'get_alias_info_by_address'
        ) {
          error_translate = this.translate.instant('ERRORS.FILE_NOT_FOUND');
          params = JSON.parse(params);
          if (params.path) {
            error_translate += ': ' + params.path;
          }
        }
        break;
      case 'CANCELED':
      case '':
        break;
      case 'FAIL':
        if (
          command === 'create_proposal' ||
          command === 'accept_proposal' ||
          command === 'release_contract' ||
          command === 'request_cancel_contract' ||
          command === 'accept_cancel_contract'
        ) {
          error_translate = ' ';
        }
        break;
      case 'ALREADY_EXISTS':
        error_translate = 'ERRORS.FILE_EXIST';
        break;
      case 'FAILED':
        BackendService.Debug(
          0,
          `Error: (${error}) was triggered by command: ${command}`
        );
        break;
      default:
        error_translate = '';
    }
    if (error.indexOf('FAIL:failed to save file') > -1) {
      error_translate = 'ERRORS.FILE_NOT_SAVED';
    }
    if (
      error.indexOf('FAILED:failed to open binary wallet file for saving') >
        -1 &&
      command === 'generate_wallet'
    ) {
      error_translate = '';
    }

    if (error_translate !== '') {
      this.modalService.prepareModal('error', error_translate);
    }
  }

  private commandDebug(command, params, result): void {
    BackendService.Debug(
      2,
      '----------------- ' + command + ' -----------------'
    );
    const debug = {
      _send_params: params,
      _result: result,
    };
    BackendService.Debug(2, debug);
    try {
      BackendService.Debug(
        2,
        JSONBigNumber.parse(result, BackendService.bigNumberParser)
      );
    } catch (e) {
      BackendService.Debug(2, { response_data: result, error_code: 'OK' });
    }
  }

  private backendCallback(resultStr, params, callback, command): any {
    let Result = resultStr;
    if (command !== 'get_clipboard') {
      if (!resultStr || resultStr === '') {
        Result = {};
      } else {
        try {
          Result = JSONBigNumber.parse(
            resultStr,
            BackendService.bigNumberParser
          );
        } catch (e) {
          Result = { response_data: resultStr, error_code: 'OK' };
        }
      }
    } else {
      Result = {
        error_code: 'OK',
        response_data: Result,
      };
    }

    const core_busy = Result.error_code === 'CORE_BUSY';
    const Status = Result.error_code === 'OK' || Result.error_code === 'TRUE';

    if (!Status && Status !== undefined && Result.error_code !== undefined) {
      BackendService.Debug(
        1,
        'API error for command: "' +
          command +
          '". Error code: ' +
          Result.error_code
      );
    }
    const data =
      typeof Result === 'object' && 'response_data' in Result
        ? Result.response_data
        : Result;

    let res_error_code = false;
    if (
      typeof Result === 'object' &&
      'error_code' in Result &&
      Result.error_code !== 'OK' &&
      Result.error_code !== 'TRUE' &&
      Result.error_code !== 'FALSE' &&
      Result.error_code !== 'WRAP'
    ) {
      if (core_busy) {
        setTimeout(() => {
          // this is will avoid update data when user
          // on other wallet after CORE_BUSY (blink of data)
          if (command !== 'get_recent_transfers') {
            this.runCommand(command, params, callback);
          } else {
            const current_wallet_id =
              this.variablesService.currentWallet.wallet_id;
            if (current_wallet_id === params.wallet_id) {
              this.runCommand(command, params, callback);
            }
          }
        }, 50);
      } else {
        this.informerRun(Result.error_code, params, command);
        res_error_code = Result.error_code;
      }
    }

    // if ( command === 'get_offers_ex' ){
    //   Service.printLog( "get_offers_ex offers count "+((data.offers)?data.offers.length:0) );
    // }

    if (!core_busy) {
      if (typeof callback === 'function') {
        callback(Status, data, res_error_code);
      } else {
        return data;
      }
    }
  }

  private runCommand(command, params?: Params, callback?): any {
    if (!this.backendObject) {
      return;
    }

    if (command === 'get_recent_transfers') {
      this.variablesService.get_recent_transfers = true;
    }

    const Action = this.backendObject[command];

    if (!Action) {
      BackendService.Debug(
        0,
        'Run Command Error! Command "' +
          command +
          '" don\'t found in backendObject'
      );
      return;
    }

    const that = this;
    const type: ParamsType = getParamsType(params);
    params = params && convertorParams(params);

    if (type === ParamsType.array) {
      Action(...(params as string[]), function (resultStr) {
        that.commandDebug(command, params, resultStr);
        return that.backendCallback(resultStr, params, callback, command);
      });
      return;
    }

    if (command === 'get_recent_transfers') {
      this.variablesService.get_recent_transfers = false;
    }
    Action(params, function (resultStr) {
      that.commandDebug(command, params, resultStr);
      return that.backendCallback(resultStr, params, callback, command);
    });
  }
}

/*

      toggleAutoStart: function (value) {
        return this.runCommand('toggle_autostart', asVal(value));
      },

      getOptions: function (callback) {
        return this.runCommand('get_options', {}, callback);
      },

      isFileExist: function (path, callback) {
        return this.runCommand('is_file_exist', path, callback);
      },

      isAutoStartEnabled: function (callback) {
        this.runCommand('is_autostart_enabled', {}, function (status, data) {
          if (angular.isFunction(callback)) {
            callback('error_code' in data && data.error_code !== 'FALSE')
          }
        });
      },

      resetWalletPass: function (wallet_id, pass, callback) {
        this.runCommand('reset_wallet_password', {wallet_id: wallet_id, pass: pass}, callback);
      },



      getOsVersion: function (callback) {
        this.runCommand('get_os_version', {}, function (status, version) {
          callback(version)
        })
      },

      getLogFile: function (callback) {
        this.runCommand('get_log_file', {}, function (status, version) {
          callback(version)
        })
      },

      resync_wallet: function (wallet_id, callback) {
        this.runCommand('resync_wallet', {wallet_id: wallet_id}, callback);
      },

      storeFile: function (path, buff, callback) {
        this.backendObject['store_to_file'](path, (typeof buff === 'string' ? buff : JSON.stringify(buff)), function (data) {
          backendCallback(data, {}, callback, 'store_to_file');
        });
      },

      getMiningEstimate: function (amount_coins, time, callback) {
        var params = {
          "amount_coins": $filter('money_to_int')(amount_coins),
          "time": parseInt(time)
        };
        this.runCommand('get_mining_estimate', params, callback);
      },

      backupWalletKeys: function (wallet_id, path, callback) {
        var params = {
          "wallet_id": wallet_id,
          "path": path
        };
        this.runCommand('backup_wallet_keys', params, callback);
      },

      setBlockedIcon: function (enabled, callback) {
        var mode = (enabled) ? "blocked" : "normal";
        Service.runCommand('bool_toggle_icon', mode, callback);
      },

      getWalletInfo: function (wallet_id, callback) {
        this.runCommand('get_wallet_info', {wallet_id: wallet_id}, callback);
      },

      printText: function (content) {
        return this.runCommand('print_text', {html_text: content});
      },

      printLog: function (msg, log_level) {
        return this.runCommand('print_log', {msg: msg, log_level: log_level});
      },

*/
