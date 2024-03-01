import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type TLoaderId = 'fullScreen';

interface TDataLoader {
    state: boolean;
    message: string;
}

type TDataLoaders = {
    [key in TLoaderId]: TDataLoader
};

@Injectable({
  providedIn: 'root'
})
export class ZanoLoadersService {
    private _loaders$ = new BehaviorSubject<TDataLoaders>({
        fullScreen: { state: false, message: 'Loading' }
    });

    getState(id: TLoaderId): Observable<boolean> {
        return this._loaders$.pipe(map((loader) => loader[id].state ));
    }

    getMessage(id: TLoaderId): Observable<string> {
        return this._loaders$.pipe(map((loader) => loader[id].message ));
    }


    open(id: TLoaderId, message: string = 'Loading'): void {
        this._loaders$.next({
            ...this._loaders$.value,
            [id]: {
                state: true,
                message
            }
        });
    }

    close(id: TLoaderId): void {
        this._loaders$.next({
            ...this._loaders$.value,
            [id]: {
                ...this._loaders$.value[id],
                state: false
            }
        });
    }
}
