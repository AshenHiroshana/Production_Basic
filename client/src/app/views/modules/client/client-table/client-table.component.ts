import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Client, ClientDataPage} from '../../../../entities/client';
import {Clientstatus} from '../../../../entities/clientstatus';
import {FormControl} from '@angular/forms';
import {ClientstatusService} from '../../../../services/clientstatus.service';
import {ClientService} from '../../../../services/client.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {Employeestatus} from '../../../../entities/employeestatus';

@Component({
  selector: 'app-client-table',
  templateUrl: './client-table.component.html',
  styleUrls: ['./client-table.component.scss']
})
export class ClientTableComponent extends AbstractComponent implements OnInit {

  clientDataPage: ClientDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  clientstatuses: Clientstatus[] = [];


  codeField = new FormControl();
  nameField = new FormControl();
  contact1Field = new FormControl();
  emailField = new FormControl();

  constructor(
    private clientstatusService: ClientstatusService,
    private clientService: ClientService,
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
    pageRequest.addSearchCriteria('contact1', this.contact1Field.value);
    pageRequest.addSearchCriteria('email', this.emailField.value);

    this.clientstatusService.getAll().then((clientstatuses) => {
      this.clientstatuses = clientstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.clientService.getAll(pageRequest).then((page: ClientDataPage) => {
      this.clientDataPage = page;
      console.log(this.clientDataPage);
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CLIENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CLIENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CLIENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CLIENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CLIENT);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'name', 'contact1', 'contact2', 'email' ];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(client: Client): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: client.code + ' - ' + client.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.clientService.delete(client.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }

}
