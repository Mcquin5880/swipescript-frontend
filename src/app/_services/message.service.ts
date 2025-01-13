import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PaginatedResult } from '../_models/pagination';
import { Message } from '../_models/message';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  paginatedResult = signal<PaginatedResult<Message[]> | null>(null);

  getMessages(pageNumber: number, pageSize: number, container: string) {
    console.log(`getMessages called with pageNumber: ${pageNumber}, pageSize: ${pageSize}, container: ${container}`);

    let params = setPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);
    console.log('Request parameters:', params);

    this.http.get<Message[]>(this.baseUrl + 'messages', { observe: 'response', params })
      .subscribe({
        next: response => {
          console.log('API response received:', response);

          console.log('Response body:', response.body);
          console.log('Pagination header:', response.headers.get('Pagination'));

          setPaginatedResponse(response, this.paginatedResult);
          console.log('Paginated result updated:', this.paginatedResult());
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error occurred while fetching messages:', error);
        }
      });
  }

  getMessageThread(username: string) {
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + username);
  }

  sendMessage(username: string, content: string) {
    return this.http.post<Message>(this.baseUrl + 'messages', {recipientUsername: username, content});
  }

  deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + 'messages/' + id);
  }
}
