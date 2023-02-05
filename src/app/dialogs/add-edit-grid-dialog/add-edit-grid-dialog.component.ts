import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subject} from 'rxjs';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DropdownInterface} from "../../interfaces/dropdown.interface";
import {GridInterface} from "../../interfaces/grid.interface";
import {ActionEnum} from "../../enums/action.enum";
import {RoleEnum} from "../../enums/role.enum";

@Component({
  templateUrl: './add-edit-grid-dialog.component.html',
  styleUrls: ['./add-edit-grid-dialog.component.scss']
})
export class AddEditGridDialogComponent implements OnInit, OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject<void>();

  public roleEnum = RoleEnum
  public formGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    amount: new FormControl('', [Validators.required]),
    status: new FormControl('2' , [Validators.required]),
  });

  statuses: DropdownInterface[] = [
    {name: 'Open', value: 1},
    {name: 'Pending', value: 2},
    {name: 'Close', value: 3}
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public readonly dialogRef: MatDialogRef<any>) {
  }

  public ngOnInit(): void {
    if (this.data.action === ActionEnum.Edit) {
      this.fillForm(this.data.selectedData)
    }
  }

  private fillForm(data: GridInterface): void {
    this.formGroup.patchValue({
      name: data.name,
      address: data.address,
      amount: data.amount,
      status: data.status
    })
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return
    }
    this.dialogRef.close(this.formGroup.value);
  }
}
