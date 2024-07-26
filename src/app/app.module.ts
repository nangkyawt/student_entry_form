import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StudentFormComponent } from './student-form/student-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { GenderPipe } from './gender.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchPipe } from './search.pipe';
import { DetailsComponent } from './details/details.component';
import { NrcExistsPipe } from './nrc-exists.pipe';
// import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
  declarations: [
    AppComponent,
    StudentFormComponent,
    GenderPipe,
    SearchPipe,
    DetailsComponent,
    NrcExistsPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxPaginationModule,
    // BsDropdownModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
