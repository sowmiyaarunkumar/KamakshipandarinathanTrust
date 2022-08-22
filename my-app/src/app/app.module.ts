import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageLayoutComponent } from './page-layout/page-layout.component';
import { SelfComponent } from './self/self.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DonateComponent } from './donate/donate.component';
import { IvyCarouselModule } from "angular-responsive-carousel";
import { TheraphyServicesComponent } from './theraphy-services/theraphy-services.component';
import { ServicesSingleComponent } from './services-single/services-single.component';
import { ContactComponent } from './contact/contact.component';
import { AgmCoreModule } from '@agm/core';
import { BlogsComponent } from './blogs/blogs.component';
import { OurTeamComponent } from './our-team/our-team.component';
import { DoctorProfileComponent } from './doctor-profile/doctor-profile.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { ChildcareComponent } from './childcare/childcare.component';
import { SeniorcareComponent } from './seniorcare/seniorcare.component';

@NgModule({
  declarations: [
    AppComponent,
    PageLayoutComponent,
    SelfComponent,
    HomeComponent,
    AboutComponent,
    DonateComponent,
    TheraphyServicesComponent,
    ServicesSingleComponent,
    ContactComponent,
    BlogsComponent,
    OurTeamComponent,
    DoctorProfileComponent,
    AppointmentComponent,
    ChildcareComponent,
    SeniorcareComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IvyCarouselModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA3uHZGiWHikdyyEWdjkQs1Nn5ZmPekDYo'
    }),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
