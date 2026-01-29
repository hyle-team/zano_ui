import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletCardAliasComponent } from './wallet-card-alias.component';

describe('WalletCardAliasComponent', () => {
    let component: WalletCardAliasComponent;
    let fixture: ComponentFixture<WalletCardAliasComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WalletCardAliasComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(WalletCardAliasComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
