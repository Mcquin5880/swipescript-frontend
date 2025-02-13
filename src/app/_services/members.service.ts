import {inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Member} from '../_models/member';
import {Photo} from '../_models/photo';
import {PaginatedResult} from '../_models/pagination';
import {UserParams} from '../_models/userParams';
import {of} from 'rxjs';
import {AccountService} from './account.service';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  private http = inject(HttpClient)
  private accountService = inject(AccountService);
  user = this.accountService.currentUser();
  baseUrl = environment.apiUrl
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null);
  userParams = signal<UserParams>(new UserParams(this.user));
  memberCache = new Map();

  getMembers(isAdmin: boolean = false) {
    const cacheKey = isAdmin ? 'admin-users' : Object.values(this.userParams()).join('-');
    const response = this.memberCache.get(cacheKey);
    if (response) {
      return this.setPaginatedResponse(response);
    }

    let params = new HttpParams();
    if (!isAdmin) {
      params = this.setPaginationHeaders(this.userParams().pageNumber, this.userParams().pageSize);
      params = params.append('minAge', this.userParams().minAge);
      params = params.append('maxAge', this.userParams().maxAge);
      params = params.append('gender', this.userParams().gender);
    }

    const url = isAdmin ? this.baseUrl + 'admin/users' : this.baseUrl + 'users';
    return this.http.get<Member[]>(url, { observe: 'response', params }).subscribe({
      next: (response) => {
        this.setPaginatedResponse(response);
        this.memberCache.set(cacheKey, response);
      },
      error: (err) => {
        console.error('Error fetching members:', err);
      },
    });
  }

  private setPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();
    if (pageNumber && pageSize) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
    }
    return params;
  }

  private setPaginatedResponse(response: HttpResponse<Member[]>) {
    this.paginatedResult.set({
      items: response.body as Member[],
      pagination: JSON.parse(response.headers.get('Pagination')!)
    });
  }

  getMember(username: string) {
    const member: Member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.body), [])
      .find((m: Member) => m.username === username);

    if (member) {
      return of(member);
    }

    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users/' + member.username, member).pipe(
      // tap(() => {
      //   this.members.update(members => members.map(m => m.username === member.username ? member : m));
      // })
    )
  }

  setMainPhoto(photo: Photo) {
    return this.http.patch(this.baseUrl + `photos/${photo.id}/set-main`, {}).pipe(
      // tap(() => {
      //   this.members.update(members => members.map(m => {
      //     if (m.photos.includes(photo)) {
      //       m.photoUrl = photo.url;
      //     }
      //     return m;
      //   }))
      // })
    )
  }

  deletePhoto(photo: Photo) {
    return this.http.delete(this.baseUrl + 'photos/' + photo.id).pipe(
      // tap(() => {
      //   this.members.update(members => members.map(m => {
      //     if (m.photos.includes(photo)) {
      //       m.photos = m.photos.filter(x => x.id !== photo.id)
      //     }
      //     return m;
      //   }))
      // })
    )
  }

  resetUserParams() {
    this.userParams.set(new UserParams(this.user));
  }

  deleteMember(userId: number) {
    return this.http.delete(this.baseUrl + `admin/users/${userId}`);
  }
}
