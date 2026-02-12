import { AfterViewInit, Component, inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { VariablesService } from '@parts/services/variables.service';
import { Chart } from 'angular-highcharts';
import { BackendService } from '@api/services/backend.service';
import { IntToMoneyPipe } from '@parts/pipes/int-to-money-pipe/int-to-money.pipe';
import { BigNumber } from 'bignumber.js';
import { combineLatest, Subject } from 'rxjs';
import * as Highcharts from 'highcharts';
import { debounceTime, delay, take, takeUntil, tap } from 'rxjs/operators';
import { NonNullableFormBuilder } from '@angular/forms';

type TPeriod = '1 week' | '2 week' | '1 month' | '3 month' | '6 month' | '1 year' | 'All';

type TGroup = 'day' | 'week' | 'month';

interface IPeriodItem {
    title: string;
    value: TPeriod;
}

interface IGroupItem {
    title: string;
    value: TGroup;
}

const periodItems: IPeriodItem[] = [
    {
        title: 'STAKING.PERIOD.WEEK1',
        value: '1 week',
    },
    {
        title: 'STAKING.PERIOD.WEEK2',
        value: '2 week',
    },
    {
        title: 'STAKING.PERIOD.MONTH1',
        value: '1 month',
    },
    {
        title: 'STAKING.PERIOD.MONTH3',
        value: '3 month',
    },
    {
        title: 'STAKING.PERIOD.MONTH6',
        value: '6 month',
    },
    {
        title: 'STAKING.PERIOD.YEAR',
        value: '1 year',
    },
    {
        title: 'STAKING.PERIOD.ALL',
        value: 'All',
    },
];

const groupItems: IGroupItem[] = [
    {
        title: 'STAKING.GROUP.DAY',
        value: 'day',
    },
    {
        title: 'STAKING.GROUP.WEEK',
        value: 'week',
    },
    {
        title: 'STAKING.GROUP.MONTH',
        value: 'month',
    },
];

@Component({
    selector: 'app-staking',
    templateUrl: './staking.component.html',
    styles: [
        `
            :host {
                width: 100%;
                height: auto;
            }
        `,
    ],
})
export class StakingComponent implements OnInit, AfterViewInit, OnDestroy {
    public readonly variablesService: VariablesService = inject(VariablesService);

    public chart: Chart;

    public total: BigNumber = new BigNumber(0);

    public pending = {
        list: [],
        total: new BigNumber(0),
    };

    get isShowStagingSwitch(): boolean {
        const {
            current_wallet: { is_watch_only, is_auditable },
        } = this.variablesService;
        const condition1: boolean = !is_auditable && !is_watch_only;
        const condition2: boolean = is_auditable && !is_watch_only;
        return condition1 || condition2;
    }

    get isShowPointerDetails(): boolean {
        const { date, amount } = this.pointDetails;
        return date !== null && amount !== null;
    }

    public periodItems: IPeriodItem[] = periodItems;

    public groupItems: IGroupItem[] = groupItems;

    private readonly _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

    public readonly filtersForm = this._fb.group({
        group: this._fb.control<TGroup>('day'),
        period: this._fb.control<TPeriod>('All'),
    });

    public pointDetails: { date: string; amount: any } = {
        date: null,
        amount: null,
    };

    public originalData = [];

    private readonly _destroy$: Subject<void> = new Subject<void>();

    private readonly _backendService: BackendService = inject(BackendService);

    private readonly _ngZone: NgZone = inject(NgZone);

    private readonly _intToMoneyPipe: IntToMoneyPipe = inject(IntToMoneyPipe);

    private _cacheData: Map<string, { data: any[]; minDate: number }> = new Map();

    ngOnInit(): void {
        this.chart = new Chart({
            title: { text: '' },
            credits: { enabled: false },
            exporting: { enabled: false },
            legend: { enabled: false },
            chart: {
                type: 'line',
                backgroundColor: 'transparent',
            },
            yAxis: {
                min: 0,
                tickAmount: 5,
                title: {
                    text: '',
                },
                gridLineColor: '#2b3644',
                gridLineWidth: 2,
                lineColor: '#2b3644',
                lineWidth: 2,
                tickWidth: 2,
                tickLength: 120,
                tickColor: '#2b3644',
                labels: {
                    y: -8,
                    align: 'left',
                    x: -120,
                    style: {
                        color: '#e0e0e0',
                        fontSize: '13px',
                    },
                    format: '{value} ' + this.variablesService.defaultTicker,
                },
            },
            xAxis: {
                type: 'datetime',
                gridLineColor: '#2b3644',
                lineColor: '#2b3644',
                lineWidth: 2,
                tickWidth: 2,
                tickLength: 10,
                tickColor: '#2b3644',
                labels: {
                    style: {
                        color: '#e0e0e0',
                        fontSize: '13px',
                    },
                },
                minPadding: 0,
                maxPadding: 0,
                minRange: 86400000, // tickInterval: 86400000,
                minTickInterval: 3600000,
            },
            tooltip: {
                enabled: false,
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1,
                        },
                        stops: [
                            [0, 'rgba(124,181,236,0.2)'],
                            [1, 'rgba(124,181,236,0)'],
                        ],
                    },
                    marker: {
                        enabled: false,
                        radius: 2,
                    },
                    lineWidth: 2,
                    threshold: null,
                },

                series: {
                    point: {
                        events: {
                            mouseOver: (obj): void => {
                                this.pointDetails.date = obj.target['x'];
                                this.pointDetails.amount = obj.target['y'];
                            },
                        },
                    },
                    events: {
                        mouseOut: (): void => {
                            this.pointDetails.date = null;
                            this.pointDetails.amount = null;
                        },
                    },
                },
            },
            series: [
                {
                    type: 'area',
                    data: [],
                },
            ],
        });

        this._restoreFiltersForm();
        this._subscribeToHeightAppEvent();
        this._subscribeToRefreshStakingEvent();
        this._subscribeToFilterChanges();
        this._subscribeToThemeChanges();
    }

    ngAfterViewInit(): void {
        this.chart.ref$
            .pipe(
                delay(50),
                tap((ref) => ref.reflow()),
                delay(50),
                take(1)
            )
            .subscribe({
                next: () => {
                    this._getMiningHistory();
                },
            });
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    private _restoreFiltersForm(): void {
        const { stakingFilters } = this.variablesService.settings.filters;
        if (stakingFilters) {
            this.filtersForm.patchValue(stakingFilters);
        }
    }

    private _subscribeToHeightAppEvent(): void {
        const { getHeightAppEvent } = this.variablesService;

        getHeightAppEvent.pipe(takeUntil(this._destroy$)).subscribe({
            next: (newHeight: number) => {
                if (this.pending.total.isZero()) {
                    return;
                }

                this._updatePendingList(newHeight);
            },
        });
    }

    private _updatePendingList(newHeight: number): void {
        this.pending.list = this.pending.list.filter((item) => newHeight - item.h < 10);
        this.pending.total = this.pending.list.reduce((total, item) => total.plus(item.a), new BigNumber(0));
    }

    private _subscribeToRefreshStakingEvent(): void {
        this.variablesService.refreshStakingEvent$.pipe(takeUntil(this._destroy$)).subscribe({
            next: () => {
                this._getMiningHistory();
                this._changePeriod();
            },
        });
    }

    private _subscribeToFilterChanges(): void {
        this.filtersForm.valueChanges.pipe(debounceTime(250), takeUntil(this._destroy$)).subscribe({
            next: () => {
                this.variablesService.settings.filters.stakingFilters = this.filtersForm.getRawValue();
                this._changePeriod();
            },
        });
    }

    private _subscribeToThemeChanges(): void {
        combineLatest([this.chart.ref$, this.variablesService.isDarkTheme$])
            .pipe(takeUntil(this._destroy$))
            .subscribe({
                next: ([ref, isDarkTheme]) => {
                    const options = isDarkTheme ? this._getDarkThemeOptions() : this._getLightThemeOptions();
                    ref.update(options, true);
                },
            });
    }

    private _getDarkThemeOptions(): Highcharts.Options {
        return {
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0, 'rgba(124,181,236,0.2)'],
                            [1, 'rgba(124,181,236,0)'],
                        ],
                    },
                    marker: { enabled: false, radius: 2 },
                    lineWidth: 2,
                    threshold: null,
                },
            },
            yAxis: {
                gridLineColor: '#2b3644',
                lineColor: '#2b3644',
                tickColor: '#2b3644',
                labels: { style: { color: '#e0e0e0' } },
            },
            xAxis: {
                gridLineColor: '#2b3644',
                lineColor: '#2b3644',
                tickColor: '#2b3644',
                labels: { style: { color: '#e0e0e0' } },
            },
        };
    }

    private _getLightThemeOptions(): Highcharts.Options {
        return {
            plotOptions: {
                area: {
                    color: '#1F8FEB',
                    marker: { enabled: false, radius: 2 },
                    lineWidth: 2,
                    threshold: null,
                },
            },
            yAxis: {
                gridLineColor: '#1F8FEB20',
                lineColor: '#1F8FEB20',
                tickColor: '#1F8FEB20',
                labels: { style: { color: '#0C0C3A' } },
            },
            xAxis: {
                gridLineColor: '#1F8FEB20',
                lineColor: '#1F8FEB20',
                tickColor: '#1F8FEB20',
                labels: { style: { color: '#0C0C3A' } },
            },
        };
    }

    private _getMiningHistory(): void {
        const wallet = this.variablesService.current_wallet;

        const { wallet_id, loaded } = wallet;

        if (!loaded) {
            return;
        }

        this._backendService.getMiningHistory(wallet_id, (_, data) => {
            this._ngZone.run(() => {
                this._cacheData.clear();
                this._processMiningHistoryData(data);
            });
        });
    }

    private _processMiningHistoryData(data: any): void {
        this.total = new BigNumber(0);
        this.pending.list = [];
        this.pending.total = new BigNumber(0);
        this.originalData = [];

        if (!data.mined_entries) {
            return;
        }

        data.mined_entries.forEach((item) => {
            this._processMinedEntry(item);
        });

        this.originalData.sort((a, b) => a[0] - b[0]);
        this._changePeriod();
    }

    private _processMinedEntry(item: any): void {
        const timestamp = item.t.toString().length === 10 ? item.t * 1000 : item.t;
        item.t = new Date(timestamp).setUTCMilliseconds(0);

        this.total = this.total.plus(item.a);

        if (this.variablesService.height_app - item.h < 10) {
            this.pending.list.push(item);
            this.pending.total = this.pending.total.plus(item.a);
        }

        this.originalData.push([parseInt(item.t, 10), parseFloat(this._intToMoneyPipe.transform(item.a))]);
    }

    private _changePeriod(): void {
        this.chart.ref$.pipe(take(1)).subscribe({
            next: (ref) => {
                const formValue = this.filtersForm.getRawValue();
                const { group, period } = formValue;
                const currentDate = new Date();

                const periodsConfig = {
                    '1 week': 7,
                    '2 week': 14,
                    '1 month': 30,
                    '3 month': 90,
                    '6 month': 180,
                    '1 year': 365,
                };

                let data: any[];
                let minDate;
                const cacheKey = `${group}-${period}`;
                if (this._cacheData.has(cacheKey)) {
                    const cacheData = this._cacheData.get(cacheKey);
                    data = cacheData.data;
                    minDate = cacheData.minDate;
                } else {
                    data = this._getGroupedData(this.originalData, group);
                    minDate = this._getMinDateForPeriod(period, currentDate, periodsConfig);
                    this._cacheData.set(cacheKey, { data, minDate });
                }

                ref.series[0].setData([...data], true);
                ref.xAxis[0].setExtremes(minDate, null);
                ref.reflow();
            },
        });
    }

    private _getGroupedData(data: any[], group: TGroup): any[] {
        const groupedData = [];

        data.forEach((item) => {
            const time = this._makeGroupTime(group, new Date(item[0]));
            const existingItem = groupedData.find((newItem) => newItem[0] === time);

            if (existingItem) {
                existingItem[1] = new BigNumber(existingItem[1]).plus(item[1]).toNumber();
            } else {
                groupedData.push([time, item[1]]);
            }
        });

        return groupedData;
    }

    private _makeGroupTime(group: TGroup, date: Date): number {
        if (group === 'day') {
            return date.setHours(0, 0, 0, 0);
        } else if (group === 'week') {
            return new Date(date.setDate(date.getDate() - date.getDay())).setHours(0, 0, 0, 0);
        } else {
            return new Date(date.setDate(1)).setHours(0, 0, 0, 0);
        }
    }

    private _getMinDateForPeriod(
        period: TPeriod,
        currentDate: Date,
        periodsConfig: {
            [key: string]: number;
        }
    ): number | null {
        const daysOffset = periodsConfig[period];
        if (daysOffset) {
            return Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - daysOffset, 0, 0, 0, 0);
        }
        return null;
    }

    protected readonly Array = Array;
}
