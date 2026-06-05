import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EstimateTimePipe } from './estimate-time.pipe';

describe('EstimateTimePipe', () => {
    let pipe: EstimateTimePipe;
    let translate: TranslateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            providers: [EstimateTimePipe],
        });

        pipe = TestBed.inject(EstimateTimePipe);
        translate = TestBed.inject(TranslateService);

        translate.setTranslation('en', {
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

        translate.setTranslation('de', {
            ESTIMATE_TIME: {
                NA: 'N/V',
                LESS_THAN_MINUTE: '< 1 Min.',
                UNITS: {
                    DAY: 'Tage',
                    HOUR: 'Stunden',
                    MIN: 'Min.',
                },
            },
        });

        translate.use('en');
    });

    it('returns N/A for null/undefined/invalid values', () => {
        expect(pipe.transform(null)).toBe('N/A');
        expect(pipe.transform(undefined)).toBe('N/A');
        expect(pipe.transform(Number.NaN)).toBe('N/A');
        expect(pipe.transform(-1)).toBe('N/A');
    });

    it('formats values less than one minute', () => {
        expect(pipe.transform(59)).toBe('< 1 min');
    });

    it('formats minutes, hours and days', () => {
        expect(pipe.transform(120)).toBe('~ 2 min');
        expect(pipe.transform(7200)).toBe('~ 2 hours');
        expect(pipe.transform(172800)).toBe('~ 2 days');
    });

    it('reacts to language changes', () => {
        expect(pipe.transform(120)).toBe('~ 2 min');

        translate.use('de');

        expect(pipe.transform(120)).toBe('~ 2 Min.');
    });
});
