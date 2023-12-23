import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentFormComponent } from './student-form/student-form.component';

const routes: Routes = [
  {
    path: ' ',
    redirectTo: 'student',
    pathMatch: 'full',
  },
  {
    path: 'student',
    component: StudentFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
