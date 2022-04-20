import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './views/login/login.component';
import { MainWindowComponent } from './views/main-window/main-window.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { PageHeaderComponent } from './shared/views/page-header/page-header.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {Interceptor} from './shared/interceptor';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatBadgeModule} from '@angular/material/badge';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTreeModule} from '@angular/material/tree';
import { NavigationComponent } from './shared/views/navigation/navigation.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { RoleDetailComponent } from './views/modules/role/role-detail/role-detail.component';
import { RoleFormComponent } from './views/modules/role/role-form/role-form.component';
import { RoleTableComponent } from './views/modules/role/role-table/role-table.component';
import { RoleUpdateFormComponent } from './views/modules/role/role-update-form/role-update-form.component';
import { UserDetailComponent } from './views/modules/user/user-detail/user-detail.component';
import { UserFormComponent } from './views/modules/user/user-form/user-form.component';
import { UserTableComponent } from './views/modules/user/user-table/user-table.component';
import { UserUpdateFormComponent } from './views/modules/user/user-update-form/user-update-form.component';
import { ChangePasswordComponent } from './views/modules/user/change-password/change-password.component';
import { ResetPasswordComponent } from './views/modules/user/reset-password/reset-password.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from './shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { EmptyDataTableComponent } from './shared/views/empty-data-table/empty-data-table.component';
import { LoginTimeOutDialogComponent } from './shared/views/login-time-out-dialog/login-time-out-dialog.component';
import { Nl2brPipe } from './shared/nl2br.pipe';
import { NoPrivilegeComponent } from './shared/views/no-privilege/no-privilege.component';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import { AdminConfigurationComponent } from './views/admin-configuration/admin-configuration.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ObjectNotFoundComponent } from './shared/views/object-not-found/object-not-found.component';
import { LoadingComponent } from './shared/views/loading/loading.component';
import { ConfirmDialogComponent } from './shared/views/confirm-dialog/confirm-dialog.component';
import {MatTabsModule} from '@angular/material/tabs';
import { DualListboxComponent } from './shared/ui-components/dual-listbox/dual-listbox.component';
import {FileChooserComponent} from './shared/ui-components/file-chooser/file-chooser.component';
import { ChangePhotoComponent } from './views/modules/user/change-photo/change-photo.component';
import { MyAllNotificationComponent } from './views/modules/user/my-all-notification/my-all-notification.component';
import {EmployeeTableComponent} from './views/modules/employee/employee-table/employee-table.component';
import {EmployeeFormComponent} from './views/modules/employee/employee-form/employee-form.component';
import {EmployeeDetailComponent} from './views/modules/employee/employee-detail/employee-detail.component';
import {EmployeeUpdateFormComponent} from './views/modules/employee/employee-update-form/employee-update-form.component';
import { ClientFormComponent } from './views/modules/client/client-form/client-form.component';
import { ClientDetailComponent } from './views/modules/client/client-detail/client-detail.component';
import { ClientTableComponent } from './views/modules/client/client-table/client-table.component';
import { ClientUpdateFormComponent } from './views/modules/client/client-update-form/client-update-form.component';
import { SupplierFormComponent } from './views/modules/supplier/supplier-form/supplier-form.component';
import { SupplierTableComponent } from './views/modules/supplier/supplier-table/supplier-table.component';
import { SupplierDetailComponent } from './views/modules/supplier/supplier-detail/supplier-detail.component';
import { SupplierUpdateFormComponent } from './views/modules/supplier/supplier-update-form/supplier-update-form.component';
import { RouteFormComponent } from './views/modules/route/route-form/route-form.component';
import { RouteDetailComponent } from './views/modules/route/route-detail/route-detail.component';
import { RouteTableComponent } from './views/modules/route/route-table/route-table.component';
import { RouteUpdateFormComponent } from './views/modules/route/route-update-form/route-update-form.component';
import { VehicleDetailComponent } from './views/modules/vehicle/vehicle-detail/vehicle-detail.component';
import { VehicleFormComponent } from './views/modules/vehicle/vehicle-form/vehicle-form.component';
import { VehicleTableComponent } from './views/modules/vehicle/vehicle-table/vehicle-table.component';
import { VehicleUpdateFormComponent } from './views/modules/vehicle/vehicle-update-form/vehicle-update-form.component';
import {MaterialTableComponent} from './views/modules/material/material-table/material-table.component';
import {MaterialFormComponent} from './views/modules/material/material-form/material-form.component';
import {MaterialDetailComponent} from './views/modules/material/material-detail/material-detail.component';
import {MaterialUpdateFormComponent} from './views/modules/material/material-update-form/material-update-form.component';
import {MaterialdisposalmaterialUpdateSubFormComponent} from './views/modules/materialdisposal/materialdisposal-update-form/materialdisposalmaterial-update-sub-form/materialdisposalmaterial-update-sub-form.component';
import {PorderTableComponent} from './views/modules/porder/porder-table/porder-table.component';
import {PorderFormComponent} from './views/modules/porder/porder-form/porder-form.component';
import {PorderDetailComponent} from './views/modules/porder/porder-detail/porder-detail.component';
import {PorderUpdateFormComponent} from './views/modules/porder/porder-update-form/porder-update-form.component';
import {PordermaterialUpdateSubFormComponent} from './views/modules/porder/porder-update-form/pordermaterial-update-sub-form/pordermaterial-update-sub-form.component';
import {MaterialdisposalTableComponent} from './views/modules/materialdisposal/materialdisposal-table/materialdisposal-table.component';
import {MaterialdisposalFormComponent} from './views/modules/materialdisposal/materialdisposal-form/materialdisposal-form.component';
import {MaterialdisposalDetailComponent} from './views/modules/materialdisposal/materialdisposal-detail/materialdisposal-detail.component';
import {MaterialdisposalUpdateFormComponent} from './views/modules/materialdisposal/materialdisposal-update-form/materialdisposal-update-form.component';
import {PurchasematerialSubFormComponent} from './views/modules/purchase/purchase-form/purchasematerial-sub-form/purchasematerial-sub-form.component';
import {PordermaterialSubFormComponent} from './views/modules/porder/porder-form/pordermaterial-sub-form/pordermaterial-sub-form.component';
import {PurchasematerialUpdateSubFormComponent} from './views/modules/purchase/purchase-update-form/purchasematerial-update-sub-form/purchasematerial-update-sub-form.component';
import {MaterialdisposalmaterialSubFormComponent} from './views/modules/materialdisposal/materialdisposal-form/materialdisposalmaterial-sub-form/materialdisposalmaterial-sub-form.component';
import {SupplierpaymentTableComponent} from './views/modules/supplierpayment/supplierpayment-table/supplierpayment-table.component';
import {SupplierpaymentFormComponent} from './views/modules/supplierpayment/supplierpayment-form/supplierpayment-form.component';
import {SupplierpaymentDetailComponent} from './views/modules/supplierpayment/supplierpayment-detail/supplierpayment-detail.component';
import {SupplierpaymentUpdateFormComponent} from './views/modules/supplierpayment/supplierpayment-update-form/supplierpayment-update-form.component';
import {
  PurchaseUpdateFormComponent
} from './views/modules/purchase/purchase-update-form/purchase-update-form.component';
import {PurchaseTableComponent} from "./views/modules/purchase/purchase-table/purchase-table.component";
import {PurchaseFormComponent} from "./views/modules/purchase/purchase-form/purchase-form.component";
import {PurchaseDetailComponent} from "./views/modules/purchase/purchase-detail/purchase-detail.component";
import { ProductFormComponent } from './views/modules/product/product-form/product-form.component';
import { ProductTableComponent } from './views/modules/product/product-table/product-table.component';
import { ProductDetailComponent } from './views/modules/product/product-detail/product-detail.component';
import { ProductUpdateFormComponent } from './views/modules/product/product-update-form/product-update-form.component';
import { TrainingsessionFormComponent } from './views/modules/trainingsession/trainingsession-form/trainingsession-form.component';
import { TrainingsessionTableComponent } from './views/modules/trainingsession/trainingsession-table/trainingsession-table.component';
import { TrainingsessionDetailComponent } from './views/modules/trainingsession/trainingsession-detail/trainingsession-detail.component';
import { TrainingsessionUpdateFormComponent } from './views/modules/trainingsession/trainingsession-update-form/trainingsession-update-form.component';



