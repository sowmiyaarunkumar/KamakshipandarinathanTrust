import { NgModule,Component } from '@angular/core';
import { Routes, RouterModule,PreloadAllModules } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { BlogsComponent } from './blogs/blogs.component';
import { ChildcareComponent } from './childcare/childcare.component';
import { ContactComponent } from './contact/contact.component';
import { DoctorProfileComponent } from './doctor-profile/doctor-profile.component';
import { DonateComponent } from './donate/donate.component';
import { HomeComponent } from './home/home.component';
import { OurTeamComponent } from './our-team/our-team.component';
import { PageLayoutComponent } from './page-layout/page-layout.component';
import { SelfComponent } from './self/self.component';
import { SeniorcareComponent } from './seniorcare/seniorcare.component';
import { ServicesSingleComponent } from './services-single/services-single.component';
import { TheraphyServicesComponent } from './theraphy-services/theraphy-services.component';
const routes: Routes = [ 
 
{
  path: '', 
  component:PageLayoutComponent,
  children: [ 
    {
      path:'',
      component:HomeComponent
    },
    
    {
  path: 'about',
  component: AboutComponent
    }, {
      path: 'childcare',
      component: ChildcareComponent
        }, {
          path: 'senior',
          component: SeniorcareComponent
            },
      {
          path:'self/:id',
          component:SelfComponent
       },
       {
        path:'profile/:id',
        component:DoctorProfileComponent
     },
       {
        path:'contact',
        component:ContactComponent
     },
     {
      path:'blogs',
      component:BlogsComponent
   },
       {
        path:'ourservices',
        component:TheraphyServicesComponent
     },
     
     {
      path:'appointment',
      component:AppointmentComponent
   },
     {
      path:'ourteam',
      component:OurTeamComponent
   },
     { path: "services-single/:id", component: ServicesSingleComponent }
       ]
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
