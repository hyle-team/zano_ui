import { Component, inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { VariablesService } from '@parts/services/variables.service';
import { Chart } from 'angular-highcharts';
import { BackendService } from '@api/services/backend.service';
import { IntToMoneyPipe } from '@parts/pipes/int-to-money-pipe/int-to-money.pipe';
import { BigNumber } from 'bignumber.js';
import { combineLatest, skip, Subject, Subscription } from 'rxjs';
import * as Highcharts from 'highcharts';
import { filter, takeUntil } from 'rxjs/operators';
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
export class StakingComponent implements OnInit, OnDestroy {
    public chart: Chart;

    public total: BigNumber = new BigNumber(0);

    public pending = {
        list: [],
        total: new BigNumber(0),
    };

    public themeChangesSubscription: Subscription;

    public readonly variablesService: VariablesService = inject(VariablesService);

    get isShowStagingSwitch(): boolean {
        const {
            currentWallet: { is_watch_only, is_auditable },
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

    ngOnInit(): void {
        const { settings } = this.variablesService;

        const savedStakingFilters = settings.filters.stakingFilters;

        if (savedStakingFilters) {
            this.filtersForm.patchValue(savedStakingFilters);
        }

        this.getMiningHistory();

        this.variablesService.getHeightAppEvent.pipe(takeUntil(this._destroy$)).subscribe({
            next: (newHeight: number) => {
                if (!this.pending.total.isZero()) {
                    const pendingCount = this.pending.list.length;
                    for (let i = pendingCount - 1; i >= 0; i--) {
                        if (newHeight - this.pending.list[i].h >= 10) {
                            this.pending.list.splice(i, 1);
                        }
                    }
                    if (pendingCount !== this.pending.list.length) {
                        this.pending.total = new BigNumber(0);
                        for (let i = 0; i < this.pending.list.length; i++) {
                            this.pending.total = this.pending.total.plus(this.pending.list[i].a);
                        }
                    }
                }
            },
        });

        this.variablesService.refreshStakingEvent$.pipe(takeUntil(this._destroy$)).subscribe({
            next: () => {
                this.getMiningHistory();
                this.changePeriod();
            }
        });

        this.filtersForm.valueChanges.pipe(takeUntil(this._destroy$)).subscribe({
            next: () => {
                settings.filters.stakingFilters = this.filtersForm.getRawValue();
                this.changePeriod();
            },
        });
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    drawChart(data): void {
        this.chart = new Chart({
            title: { text: '' },
            credits: { enabled: false },
            exporting: { enabled: false },
            legend: { enabled: false },
            chart: {
                type: 'line',
                backgroundColor: 'transparent',
                height: null,
                events: {
                    load: (): void => {
                        this.changePeriod();
                    },
                },
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
                    data: data,
                },
            ],
        });
    }

    getMiningHistory(): void {
        if (this.variablesService.currentWallet.loaded) {
            this._backendService.getMiningHistory(this.variablesService.currentWallet.wallet_id, (status, data) => {
                this.total = new BigNumber(0);
                this.pending.list = [];
                this.pending.total = new BigNumber(0);
                this.originalData = [];
                if (data.mined_entries) {
                    data.mined_entries.forEach((item, key) => {
                        if (item.t.toString().length === 10) {
                            data.mined_entries[key].t = new Date(item.t * 1000).setUTCMilliseconds(0);
                        }
                    });
                    data.mined_entries.forEach(item => {
                        this.total = this.total.plus(item.a);
                        if (this.variablesService.height_app - item.h < 10) {
                            this.pending.list.push(item);
                            this.pending.total = this.pending.total.plus(item.a);
                        }
                        this.originalData.push([parseInt(item.t, 10), parseFloat(this._intToMoneyPipe.transform(item.a))]);
                    });
                    this.originalData = this.originalData.sort(function (a, b) {
                        return a[0] - b[0];
                    });
                }
                this._ngZone.run(() => {
                    this.drawChart([]);

                    this.themeChangesSubscription?.unsubscribe();
                    this.themeChangesSubscription = combineLatest([this.chart.ref$, this.variablesService.isDarkTheme$])
                        .pipe(takeUntil(this._destroy$))
                        .subscribe({
                            next: ([ref, isDarkTheme]) => {
                                let option: Highcharts.Options = {};

                                if (isDarkTheme) {
                                    option = {
                                        ...option,
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
                                        },
                                        yAxis: {
                                            gridLineColor: '#2b3644',
                                            lineColor: '#2b3644',
                                            tickColor: '#2b3644',
                                            labels: {
                                                style: {
                                                    color: '#e0e0e0',
                                                },
                                            },
                                        },
                                        xAxis: {
                                            gridLineColor: '#2b3644',
                                            lineColor: '#2b3644',
                                            tickColor: '#2b3644',
                                            labels: {
                                                style: {
                                                    color: '#e0e0e0',
                                                },
                                            },
                                        },
                                    };
                                } else {
                                    option = {
                                        ...option,
                                        plotOptions: {
                                            area: {
                                                color: '#1F8FEB',
                                                marker: {
                                                    enabled: false,
                                                    radius: 2,
                                                },
                                                lineWidth: 2,
                                                threshold: null,
                                            },
                                        },
                                        yAxis: {
                                            gridLineColor: '#1F8FEB20',
                                            lineColor: '#1F8FEB20',
                                            tickColor: '#1F8FEB20',
                                            labels: {
                                                style: {
                                                    color: '#0C0C3A',
                                                },
                                            },
                                        },
                                        xAxis: {
                                            gridLineColor: '#1F8FEB20',
                                            lineColor: '#1F8FEB20',
                                            tickColor: '#1F8FEB20',
                                            labels: {
                                                style: {
                                                    color: '#0C0C3A',
                                                },
                                            },
                                        },
                                    };
                                }

                                ref.update(option, true);
                            },
                        });
                });
            });
        }
    }

    changePeriod(): void {
        if (!this.chart) {
            return;
        }

        const d = new Date();
        let min = null;
        const newData = [];

        const { group, period } = this.filtersForm.getRawValue();

        const makeGroupTime = (value: TGroup, date): number => {
            if (value === 'day') {
                return date.setHours(0, 0, 0, 0);
            } else if (value === 'week') {
                return new Date(date.setDate(date.getDate() - date.getDay())).setHours(0, 0, 0, 0);
            } else {
                return new Date(date.setDate(1)).setHours(0, 0, 0, 0);
            }
        };

        if (period === '1 week') {
            this.originalData.forEach(item => {
                const time = makeGroupTime(group, new Date(item[0]));
                const find = newData.find(itemNew => itemNew[0] === time);
                if (find) {
                    find[1] = new BigNumber(find[1]).plus(item[1]).toNumber();
                } else {
                    newData.push([time, item[1]]);
                }
            });
            this.chart.ref?.series[0].setData(newData, true);
            min = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate() - 7, 0, 0, 0, 0);
        } else if (period === '2 week') {
            this.originalData.forEach(item => {
                const time = makeGroupTime(group, new Date(item[0]));
                const find = newData.find(itemNew => itemNew[0] === time);
                if (find) {
                    find[1] = new BigNumber(find[1]).plus(item[1]).toNumber();
                } else {
                    newData.push([time, item[1]]);
                }
            });
            this.chart.ref?.series[0].setData(newData, true);
            min = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate() - 14, 0, 0, 0, 0);
        } else if (period === '1 month') {
            this.originalData.forEach(item => {
                const time = makeGroupTime(group, new Date(item[0]));
                const find = newData.find(itemNew => itemNew[0] === time);
                if (find) {
                    find[1] = new BigNumber(find[1]).plus(item[1]).toNumber();
                } else {
                    newData.push([time, item[1]]);
                }
            });
            this.chart.ref?.series[0].setData(newData, true);
            min = Date.UTC(d.getFullYear(), d.getMonth() - 1, d.getDate(), 0, 0, 0, 0);
        } else if (period === '3 month') {
            this.originalData.forEach(item => {
                const time = makeGroupTime(group, new Date(item[0]));
                const find = newData.find(itemNew => itemNew[0] === time);
                if (find) {
                    find[1] = new BigNumber(find[1]).plus(item[1]).toNumber();
                } else {
                    newData.push([time, item[1]]);
                }
            });
            this.chart.ref?.series[0].setData(newData, true);
            min = Date.UTC(d.getFullYear(), d.getMonth() - 3, d.getDate(), 0, 0, 0, 0);
        } else if (period === '6 month') {
            this.originalData.forEach(item => {
                const time = makeGroupTime(group, new Date(item[0]));
                const find = newData.find(itemNew => itemNew[0] === time);
                if (find) {
                    find[1] = new BigNumber(find[1]).plus(item[1]).toNumber();
                } else {
                    newData.push([time, item[1]]);
                }
            });
            this.chart.ref?.series[0].setData(newData, true);
            min = Date.UTC(d.getFullYear(), d.getMonth() - 6, d.getDate(), 0, 0, 0, 0);
        } else if (period === '1 year') {
            this.originalData.forEach(item => {
                const time = makeGroupTime(group, new Date(item[0]));
                const find = newData.find(itemNew => itemNew[0] === time);
                if (find) {
                    find[1] = new BigNumber(find[1]).plus(item[1]).toNumber();
                } else {
                    newData.push([time, item[1]]);
                }
            });
            this.chart.ref?.series[0].setData(newData, true);
            min = Date.UTC(d.getFullYear() - 1, d.getMonth(), d.getDate(), 0, 0, 0, 0);
        } else {
            this.originalData.forEach(item => {
                const time = makeGroupTime(group, new Date(item[0]));
                const find = newData.find(itemNew => itemNew[0] === time);
                if (find) {
                    find[1] = new BigNumber(find[1]).plus(item[1]).toNumber();
                } else {
                    newData.push([time, item[1]]);
                }
            });
            this.chart.ref?.series[0].setData(newData, true);
        }

        this.chart.ref?.xAxis[0].setExtremes(min, null);
    }
}
