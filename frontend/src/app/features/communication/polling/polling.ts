import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { CommunicationService, Poll } from '../../../core/services/communication';

@Component({
  selector: 'app-polling',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatRadioModule, 
    MatButtonModule, MatProgressBarModule, MatSnackBarModule
  ],
  templateUrl: './polling.html',
  styleUrls: ['./polling.css']
})
export class Polling implements OnInit {
  private commService = inject(CommunicationService);
  private snackBar = inject(MatSnackBar);

  polls: Poll[] = [];
  selectedOptions: { [pollId: string]: string } = {};

  ngOnInit() {
    this.loadPolls();
  }

  loadPolls() {
    this.commService.getPolls().subscribe(p => this.polls = p);
  }
  
  getTotalVotes(poll: Poll): number {
    return poll.options.reduce((sum, opt) => sum + opt.voteCount, 0);
  }

  getPercentage(poll: Poll, voteCount: number): number {
    const total = this.getTotalVotes(poll);
    if (total === 0) return 0;
    return Math.round((voteCount / total) * 100);
  }

  castVote(pollId: string) {
    const optionId = this.selectedOptions[pollId];
    if (!optionId) return;

    this.commService.castVote(pollId, { pollOptionId: optionId }).subscribe({
      next: () => {
        this.snackBar.open('Vote cast successfully!', 'Close', { duration: 3000 });
        this.loadPolls();
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Error casting vote.', 'Close', { duration: 5000 });
      }
    });
  }
}
