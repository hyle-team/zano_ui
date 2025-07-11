import { Component, NgZone } from '@angular/core';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { Contact } from '@api/models/contact.model';
import { ModalService } from '@parts/services/modal.service';
import { Papa } from 'ngx-papaparse';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-export-import',
    templateUrl: './export-import.component.html',
    styles: [
        `
            :host {
                width: 100%;
            }
        `,
    ],
})
export class ExportImportComponent {
    constructor(
        private variablesService: VariablesService,
        private backend: BackendService,
        private modalService: ModalService,
        private papa: Papa,
        private translate: TranslateService,
        private router: Router,
        private ngZone: NgZone
    ) {}

    import(): void {
        this.backend.openFileDialog('', '*', this.variablesService.settings.default_path, (file_status, file_data) => {
            if (file_status) {
                this.variablesService.settings.default_path = file_data.path.substr(0, file_data.path.lastIndexOf('/'));
                if (this.isValid(file_data.path)) {
                    this.backend.loadFile(file_data.path, (status, data) => {
                        if (!status) {
                            this.modalService.prepareModal('error', 'CONTACTS.ERROR_IMPORT_EMPTY');
                        } else {
                            const options = {
                                header: true,
                            };
                            const elements = this.papa.parse(data, options);
                            const isArray = Array.isArray(elements.data);
                            if (isArray && elements.data.length !== 0 && elements.errors.length === 0) {
                                if (this.variablesService.contacts.length === 0) {
                                    elements.data.forEach((element) => {
                                        this.variablesService.contacts.push(element);
                                    });
                                } else {
                                    elements.data.forEach((element) => {
                                        const indexName = this.variablesService.contacts.findIndex(
                                            (contact) => contact.name === element.name
                                        );
                                        const indexAddress = this.variablesService.contacts.findIndex(
                                            (contact) => contact.address === element.address
                                        );
                                        if (indexAddress === -1 && indexName === -1) {
                                            this.variablesService.contacts.push(element);
                                        }
                                        if (indexName !== -1 && indexAddress === -1) {
                                            this.variablesService.contacts.push({
                                                name: `${(element.name as string) || '---'} ${
                                                    this.translate.instant('CONTACTS.COPY') as string
                                                }`,
                                                address: element.address,
                                                notes: element.notes,
                                            });
                                        }
                                    });
                                }
                                this.ngZone.run(() => {
                                    this.router.navigate(['/contacts']);
                                });
                            }
                            if (elements.errors.length > 0) {
                                this.modalService.prepareModal('error', 'CONTACTS.ERROR_IMPORT');
                                console.log(elements.errors);
                            }
                        }
                    });
                } else {
                    this.modalService.prepareModal('error', 'CONTACTS.ERROR_TYPE_FILE');
                }
            }
        });
    }

    export(): void {
        const contacts: Array<Contact> = [];
        this.variablesService.contacts.forEach((contact) => {
            delete contact.alias;
            contacts.push(contact);
        });

        this.backend.saveFileDialog('', '*', this.variablesService.settings.default_path, (file_status, file_data) => {
            if (this.variablesService.contacts.length === 0 && !(file_data.error_code === 'CANCELED')) {
                this.modalService.prepareModal('error', 'CONTACTS.ERROR_EMPTY_LIST');
            }
            const path = this.isValid(file_data.path) ? file_data.path : `${(file_data.path as string) || 'base-name'}.csv`;
            if (file_status && this.isValid(path) && this.variablesService.contacts.length > 0) {
                this.backend.storeFile(path, this.papa.unparse(contacts));
            }
            if (!(file_data.error_code === 'CANCELED') && !this.isValid(path)) {
                this.modalService.prepareModal('error', 'CONTACTS.ERROR_EXPORT');
            }
        });
    }

    isValid(file): boolean {
        return file.endsWith('.csv');
    }
}
