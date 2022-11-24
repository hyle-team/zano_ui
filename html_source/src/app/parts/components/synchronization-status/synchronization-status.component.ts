import { Component } from '@angular/core';
import { VariablesService } from '../../services/variables.service';
import { DOWNLOADS_PAGE_URL } from '@parts/data/constants';
import { BackendService } from '../../../api/services/backend.service';

@Component({
  selector: 'app-synchronization-status',
  templateUrl: './synchronization-status.component.html',
  styleUrls: ['./synchronization-status.component.scss'],
})
export class SynchronizationStatusComponent {
  constructor(
    public variablesService: VariablesService,
    private backend: BackendService
  ) {}

  getUpdate(): void {
    this.backend.openUrlInBrowser(DOWNLOADS_PAGE_URL);
  }
}
