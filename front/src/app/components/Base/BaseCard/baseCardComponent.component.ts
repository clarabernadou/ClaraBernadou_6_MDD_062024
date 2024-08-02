import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-base-card-component',
  templateUrl: './baseCardComponent.component.html',
  styleUrls: ['./baseCardComponent.component.scss', '../../../app.component.scss'],
})
export class BaseCardComponent {
  @Input() title: string = '';
  @Input() author: string = '';
  @Input() createdAt: Date = new Date();
  @Input() content: string = '';
  @Input() link: string[] = [];
  @Input() isLargeScreen: boolean = false;
  @Input() description: string = '';
  @Input() buttonText: string = '';
  @Input() ellipsis: number = 3;

  @Output() buttonClick = new EventEmitter<void>();

  onButtonClick() {
    this.buttonClick.emit();
  }
}