@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        MainWindowComponent,
        DashboardComponent,
        PageNotFoundComponent,
        PageHeaderComponent,
        NavigationComponent,
        RoleDetailComponent,
        RoleFormComponent,
        RoleTableComponent,
        RoleUpdateFormComponent,
        UserDetailComponent,
        UserFormComponent,
        UserTableComponent,
        UserUpdateFormComponent,
        ChangePasswordComponent,
        ResetPasswordComponent,
        DeleteConfirmDialogComponent,
        EmptyDataTableComponent,
        LoginTimeOutDialogComponent,
        Nl2brPipe,
        NoPrivilegeComponent,
        AdminConfigurationComponent,
        FileChooserComponent,
        ObjectNotFoundComponent,
        LoadingComponent,
        ConfirmDialogComponent,
        DualListboxComponent,
        ChangePhotoComponent,
        MyAllNotificationComponent,
        EmployeeTableComponent,
        EmployeeFormComponent,
        EmployeeDetailComponent,
        EmployeeUpdateFormComponent,
        ClientFormComponent,
        ClientDetailComponent,
        ClientTableComponent,
        ClientUpdateFormComponent,
        SupplierFormComponent,
        SupplierTableComponent,
        SupplierDetailComponent,
        SupplierUpdateFormComponent,
        RouteFormComponent,
        RouteDetailComponent,
        RouteTableComponent,
        RouteUpdateFormComponent,
        VehicleDetailComponent,
        VehicleFormComponent,
        VehicleTableComponent,
        VehicleUpdateFormComponent,
      PordermaterialUpdateSubFormComponent,
      PordermaterialSubFormComponent,
      PorderTableComponent,
      PorderFormComponent,
      PorderDetailComponent,
      PorderUpdateFormComponent,
      PordermaterialUpdateSubFormComponent,
      MaterialdisposalTableComponent,
      MaterialdisposalFormComponent,
      MaterialdisposalDetailComponent,
      MaterialdisposalUpdateFormComponent,
      PurchasematerialSubFormComponent,
      PordermaterialSubFormComponent,
      PurchasematerialUpdateSubFormComponent,
      MaterialTableComponent,
      MaterialFormComponent,
      MaterialDetailComponent,
      MaterialUpdateFormComponent,
      MaterialdisposalmaterialUpdateSubFormComponent,
      SupplierpaymentTableComponent,
      SupplierpaymentFormComponent,
      SupplierpaymentDetailComponent,
      SupplierpaymentUpdateFormComponent,
      PurchaseUpdateFormComponent,
      PurchaseTableComponent,
      PurchaseFormComponent,
      PurchaseDetailComponent,
      MaterialdisposalmaterialSubFormComponent,
      ProductFormComponent,
      ProductTableComponent,
      ProductDetailComponent,
      ProductUpdateFormComponent,
      TrainingsessionFormComponent,
      TrainingsessionTableComponent,
      TrainingsessionDetailComponent,
      TrainingsessionUpdateFormComponent,

    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    HttpClientModule,
    MatSidenavModule,
    MatBadgeModule,
    MatTooltipModule,
    MatListModule,
    MatExpansionModule,
    MatGridListModule,
    MatTreeModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatTabsModule,

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
