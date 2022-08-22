import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  images = [
    {path: 'https://source.unsplash.com/800x600/?nature'},
    {path: 'https://source.unsplash.com/800x600/?car'},
    {path: 'https://source.unsplash.com/800x600/?moto'},
    {path: 'https://source.unsplash.com/800x600/?fantasy'},
  ]
  management= [
    {id:"1",path: 'https://www.w3schools.com/bootstrap4/img_avatar1.png',name:"MR.P.PaulRaj",qualification:"B.A",position:"Chairman"},
    {id:"2",path:'https://www.w3schools.com/bootstrap4/img_avatar1.png',name:"Dr. P.Sugumar",qualification:" B.OT.,P.hd",position:"Managing Trustee"},
    {id:"3",path:'https://www.w3schools.com/bootstrap4/img_avatar1.png',name:"Mr. P.Vijay",qualification:"MASLP",position:"Trustee"},
    {id:"4",path:'https://www.w3schools.com/bootstrap4/img_avatar1.png',name:"Mr. P.Vigneshwar",qualification:"MASLP",position:"Trustee"}
  ]
  
  constructor(public router: Router) { }

  ngOnInit(): void {
    
  }
  
}
