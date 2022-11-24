import { distinctUntilChanged, map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { Wallet } from './app/api/models/wallet.model';
import { Injectable } from '@angular/core';
import { AssetsInfo } from './app/api/models/assets.model';

export interface Sync {
  sync: boolean;
  wallet_id: number;
}

export enum StateKeys {
  wallets = 'wallets',
  sync = 'sync',
  assetsInfo = 'assetsInfo',
}

export interface State {
  [StateKeys.wallets]: Wallet[] | null | undefined;
  [StateKeys.sync]: Sync[] | null | undefined;
  [StateKeys.assetsInfo]: AssetsInfo | null | undefined;
}

const initialState: State = {
  wallets: undefined,
  sync: undefined,
  assetsInfo: undefined,
};

@Injectable({
  providedIn: 'root',
})
export class Store {
  private subject = new BehaviorSubject<State>(initialState);
  private store = this.subject.asObservable().pipe(distinctUntilChanged());

  get state(): State {
    return this.subject.value;
  }

  select<T>(name: StateKeys): Observable<T> {
    return this.store.pipe(
      map(state => state[name])
    ) as unknown as Observable<T>;
  }

  set(name: StateKeys, value: any): void {
    this.subject.next({ ...this.state, [name]: value });
  }
}
