import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentFormComponent } from './student-form/student-form.component';
import { DetailsComponent } from './details/details.component';

const routes: Routes = [
  {
    path: ' ',
    redirectTo: 'student',
    // pathMatch: 'full',
  },
  {
    path: 'student',
    component: StudentFormComponent,
  },
  {
    path: 'student/:id',
    component: DetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
