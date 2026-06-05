import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { StakingTimeToBlockCardComponent } from './staking-time-to-block-card.component';
import { CircularProgressComponent } from '@parts/components/circular-progress/circular-progress.component';
import { moneyToInt } from '@parts/functions/money-to-int';
import { ZANO_ASSET_INFO } from '@parts/data/zano-assets-info';
import { BehaviorSubject } from 'rxjs';
import { VariablesService } from '@parts/services/variables.service';
import { BigNumber } from 'bignumber.js';

describe('StakingTimeToBlockCardComponent', () => {
    let component: StakingTimeToBlockCardComponent;
    let fixture: ComponentFixture<StakingTimeToBlockCardComponent>;
    let currentWalletState: {
        wallet_id: number;
        current_pos_attempts: number;
        est_iterations_per_pos_block: number;
        getBalanceByTicker: (ticker: string) => { unlocked: BigNumber.Value } | undefined;
    };
    let unlockedZano = moneyToInt('2', ZANO_ASSET_INFO.decimal_point);
    let variablesServiceMock: {
        current_wallet: typeof currentWalletState;
        currentWalletChanged$: BehaviorSubject<any>;
        posStatusUpdated$: BehaviorSubject<number>;
    };

    beforeEach(async () => {
        currentWalletState = {
            wallet_id: 1,
            current_pos_attempts: 0,
            est_iterations_per_pos_block: 0,
            getBalanceByTicker: (ticker: string) => (ticker === 'ZANO' ? { unlocked: unlockedZano } : undefined),
        };

        variablesServiceMock = {
            current_wallet: currentWalletState,
            currentWalletChanged$: new BehaviorSubject<any>(currentWalletState),
            posStatusUpdated$: new BehaviorSubject<number>(1),
        };

        await TestBed.configureTestingModule({
            imports: [StakingTimeToBlockCardComponent, TranslateModule.forRoot()],
            providers: [
                {
                    provide: VariablesService,
                    useValue: variablesServiceMock,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(StakingTimeToBlockCardComponent);
        component = fixture.componentInstance;

        const translate = TestBed.inject(TranslateService);
        translate.setTranslation('en', {
            POS_ESTIMATE_CARD: {
                ESTIMATE_LABEL: 'Estimated time to find the block:',
                ATTEMPT_LABEL: 'Attempt:',
            },
            ESTIMATE_TIME: {
                NA: 'N/A',
                LESS_THAN_MINUTE: '< 1 min',
                UNITS: {
                    DAY: 'days',
                    HOUR: 'hours',
                    MIN: 'min',
                },
            },
        });
        translate.use('en');
    });

    it('shows N/A and zero progress when unlocked < 1 ZANO', () => {
        currentWalletState.current_pos_attempts = 40;
        currentWalletState.est_iterations_per_pos_block = 100;
        unlockedZano = moneyToInt('0.5', ZANO_ASSET_INFO.decimal_point);
        variablesServiceMock.posStatusUpdated$.next(1);

        fixture.detectChanges();

        const text = fixture.nativeElement.textContent;
        expect(text).toContain('N/A');
        expect(text).toContain('40');

        const progressCmp = fixture.debugElement.query(By.directive(CircularProgressComponent));
        expect(progressCmp.componentInstance.progress).toBe(0);
    });

    it('shows N/A and zero progress when estimator is non-positive', () => {
        currentWalletState.current_pos_attempts = 40;
        currentWalletState.est_iterations_per_pos_block = 0;
        unlockedZano = moneyToInt('2', ZANO_ASSET_INFO.decimal_point);
        variablesServiceMock.posStatusUpdated$.next(1);

        fixture.detectChanges();

        const text = fixture.nativeElement.textContent;
        expect(text).toContain('N/A');

        const progressCmp = fixture.debugElement.query(By.directive(CircularProgressComponent));
        expect(progressCmp.componentInstance.progress).toBe(0);
    });

    it('renders calculated progress, estimate and attempt for normal case', () => {
        currentWalletState.current_pos_attempts = 40;
        currentWalletState.est_iterations_per_pos_block = 100;
        unlockedZano = moneyToInt('2', ZANO_ASSET_INFO.decimal_point);
        variablesServiceMock.posStatusUpdated$.next(1);

        fixture.detectChanges();

        const text = fixture.nativeElement.textContent;
        expect(text).toContain('Estimated time to find the block: ~ 2 min');
        expect(text).toContain('Attempt:');
        expect(text).toContain('40');

        const progressCmp = fixture.debugElement.query(By.directive(CircularProgressComponent));
        expect(progressCmp.componentInstance.progress).toBe(40);
    });
});
