import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-self',
  templateUrl: './self.component.html',
  styleUrls: ['./self.component.css']
})
export class SelfComponent implements OnInit {
management=[{
id:"1",name:"MR.P.PaulRaj",role:"Chairman"
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
