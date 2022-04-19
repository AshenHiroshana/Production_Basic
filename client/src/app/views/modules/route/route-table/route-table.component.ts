import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {Route, RouteDataPage} from '../../../../entities/route';
import {RouteService} from '../../../../services/route.service';
import {Routestatus} from '../../../../entities/routestatus';
import {District} from '../../../../entities/district';
import {RoutestatusService} from '../../../../services/routestatus.service';
import {DistrictService} from '../../../../services/district.service';
import {AbstractComponent} from '../../../../shared/abstract-component';

@Component({
  selector: 'app-route-table',
  templateUrl: './route-table.component.html',
  styleUrls: ['./route-table.component.scss']
})
export class RouteTableComponent extends AbstractComponent implements OnInit {

  routeDataPage: RouteDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  routestatuses: Routestatus[] = [];
  districts: District[] = [];

  codeField = new FormControl();
  nameField = new FormControl();
  districtField = new FormControl();
  routestatusField = new FormControl();

  constructor(
    private routestatusService: RoutestatusService ,
    private districtService: DistrictService,
    private routeService: RouteService,
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
    pageRequest.addSearchCriteria('district', this.districtField.value);
    pageRequest.addSearchCriteria('routestatus', this.routestatusField.value);

    this.routestatusService.getAll().then((routestatuses) => {
      this.routestatuses = routestatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.districtService.getAll().then((districts) => {
      this.districts = districts;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.routeService.getAll(pageRequest).then((page: RouteDataPage) => {
      this.routeDataPage = page;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    console.log(this.routeDataPage);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ROUTE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_ROUTES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_ROUTE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ROUTE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ROUTE);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'name', 'district', 'vehicle', 'ref', 'status'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(route: Route): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: route.code + ' - ' + route.name }
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.routeService.delete(route.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }

}
