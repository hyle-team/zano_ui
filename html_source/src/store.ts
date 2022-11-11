import { distinctUntilChanged, pluck } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { Wallet } from './app/_helpers/models/wallet.model';
import { Injectable } from '@angular/core';

export interface Sync {
  sync: boolean;
  wallet_id: number;
}

export interface State {
  wallets: Wallet[];
  sync: Sync[];

  [key: string]: any;
}

const state: State = {
  wallets: undefined,
  sync: undefined,
};

@Injectable()
export class Store {
  private subject = new BehaviorSubject<State>(state);
  private store = this.subject.asObservable().pipe(distinctUntilChanged());

  get value() {
    return this.subject.value;
  }

  select<T>(name: string): Observable<T> {
    return this.store.pipe(pluck(name));
  }

  // tslint:disable-next-line:no-shadowed-variable
  set(name: string, state: any) {
    this.subject.next({ ...this.value, [name]: state });
  }
}
