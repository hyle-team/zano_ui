import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module';
import { CommonModule } from '@angular/common';
import {
  ContextMenuModule,
  ContextMenuService,
} from '@perfectmemory/ngx-contextmenu';
import {
  TranslateLoader,
  TranslateModule,
  TranslateModuleConfig,
} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as highcharts from 'highcharts';
import exporting from 'highcharts/modules/exporting.src';

export function highchartsFactory(): any[] {
  highcharts.setOptions({
    time: {
      useUTC: false,
    },
  });

  return [exporting];
}

export const provideHighchartsFactory = {
  provide: HIGHCHARTS_MODULES,
  useFactory: highchartsFactory,
};

export function HttpLoaderFactory(httpClient: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

export const translateModuleConfig: TranslateModuleConfig = {
  loader: {
    provide: TranslateLoader,
    useFactory: HttpLoaderFactory,
    deps: [HttpClient],
  },
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot(translateModuleConfig),
    AppRoutingModule,
    PagesModule,
    ContextMenuModule,
    ChartModule,
  ],
  providers: [ContextMenuService, provideHighchartsFactory],
  bootstrap: [AppComponent],
})
export class AppModule {}
