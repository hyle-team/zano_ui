import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from '@parts/components/breadcrumbs/breadcrumbs.component';
import { BreadcrumbItems } from '@parts/components/breadcrumbs/breadcrumbs.models';
import { RouterLinkWithHref } from '@angular/router';
import { InputValidateModule } from '@parts/directives';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-confirm-swap',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent, RouterLinkWithHref, InputValidateModule, TranslateModule, ReactiveFormsModule],
  templateUrl: './confirm-swap.component.html',
  styleUrls: ['./confirm-swap.component.scss'],
})
export class ConfirmSwapComponent implements OnInit {
  breadcrumbItems: BreadcrumbItems = [
    {
      routerLink: '/wallet/swap',
      title: 'CONFIRM_SWAP.BREADCRUMBS.ITEM1',
    },
    {
      title: 'CONFIRM_SWAP.BREADCRUMBS.ITEM2',
    },
  ];

  fb = inject(FormBuilder);

  form = this.fb.group({
    swapProposalHex: this.fb.control(''),
  });

  ngOnInit(): void {}
}
