import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-doctor-profile',
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.css']
})
export class DoctorProfileComponent implements OnInit {
  management=[{
    id:"1",name:"name",role:"Theraphist",path:"../../assets/images/team/1.jpg",about:""
    },{
      id:"2",name:"Dr. P.Sugumar",role:"Manging Director"
      },{
        id:"3",name:"Mr. P.Vijay", role:"Trustee"
        },{
          id:"4",name:"Mr. P.Vigneshwar", role:"Trustee"
          }]
      constructor(private route: ActivatedRoute) { }
    selectedProfile:any;
    id: string
      ngOnInit(): void {
        this.id=this.route.snapshot.params.id;
        this.selectedProfile=this.management.filter(e=>e.id==this.id)
      }

}
