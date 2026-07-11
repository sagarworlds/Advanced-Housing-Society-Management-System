import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { CommunicationService, Notice } from '../../../core/services/communication';

@Component({
  selector: 'app-notice-board',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatIconModule, MatChipsModule
  ],
  templateUrl: './notice-board.html',
  styleUrls: ['./notice-board.css']
})
export class NoticeBoard implements OnInit {
  private commService = inject(CommunicationService);
  
  notices: Notice[] = [];

  ngOnInit() {
    this.commService.getNotices().subscribe(n => this.notices = n);
  }
}
