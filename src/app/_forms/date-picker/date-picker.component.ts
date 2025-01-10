import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
import { FlatpickrDirective, provideFlatpickrDefaults } from 'angularx-flatpickr';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [FlatpickrDirective, FormsModule, NgIf],
  providers: [
    provideFlatpickrDefaults({
      altInput: true,
      altFormat: 'F j, Y',
      dateFormat: 'Y-m-d',
    }),
  ],
  templateUrl: './date-picker.component.html',
})
export class DatePickerComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() maxDate: string | Date = new Date();

  dateValue: Date | string | null = null;

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void {
    this.dateValue = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {}

  onChange = (value: any) => {};
  onTouched = () => {};

  get control() {
    return this.ngControl.control;
  }

  onDateChange(selectedDate: any) {
    this.onChange(selectedDate);
    this.onTouched();
  }
}
