import {Component, HostListener, inject, OnInit, ViewChild} from '@angular/core';
import {Member} from '../../models/member';
import {AccountService} from '../../_services/account.service';
import {MembersService} from '../../_services/members.service';
import {GalleryComponent} from 'ng-gallery';
import {TabDirective, TabsetComponent, TabsModule} from 'ngx-bootstrap/tabs';
import {FormsModule, NgForm} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {PhotoEditorComponent} from '../photo-editor/photo-editor.component';

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [
    GalleryComponent,
    TabDirective,
    TabsetComponent,
    TabsModule,
    FormsModule,
    PhotoEditorComponent
  ],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css'
})
export class MemberEditComponent implements OnInit {

  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event:any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }

  private accountService = inject(AccountService);
  private memberService = inject(MembersService);
  private toastr = inject(ToastrService);
  member?: Member;

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    const user = this.accountService.currentUser();
    if (!user) return;
    this.memberService.getMember(user.username).subscribe({
      next: member => this.member = member
    });
  }

  updateMember() {
    if (!this.member) return;
    this.memberService.updateMember(this.member).subscribe({
      next: _ => {
        this.toastr.success('Profile updated successfully');
        this.editForm?.reset(this.member);
      }
    });
  }

  onMemberChange(event: Member) {
    this.member = event;
  }
}
