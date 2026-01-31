import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/task.model';
import { BadgeComponent } from '../../shared/badge/badge.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, BadgeComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User | null = null;
  editableUser: User = {} as User;
  skillsText: string = "";
  editMode = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.user = this.userService.getCurrentUser();

    if (this.user) {

      // fallback avatar
      if (!this.user.avatar || this.user.avatar === "undefined") {
        this.user.avatar = "https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'User')}&background=4CAF50&color=fff";

      }

      this.editableUser = { ...this.user };
      this.skillsText = this.user.skills?.join(', ') ?? "";
    }
  }

  enableEdit() {
    this.editMode = true;
  }

  save() {
    this.editableUser.skills = this.skillsText
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    this.userService.updateUser(this.editableUser).subscribe((updatedUser) => {

      // update profile
      this.user = updatedUser;

      // exit edit mode
      this.editMode = false;

      // store updated user
      this.userService.setCurrentUser(updatedUser);
    });
  }

  cancel() {
    this.editMode = false;
    this.editableUser = { ...this.user! };
    this.skillsText = this.user?.skills?.join(', ') ?? "";
  }
}
