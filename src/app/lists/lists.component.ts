import {Component, inject, OnInit} from '@angular/core';
import {LikesService} from '../_services/likes.service';
import {Member} from '../_models/member';
import {FormsModule} from '@angular/forms';
import {ButtonsModule} from 'ngx-bootstrap/buttons';
import {MemberCardComponent} from '../members/member-card/member-card.component';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [
    FormsModule, ButtonsModule, MemberCardComponent
  ],
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {

  private likesService = inject(LikesService);
  members: Member[] = [];
  predicate = 'liked';

  ngOnInit() {
    this.loadLikes();
  }

  getTitle() {
    switch (this.predicate) {
      case 'liked': return 'Members you like';
      case 'likedBy': return 'Members who like you';
      default: return 'Mutual likes';
    }
  }

  loadLikes() {
    this.likesService.getLikes(this.predicate).subscribe({
      next: members => this.members = members
    });
  }
}
