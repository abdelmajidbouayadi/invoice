import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  affiche = {
    inventory: false,
    sales: false,
    purchases: false
  }
  constructor() { }
  onClick(word: string){
    if(word === 'inventory') this.affiche.inventory = !this.affiche.inventory;
    else if(word === 'sales') this.affiche.sales = !this.affiche.sales;
    else this.affiche.purchases = !this.affiche.purchases;
  }
  ngOnInit(): void {
  }

}
