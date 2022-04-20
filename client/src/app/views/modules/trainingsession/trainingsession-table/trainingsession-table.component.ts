import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Trainingsession, TrainingsessionDataPage} from '../../../../entities/trainingsession';
import {Trainingsessionstatus} from '../../../../entities/trainingsessionstatus';
import {FormControl} from '@angular/forms';
import {TrainingsessionstatusService} from '../../../../services/trainingsessionstatus.service';
import {TrainingsessionService} from '../../../../services/trainingsession.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {Client} from '../../../../entities/client';
import {ClientService} from '../../../../services/client.service';

@Component({
  selector: 'app-trainingsession-table',
  templateUrl: './trainingsession-table.component.html',
  styleUrls: ['./trainingsession-table.component.scss']
})
export class TrainingsessionTableComponent extends AbstractComponent implements OnInit {

  trainingsessionDataPage: TrainingsessionDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  clients: Client[] = [];
  trainingsessionstatuses: Trainingsessionstatus[] = [];

  codeField = new FormControl();
  dateField = new FormControl();
  clientField = new FormControl();
  trainingsessionstatusField = new FormControl();

  constructor(
    private clientService: ClientService,
    private trainingsessionstatusService: TrainingsessionstatusService,
    private trainingsessionService: TrainingsessionService,
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
    pageRequest.addSearchCriteria('date', this.dateField.value);
    pageRequest.addSearchCriteria('client', this.clientField.value);
    pageRequest.addSearchCriteria('trainingsessionstatus', this.trainingsessionstatusField.value);

    this.clientService.getAllBasic(new PageRequest()).then((clientDataPage) => {
      this.clients = clientDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.trainingsessionstatusService.getAll().then((trainingsessionstatuses) => {
      this.trainingsessionstatuses = trainingsessionstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.trainingsessionService.getAll(pageRequest).then((page: TrainingsessionDataPage) => {
      this.trainingsessionDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_TRAININGSESSION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_TRAININGSESSIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_TRAININGSESSION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_TRAININGSESSION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_TRAININGSESSION);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = [ 'code', 'date', 'client', 'stime', 'etime', 'venue', 'trainingsessionstatus'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(trainingsession: Trainingsession): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: trainingsession.code + ' - ' + trainingsession.date}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.trainingsessionService.delete(trainingsession.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }

}
