import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './views/login/login.component';
import {MainWindowComponent} from './views/main-window/main-window.component';
import {DashboardComponent} from './views/dashboard/dashboard.component';
import {PageNotFoundComponent} from './views/page-not-found/page-not-found.component';
import {UserTableComponent} from './views/modules/user/user-table/user-table.component';
import {UserFormComponent} from './views/modules/user/user-form/user-form.component';
import {UserDetailComponent} from './views/modules/user/user-detail/user-detail.component';
import {UserUpdateFormComponent} from './views/modules/user/user-update-form/user-update-form.component';
import {RoleTableComponent} from './views/modules/role/role-table/role-table.component';
import {RoleFormComponent} from './views/modules/role/role-form/role-form.component';
import {RoleDetailComponent} from './views/modules/role/role-detail/role-detail.component';
import {RoleUpdateFormComponent} from './views/modules/role/role-update-form/role-update-form.component';
import {ChangePasswordComponent} from './views/modules/user/change-password/change-password.component';
import {ResetPasswordComponent} from './views/modules/user/reset-password/reset-password.component';
import {ChangePhotoComponent} from './views/modules/user/change-photo/change-photo.component';
import {MyAllNotificationComponent} from './views/modules/user/my-all-notification/my-all-notification.component';
import {EmployeeTableComponent} from './views/modules/employee/employee-table/employee-table.component';
import {EmployeeFormComponent} from './views/modules/employee/employee-form/employee-form.component';
import {EmployeeDetailComponent} from './views/modules/employee/employee-detail/employee-detail.component';
import {EmployeeUpdateFormComponent} from './views/modules/employee/employee-update-form/employee-update-form.component';
import {ClientTableComponent} from './views/modules/client/client-table/client-table.component';
import {ClientFormComponent} from './views/modules/client/client-form/client-form.component';
import {ClientDetailComponent} from './views/modules/client/client-detail/client-detail.component';
import {ClientUpdateFormComponent} from './views/modules/client/client-update-form/client-update-form.component';
import {SupplierTableComponent} from './views/modules/supplier/supplier-table/supplier-table.component';
import {SupplierFormComponent} from './views/modules/supplier/supplier-form/supplier-form.component';
import {SupplierDetailComponent} from './views/modules/supplier/supplier-detail/supplier-detail.component';
import {SupplierUpdateFormComponent} from './views/modules/supplier/supplier-update-form/supplier-update-form.component';
import {RouteTableComponent} from './views/modules/route/route-table/route-table.component';
import {RouteFormComponent} from './views/modules/route/route-form/route-form.component';
import {RouteUpdateFormComponent} from './views/modules/route/route-update-form/route-update-form.component';
import {VehicleUpdateFormComponent} from './views/modules/vehicle/vehicle-update-form/vehicle-update-form.component';
import {VehicleDetailComponent} from './views/modules/vehicle/vehicle-detail/vehicle-detail.component';
import {VehicleTableComponent} from './views/modules/vehicle/vehicle-table/vehicle-table.component';
import {VehicleFormComponent} from './views/modules/vehicle/vehicle-form/vehicle-form.component';
import {RouteDetailComponent} from './views/modules/route/route-detail/route-detail.component';
import {PurchaseTableComponent} from './views/modules/purchase/purchase-table/purchase-table.component';
import {PurchaseFormComponent} from './views/modules/purchase/purchase-form/purchase-form.component';
import {PurchaseDetailComponent} from './views/modules/purchase/purchase-detail/purchase-detail.component';
import {PurchaseUpdateFormComponent} from './views/modules/purchase/purchase-update-form/purchase-update-form.component';
import {PorderTableComponent} from './views/modules/porder/porder-table/porder-table.component';
import {PorderFormComponent} from './views/modules/porder/porder-form/porder-form.component';
import {PorderDetailComponent} from './views/modules/porder/porder-detail/porder-detail.component';
import {PorderUpdateFormComponent} from './views/modules/porder/porder-update-form/porder-update-form.component';
import {SupplierpaymentTableComponent} from './views/modules/supplierpayment/supplierpayment-table/supplierpayment-table.component';
import {SupplierpaymentFormComponent} from './views/modules/supplierpayment/supplierpayment-form/supplierpayment-form.component';
import {SupplierpaymentDetailComponent} from './views/modules/supplierpayment/supplierpayment-detail/supplierpayment-detail.component';
import {SupplierpaymentUpdateFormComponent} from './views/modules/supplierpayment/supplierpayment-update-form/supplierpayment-update-form.component';
import {MaterialdisposalTableComponent} from './views/modules/materialdisposal/materialdisposal-table/materialdisposal-table.component';
import {MaterialdisposalFormComponent} from './views/modules/materialdisposal/materialdisposal-form/materialdisposal-form.component';
import {MaterialdisposalDetailComponent} from './views/modules/materialdisposal/materialdisposal-detail/materialdisposal-detail.component';
import {MaterialdisposalUpdateFormComponent} from './views/modules/materialdisposal/materialdisposal-update-form/materialdisposal-update-form.component';
import {MaterialTableComponent} from './views/modules/material/material-table/material-table.component';
import {MaterialFormComponent} from './views/modules/material/material-form/material-form.component';
import {MaterialDetailComponent} from './views/modules/material/material-detail/material-detail.component';
import {MaterialUpdateFormComponent} from './views/modules/material/material-update-form/material-update-form.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {
    path: '',
    component: MainWindowComponent,
    children: [

      {path: 'users', component: UserTableComponent},
      {path: 'users/add', component: UserFormComponent},
      {path: 'users/change-my-password', component: ChangePasswordComponent},
      {path: 'users/change-my-photo', component: ChangePhotoComponent},
      {path: 'users/my-all-notifications', component: MyAllNotificationComponent},
      {path: 'users/reset-password', component: ResetPasswordComponent},
      {path: 'users/:id', component: UserDetailComponent},
      {path: 'users/edit/:id', component: UserUpdateFormComponent},

      {path: 'roles', component: RoleTableComponent},
      {path: 'roles/add', component: RoleFormComponent},
      {path: 'roles/:id', component: RoleDetailComponent},
      {path: 'roles/edit/:id', component: RoleUpdateFormComponent},

      {path: 'employees', component: EmployeeTableComponent},
      {path: 'employees/add', component: EmployeeFormComponent},
      {path: 'employees/:id', component: EmployeeDetailComponent},
      {path: 'employees/edit/:id', component: EmployeeUpdateFormComponent},

      {path: 'clients', component: ClientTableComponent},
      {path: 'clients/add', component: ClientFormComponent},
      {path: 'clients/:id', component: ClientDetailComponent},
      {path: 'clients/edit/:id', component: ClientUpdateFormComponent},

      {path: 'suppliers', component: SupplierTableComponent},
      {path: 'suppliers/add', component: SupplierFormComponent},
      {path: 'suppliers/:id', component: SupplierDetailComponent},
      {path: 'suppliers/edit/:id', component: SupplierUpdateFormComponent},

      {path: 'routes', component: RouteTableComponent},
      {path: 'routes/add', component: RouteFormComponent},
      {path: 'routes/:id', component: RouteDetailComponent},
      {path: 'routes/edit/:id', component: RouteUpdateFormComponent},


      {path: 'vehicles', component: VehicleTableComponent},
      {path: 'vehicles/add', component: VehicleFormComponent},
      {path: 'vehicles/:id', component: VehicleDetailComponent},
      {path: 'vehicles/edit/:id', component: VehicleUpdateFormComponent},

      {path: 'purchases', component: PurchaseTableComponent},
      {path: 'purchases/add', component: PurchaseFormComponent},
      {path: 'purchases/:id', component: PurchaseDetailComponent},
      {path: 'purchases/edit/:id', component: PurchaseUpdateFormComponent},

      {path: 'porders', component: PorderTableComponent},
      {path: 'porders/add', component: PorderFormComponent},
      {path: 'porders/:id', component: PorderDetailComponent},
      {path: 'porders/edit/:id', component: PorderUpdateFormComponent},

      {path: 'supplierpayments', component: SupplierpaymentTableComponent},
      {path: 'supplierpayments/add', component: SupplierpaymentFormComponent},
      {path: 'supplierpayments/:id', component: SupplierpaymentDetailComponent},
      {path: 'supplierpayments/edit/:id', component: SupplierpaymentUpdateFormComponent},

      {path: 'materialdisposals', component: MaterialdisposalTableComponent},
      {path: 'materialdisposals/add', component: MaterialdisposalFormComponent},
      {path: 'materialdisposals/:id', component: MaterialdisposalDetailComponent},
      {path: 'materialdisposals/edit/:id', component: MaterialdisposalUpdateFormComponent},

      {path: 'materials', component: MaterialTableComponent},
      {path: 'materials/add', component: MaterialFormComponent},
      {path: 'materials/:id', component: MaterialDetailComponent},
      {path: 'materials/edit/:id', component: MaterialUpdateFormComponent},

      {path: 'suppliers', component: SupplierTableComponent},
      {path: 'suppliers/add', component: SupplierFormComponent},
      {path: 'suppliers/:id', component: SupplierDetailComponent},
      {path: 'suppliers/edit/:id', component: SupplierUpdateFormComponent},

      {path: 'dashboard', component: DashboardComponent},
      {path: '', component: DashboardComponent},
    ]
  },
  {path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
