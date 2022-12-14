import { Component, OnInit } from '@angular/core';
import { RepositoryService } from '../shared/services/repository.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  res:any;
  constructor(private service:RepositoryService) { }

  ngOnInit(): void {
    this.data();
  }

  data (){
    this.service.getData("weatherforecast").subscribe((result) => {
     
this.res=result;

    });
  }
}
