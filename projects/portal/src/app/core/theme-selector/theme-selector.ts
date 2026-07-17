import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Theme, ThemePreference } from '../theme';

interface ThemeOption {
  readonly value: ThemePreference;
  readonly label: string;
}

@Component({
  selector: 'app-theme-selector',
  imports: [MatButtonModule, MatMenuModule],
  templateUrl: './theme-selector.html',
  styleUrl: './theme-selector.css',
})
export class ThemeSelector {
  protected readonly theme = inject(Theme);
  protected readonly options: readonly ThemeOption[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'Device' },
  ];

  protected select(preference: ThemePreference): void {
    this.theme.setPreference(preference);
  }

  protected currentLabel(): string {
    return (
      this.options.find((option) => option.value === this.theme.preference())?.label ?? 'Device'
    );
  }
}
