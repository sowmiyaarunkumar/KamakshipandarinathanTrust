import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
@Component({
  selector: 'app-theraphy-services',
  templateUrl: './theraphy-services.component.html',
  styleUrls: ['./theraphy-services.component.css']
})
export class TheraphyServicesComponent implements OnInit {

  constructor( private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
  }
  gotoItems(id) {
    
    this.router.navigate(['services-single', { id: id }]);
  }
}
