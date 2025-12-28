import { Component, model } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  host: {
    'class': 'flex justify-center items-center bg-black/50 dark:bg-gray-700/50 fixed z-10 inset-0 w-full h-full',
    '[class.hidden]': '!isOpened()',
    '(click)': 'close()'
  }
})
export class Modal {
  isOpened = model<boolean>(false);

  close() {
    this.isOpened.set(false);
  }
}
