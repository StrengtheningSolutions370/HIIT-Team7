import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { Roles } from './models/roles.enum';
import { AuthGaurdService } from './services/authentication/auth-gaurd.service';

export const AllRoles = [Roles.SuperUser, Roles.Admin, Roles.Client, Roles.Member, Roles.GeneralEmployee, Roles.Trainer];

export const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'home',
  //   pathMatch: 'full'
  // },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),

    canActivate: [AuthGaurdService],
    data: {
      roles: AllRoles
    }
  },
  {
    path: 'employees',
    loadChildren: () => import('./pages/employee/employee.module').then( m => m.EmployeePageModule),
    canActivate: [AuthGaurdService],
    data: {
      roles: [Roles.SuperUser, Roles.Admin]
    }
  },
  {
    path: 'trainers',
    loadChildren: () => import('./pages/trainers/trainers.module').then( m => m.TrainersPageModule),
    canActivate: [AuthGaurdService],
    data: {
      roles: [Roles.SuperUser, Roles.Admin, Roles.Client, Roles.Member]
    }
  },
  {
    path: 'venues',
    loadChildren: () => import('./pages/venue/venue.module').then( m => m.VenuePageModule),
    canActivate: [AuthGaurdService],
    data: {
      roles: [Roles.SuperUser, Roles.Admin]
    }
  },
  // {
  //   path: 'members',
  //   loadChildren: () => import('./pages/members/members.module').then( m => m.MembersPageModule),
  // },
  // {
  //   path: 'clients',
  //   loadChildren: () => import('./pages/clients/clients.module').then( m => m.ClientsPageModule)
  // },
  {
    path: 'payments',
    loadChildren: () => import('./pages/payments/payments.module').then( m => m.PaymentsPageModule),
    canActivate: [AuthGaurdService],
    data: {
      roles: [Roles.SuperUser, Roles.Admin, Roles.Member, Roles.Client]
    }
  },
  {
    path: 'sales',
    loadChildren: () => import('./pages/sale/sale.module').then( m => m.SalePageModule),
    canActivate: [AuthGaurdService],
    data: {
      roles: [Roles.SuperUser, Roles.Admin]
    }
  },
  {
    path: 'inventory',
    loadChildren: () => import('./pages/inventory/inventory.module').then( m => m.InventoryPageModule),
    canActivate: [AuthGaurdService],
    data: {
      roles: [Roles.SuperUser, Roles.Admin]
    }
  },
  {
    path: 'suppliers',
    loadChildren: () => import('./pages/suppliers/suppliers.module').then( m => m.SuppliersPageModule),
    canActivate: [AuthGaurdService],
    data: {
      roles: [Roles.SuperUser, Roles.Admin]
    }
  },
  {
    path: 'stock',
    loadChildren: () => import('./pages/stock/stock.module').then( m => m.StockPageModule),
    canActivate: [AuthGaurdService],
    data: {
      roles: [Roles.SuperUser, Roles.Admin]
    }
  },
  {
    path: 'reports',
    loadChildren: () => import('./pages/reports/reports.module').then( m => m.ReportsPageModule),
    canActivate: [AuthGaurdService],
    data: {
      roles: [Roles.SuperUser, Roles.Admin]
    }
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./pages/user/user.module').then( m => m.UserPageModule),
    canActivate: [AuthGaurdService],
    data: {
      roles: [Roles.SuperUser, Roles.Admin]
    }
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGaurdService],
    data: {
      roles: AllRoles
    }
    //loadChildren component here for profile once generated
  },
  {
    path: 'booking',
    loadChildren: () => import('./pages/booking/booking.module').then( m => m.BookingPageModule),
    canActivate: [AuthGaurdService],
    data: {
      roles: [Roles.Member, Roles.Client, Roles.SuperUser]
    }
    //loadChildren component here for bookings once generated
  },
  {
    path: 'shop',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGaurdService],
    data: {
      roles: [Roles.Member, Roles.Client]
    }
    //loadChildren component here for shop once generated
  },
  {
    path: 'cart',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGaurdService],
    data: {
      roles: [Roles.Member, Roles.Client]
    }
    //loadChildren component here for cart once generated
  },
  {
    path: 'sessions',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGaurdService],
    data: {
      roles: [Roles.Trainer]
    }
    //loadChildren component here for sessions once generated
  },
  {
    path: 'schedule',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGaurdService],
    data: {
      roles: [Roles.Trainer]
    }
    //loadChildren component here for schedule once generated
  },
  {
    path: 'exercises',
    loadChildren: () => import('./pages/exercises/exercises.module').then( m => m.ExercisesPageModule),
    canActivate: [AuthGaurdService],
    data: {
      roles: [Roles.Trainer, Roles.SuperUser]
    }
    //loadChildren component here for exercises once generated
  },
  {
    path: 'lessonplans',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGaurdService],
    data: {
      roles: [Roles.Trainer]
    }
    //loadChildren component here for lesson plans once generated
  },
  {
    path: 'measurements',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGaurdService],
    data: {
      roles: [Roles.Member]
    }
    //loadChildren component here for attendance once generated
  },
  {
    path: '**', //this route object must be last
    redirectTo: 'login',
  },
  {
    path: 'booking',
    loadChildren: () => import('./pages/booking/booking.module').then( m => m.BookingPageModule)
  }];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
