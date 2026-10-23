import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GymLeaderService } from '../../services/gym-leader.service';

@Component({
  selector: 'app-leader-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './leader-form.html',
  styleUrl: './leader-form.css'
})
export class LeaderForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(GymLeaderService);

  isEditMode = false;
  leaderId: string | null = null;

  leaderForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    region: ['Kanto' as 'Kanto' | 'Johto' | 'Hoenn', [Validators.required]],
    town: ['', [Validators.required]],
    badge: ['', [Validators.required]],
    specialty: ['', [Validators.required]],
    aceLevel: [50, [Validators.required, Validators.min(1), Validators.max(100)]],
    motto: ['', [Validators.maxLength(150)]]
  });

  ngOnInit(): void {
    this.leaderId = this.route.snapshot.paramMap.get('id');
    if (this.leaderId) {
      this.isEditMode = true;
      this.service.getLeader(this.leaderId).subscribe({
        next: (leader) => {
          this.leaderForm.patchValue({
            name: leader.name,
            region: leader.region,
            town: leader.town,
            badge: leader.badge,
            specialty: leader.specialty,
            aceLevel: leader.aceLevel,
            motto: leader.motto || ''
          });
        },
        error: () => this.router.navigate(['/leaders'])
      });
    }
  }

  isFieldInvalid(field: string): boolean {
    const ctrl = this.leaderForm.get(field);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  onSubmit(): void {
    if (this.leaderForm.invalid) {
      this.leaderForm.markAllAsTouched();
      return;
    }

    const payload = this.leaderForm.getRawValue();

    if (this.isEditMode && this.leaderId) {
      this.service.updateLeader(this.leaderId, payload).subscribe({
        next: () => {
          this.leaderForm.reset();
          this.router.navigate(['/leaders']);
        }
      });
    } else {
      this.service.addLeader(payload).subscribe({
        next: () => {
          this.leaderForm.reset();
          this.router.navigate(['/leaders']);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/leaders']);
  }
}