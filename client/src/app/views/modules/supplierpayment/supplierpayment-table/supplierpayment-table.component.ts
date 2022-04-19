import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Supplierpayment, SupplierpaymentDataPage} from "../../../../entities/supplierpayment";
import {Purchase} from "../../../../entities/purchase";
import {Paymentstatus} from "../../../../entities/paymentstatus";
import {PurchaseService} from "../../../../services/purchase.service";
import {PaymentstatusService} from "../../../../services/paymentstatus.service";
import {SupplierpaymentService} from "../../../../services/supplierpayment.service";
@Component({
  selector: 'app-supplierpayment-table',
  templateUrl: './supplierpayment-table.component.html',
  styleUrls: ['./supplierpayment-table.component.scss']
})
export class SupplierpaymentTableComponent extends AbstractComponent implements OnInit {

  supplierpaymentDataPage: SupplierpaymentDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  purchases: Purchase[] = [];
  paymentstatuses: Paymentstatus[] = [];

  codeField = new FormControl();
  purchaseField = new FormControl();
  paymentstatusField = new FormControl();

  constructor(
    private purchaseService: PurchaseService,
    private paymentstatusService: PaymentstatusService,
    private supplierpaymentService: SupplierpaymentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {

    await this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();

    if (!this.privilege.showAll) { return; }

    this.setDisplayedColumns();

    const pageRequest = new PageRequest();
    pageRequest.pageIndex  = this.pageIndex;
    pageRequest.pageSize  = this.pageSize;

    pageRequest.addSearchCriteria('code', this.codeField.value);
    pageRequest.addSearchCriteria('purchase', this.purchaseField.value);
    pageRequest.addSearchCriteria('paymentstatus', this.paymentstatusField.value);

    this.purchaseService.getAll(new PageRequest()).then((purchaseDataPage) => {
      this.purchases = purchaseDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.paymentstatusService.getAll().then((paymentstatuses) => {
      this.paymentstatuses = paymentstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.supplierpaymentService.getAll(pageRequest).then((page: SupplierpaymentDataPage) => {
      this.supplierpaymentDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SUPPLIERPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SUPPLIERPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SUPPLIERPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SUPPLIERPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SUPPLIERPAYMENT);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'purchase', 'supplier', 'amount', 'paymentstatus'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(supplierpayment: Supplierpayment): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: supplierpayment.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.supplierpaymentService.delete(supplierpayment.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
