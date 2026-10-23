import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GymLeaderService } from '../../services/gym-leader.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private service = inject(GymLeaderService);

  kantoCount = this.service.kantoCount;
  johtoCount = this.service.johtoCount;
  hoennCount = this.service.hoennCount;

  ngOnInit(): void {
    this.service.fetchLeaders();
  }
}