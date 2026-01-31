import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  howItWorks = [
    {
      icon: 'task_alt',
      title: 'Post Your Task',
      description: 'Describe what you need done and set your budget'
    },
    {
      icon: 'people',
      title: 'Get Applications',
      description: 'Skilled helpers apply to complete your task'
    },
    {
      icon: 'verified',
      title: 'Get It Done',
      description: 'Choose your helper and get your task completed'
    }
  ];

  whyTaskini = [
    {
      icon: 'security',
      title: 'Safe & Secure',
      description: 'All helpers are verified for your peace of mind'
    },
    {
      icon: 'payments',
      title: 'Fair Pricing',
      description: 'Set your budget and get competitive offers'
    },
    {
      icon: 'support_agent',
      title: '24/7 Support',
      description: 'We\'re here to help whenever you need us'
    },
    {
      icon: 'star',
      title: 'Top Rated',
      description: 'Thousands of 5-star reviews from happy users'
    }
  ];

  testimonials = [
    {
      name: 'Sarah M.',
      role: 'Busy Parent',
      rating: 5,
      text: 'TASKini saved me so much time! I got help with grocery shopping and house cleaning. Highly recommend!',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+M&background=4CAF50&color=fff'
    },
    {
      name: 'Mike T.',
      role: 'College Student',
      text: 'I make extra money tutoring and doing small tasks. Love the flexibility!',
      rating: 5,
      avatar: 'https://ui-avatars.com/api/?name=Mike+T&background=388E3C&color=fff'
    },
    {
      name: 'Emily R.',
      role: 'Small Business Owner',
      text: 'Quick, reliable help whenever I need it. The helpers are professional and friendly.',
      rating: 5,
      avatar: 'https://ui-avatars.com/api/?name=Emily+R&background=A5D6A7&color=333'
    }
  ];

  currentTestimonial = 0;

  nextTestimonial(): void {
    this.currentTestimonial = (this.currentTestimonial + 1) % this.testimonials.length;
  }

  prevTestimonial(): void {
    this.currentTestimonial = this.currentTestimonial === 0 
      ? this.testimonials.length - 1 
      : this.currentTestimonial - 1;
  }
}
