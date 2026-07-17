import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { GITHUB_URL } from '../../site';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, MatCardModule, NgOptimizedImage, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected readonly githubUrl = GITHUB_URL;
}
