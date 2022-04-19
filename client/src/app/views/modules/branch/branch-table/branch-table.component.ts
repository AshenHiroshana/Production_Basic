import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Branch, BranchDataPage} from '../../../../entities/branch';
import {FormControl} from '@angular/forms';
import {BranchService} from '../../../../services/branch.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {Suppliertype} from '../../../../entities/suppliertype';
import {Supplierstatus} from '../../../../entities/supplierstatus';
import {Branchtype} from '../../../../entities/branchtype';
import {Branchstatus} from '../../../../entities/branchstatus';
import {SuppliertypeService} from '../../../../services/suppliertype.service';
import {SupplierstatusService} from '../../../../services/supplierstatus.service';
import {BranchtypeService} from '../../../../services/branchtype.service';
import {BranchstatusService} from '../../../../services/branchstatus.service';
import {Supplier, SupplierDataPage} from '../../../../entities/supplier';
import {SupplierService} from '../../../../services/supplier.service';

@Component({
  selector: 'app-branch-table',
  templateUrl: './branch-table.component.html',
  styleUrls: ['./branch-table.component.scss']
})
export class BranchTableComponent extends AbstractComponent implements OnInit  {

  branchDataPage: BranchDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  branchtypes: Branchtype[] = [];
  branchstatuses: Branchstatus[] = [];


  codeField = new FormControl();
  nameField = new FormControl();
  branchtypeField = new FormControl();
  branchstatusField = new FormControl();

  constructor(
    private branchtypeService: BranchtypeService,
    private branchstatusService: BranchstatusService,
    private branchService: BranchService,
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
    pageRequest.addSearchCriteria('name', this.nameField.value);
    pageRequest.addSearchCriteria('branchtype', this.branchtypeField.value);
    pageRequest.addSearchCriteria('branchstatus', this.branchstatusField.value);

    this.branchtypeService.getAll().then((branchtypes) => {
      this.branchtypes = branchtypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.branchstatusService.getAll().then((branchstatuses) => {
      this.branchstatuses = branchstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.branchService.getAll(pageRequest).then((page: BranchDataPage) => {
      this.branchDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_BRANCH);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_BRANCHES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_BRANCH_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_BRANCH);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_BRANCH);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['logo', 'code', 'name', 'contacts', 'type', 'status'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(branch: Branch): Promise<void> {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: branch.code + ' - ' + branch.name}
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (!result) {
        return;
      }
      try {
        await this.branchService.delete(branch.id);
      } catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }}
