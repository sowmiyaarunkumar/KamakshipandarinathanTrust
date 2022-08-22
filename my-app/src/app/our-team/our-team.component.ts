import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery'
import Shuffle from 'shufflejs';
@Component({
  selector: 'app-our-team',
  templateUrl: './our-team.component.html',
  styleUrls: ['./our-team.component.css']
})
export class OurTeamComponent implements OnInit {

	

  constructor() {
   
   }

  ngOnInit(): void {
    	
 // Shuffle js filter and masonry


$('input').on('change', function (evt) {
  var input = evt.currentTarget;
  if (input.checked) {
      this.myShuffle.filter(input.value);
  }
});
};

getDoctors(value)
{
  var myShuffle = new Shuffle(document.querySelector('.shuffle-wrapper'), {
    itemSelector: '.shuffle-item',
    buffer: 1
  });

      myShuffle.filter(value);
  
}
  

}
