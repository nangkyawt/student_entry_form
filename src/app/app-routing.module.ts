import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentFormComponent } from './student-form/student-form.component';
import { NavbarComponent } from './navbar/navbar.component';

const routes: Routes = [
  {
    path: ' ',
    redirectTo: 'navbar',
    pathMatch: 'full',
  },
  {
    path: 'navbar',
    component: NavbarComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
