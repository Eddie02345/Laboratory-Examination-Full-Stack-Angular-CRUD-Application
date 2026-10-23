import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { GymLeaderService } from '../../services/gym-leader.service';
import { LeaderCard } from '../../components/leader-card/leader-card';

@Component({
  selector: 'app-leader-list',
  standalone: true,
  imports: [LeaderCard],
  templateUrl: './leader-list.html',
  styleUrl: './leader-list.css'
})
export class LeaderList implements OnInit {
  private service = inject(GymLeaderService);
  private router = inject(Router);

  selectedRegion = signal<'All' | 'Kanto' | 'Johto' | 'Hoenn'>('All');

  filteredLeaders = computed(() => {
    const region = this.selectedRegion();
    const list = this.service.leaders();
    return region === 'All' ? list : list.filter((l) => l.region === region);
  });

  ngOnInit(): void {
    this.service.fetchLeaders();
  }

  setRegion(region: 'All' | 'Kanto' | 'Johto' | 'Hoenn'): void {
    this.selectedRegion.set(region);
  }

  onEdit(id: string): void {
    this.router.navigate(['/leaders', id, 'edit']);
  }

  onRemove(id: string): void {
    const leader = this.service.leaders().find((l) => l._id === id);
    const leaderName = leader ? leader.name : 'this Gym Leader';

    if (window.confirm(`Remove ${leaderName} from the registry?`)) {
      this.service.deleteLeader(id).subscribe();
    }
  }
}