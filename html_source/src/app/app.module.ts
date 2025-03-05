import { inject, NgModule, Provider } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule, TranslateModuleConfig } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as highcharts from 'highcharts';
import exporting from 'highcharts/modules/exporting.src';
import { MoneyToIntPipeModule } from '@parts/pipes';
import { OpenWalletModalComponent } from '@parts/modals/open-wallet-modal/open-wallet-modal.component';
import { FlexModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { RegisterContextTemplatesComponent } from '@parts/components/register-context-templates.component';
import { DEFAULT_DIALOG_CONFIG, DialogConfig } from '@angular/cdk/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { materialZanoIcons } from '../assets/material-zano-icons';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';

export function highchartsFactory(): any[] {
    highcharts.setOptions({
        time: {
            useUTC: false
        }
    });

    return [exporting];
}

export const provideHighchartsFactory = {
    provide: HIGHCHARTS_MODULES,
    useFactory: highchartsFactory
};

export function HttpLoaderFactory(httpClient: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

const translateModuleConfig: TranslateModuleConfig = {
    loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
    }
};

const provideDialog: Provider = {
    provide: DEFAULT_DIALOG_CONFIG,
    useValue: <DialogConfig>{
        width: '95vw',
        maxWidth: '54rem',
        maxHeight: '90vh',
        hasBackdrop: true,
        disableClose: true
    }
};

const providerMatDialog: Provider = {
    provide: MAT_DIALOG_DEFAULT_OPTIONS,
    useValue: <MatDialogConfig>{
        width: '95vw',
        maxWidth: '54rem',
        maxHeight: '90vh',
        panelClass: 'zano-mat-dialog',
        hasBackdrop: true,
        disableClose: true
    }
};

@NgModule({
    declarations: [AppComponent, OpenWalletModalComponent],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        TranslateModule.forRoot(translateModuleConfig),
        AppRoutingModule,
        PagesModule,
        ChartModule,
        MoneyToIntPipeModule,
        FlexModule,
        FormsModule,
        MatDialogModule,
        RegisterContextTemplatesComponent
    ],
    providers: [provideHighchartsFactory, provideDialog, providerMatDialog],
    bootstrap: [AppComponent]
})
export class AppModule {
    private _matIconRegistry: MatIconRegistry = inject(MatIconRegistry);

    private _sanitizer: DomSanitizer = inject(DomSanitizer);

    constructor() {
        this._registerIcons(materialZanoIcons);
    }

    private _registerIcons(icons: Array<string>): void {
        icons.forEach((icon: string) => {
            this._matIconRegistry.addSvgIcon(
                icon,
                this._sanitizer.bypassSecurityTrustResourceUrl(`assets/material-zano-icons/${icon}.svg`)
            );
        });
    }
}
