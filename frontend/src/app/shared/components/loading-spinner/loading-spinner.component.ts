import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="flex items-center justify-center p-8">
      <div class="spinner"></div>
    </div>
  `,
  styles: []
})
export class LoadingSpinnerComponent {}
