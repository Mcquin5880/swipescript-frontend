import {Component, inject, OnInit} from '@angular/core';
import {MessageService} from '../_services/message.service';
import {FormsModule} from '@angular/forms';
import {ButtonRadioDirective} from 'ngx-bootstrap/buttons';
import {Message} from '../_models/message';
import {RouterLink} from '@angular/router';
import {PaginationComponent} from 'ngx-bootstrap/pagination';
import moment from 'moment';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    FormsModule,
    ButtonRadioDirective,
    RouterLink,
    PaginationComponent
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit {

  messageService = inject(MessageService);
  container = 'Inbox';
  pageNumber = 1;
  pageSize = 5;
  isOutbox = this.container === 'Outbox';

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container);
  }

  getRoute(message: Message) {
    if (this.container === 'Outbox') {
      return `/members/${message.recipientUsername}`;
    } else {
      return `/members/${message.senderUsername}`;
    }
  }

  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadMessages();
    }
  }

  setContainer(tab: string) {
    this.container = tab;
    this.pageNumber = 1;
    this.loadMessages();
  }

  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe({
      next: _ => {
        this.messageService.paginatedResult.update(prev => {
          if (prev && prev.items) {
            prev.items.splice(prev.items.findIndex(m => m.id === id), 1);
            return prev;
          }
          return prev;
        })
      }
    });
  }

  protected readonly moment = moment;
}
