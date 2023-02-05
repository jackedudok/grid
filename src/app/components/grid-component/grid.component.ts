import {Component} from '@angular/core';
import {ColDef, GridApi, GridReadyEvent, RowClickedEvent} from 'ag-grid-community';
import {MatDialog} from '@angular/material/dialog';
import {Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import {ColumnApi} from 'ag-grid-community/dist/lib/columns/columnApi';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AddEditGridDialogComponent} from '../../dialogs/add-edit-grid-dialog/add-edit-grid-dialog.component';
import {TestApiService} from '../../api-services/test.api.service';
import {GridInterface} from '../../interfaces/grid.interface';
import {DropdownInterface} from '../../interfaces/dropdown.interface';
import {ActionEnum} from "../../enums/action.enum";
import {RoleEnum} from "../../enums/role.enum";
import {StatusEnum} from "../../enums/status.enum";

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent {
  private readonly unsubscribe$: Subject<void> = new Subject<void>();

  private gridApi!: GridApi<any>;
  private selectedRole: number = RoleEnum.Admin;
  private selectedStatus: number = StatusEnum.None;
  private rowIndex!: number;

  public gridColumnApi!: ColumnApi;
  public title = 'angular-test-project';
  public selectedRowData!: GridInterface;
  public actionEnum = ActionEnum;
  public columnDefs: ColDef[] = [
    {field: 'name', headerName: 'Name', filter: true},
    {field: 'address', headerName: 'Address'},
    {field: 'amount', headerName: 'Amount'},
    {field: 'roleDescription', headerName: 'Create by', hide: true},
    {field: 'statusDescription', headerName: 'Status'}
  ];

  public roles: DropdownInterface[] = [
    {name: 'Customer', value: 0},
    {name: 'Business', value: 1},
    {name: 'Admin', value: 2}
  ];

  public statuses: DropdownInterface[] = [
    {name: 'None', value: 0},
    {name: 'Open', value: 1},
    {name: 'Pending', value: 2},
    {name: 'Close', value: 3}
  ];

  gridData: GridInterface[] = [];

  constructor(private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private testApiService: TestApiService) {
  }

  ngOnInit() {
    this.getData()
  }

  private openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {duration: 1000});
  }


  public openDialog(action: number): void {
    if ((action === ActionEnum.Edit && !!this.selectedRowData) || action === ActionEnum.Add) {
      const dialogRef = this.dialog.open(AddEditGridDialogComponent, {
        width: '250px',
        data: {selectedData: this.selectedRowData, action: action, role: this.selectedRole},
        disableClose: true
      });

      dialogRef.afterClosed().pipe(
        filter((result) => !!result),
        takeUntil(this.unsubscribe$)
      ).subscribe(result => {
        let returnData = result
        if (action === ActionEnum.Add) {
          returnData.role = this.selectedRole
          returnData.roleDescription = this.roles.find(role => +role.value === +this.selectedRole)?.name
        } else {
          returnData.role = this.selectedRowData.role
          returnData.roleDescription = this.selectedRowData.roleDescription
        }
        returnData.statusDescription = this.statuses.find(status => +status.value === +result.status)?.name
        if (action === ActionEnum.Edit) {
          this.gridData.splice(this.rowIndex, 1, returnData)
          this.updateRecord(returnData)
        } else {
          this.gridData.push(returnData)
          this.selectedStatus = StatusEnum.None
          this.addRecord([returnData])
        }
      });
    }

  }

  public getData(): void {
    this.testApiService.getItems()
      .pipe(
        filter((result) => !!result),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((result) => {
          this.setData(result)
        }
      );
  }

  public updateData(): void {
    this.testApiService.updateItems(this.gridData)
      .pipe()
      .subscribe(() => {
          this.openSnackBar('Data updated successfully', 'Close')
        }
      );
  }

  private addRecord(newData: Array<GridInterface>): void {
    this.gridApi.applyTransaction({add: newData});
  }

  private setData(data: GridInterface[]): void {
    this.gridApi.setRowData(data);
    this.updateGridData();
    setTimeout(() => {
      this.filterData()
    })
  }

  public onGridReady(params: GridReadyEvent<GridInterface>): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  private updateRecord(newData: GridInterface): void {
    this.gridApi.forEachNodeAfterFilterAndSort((rowNode) => {
      if (rowNode.isSelected()) {
        rowNode.setData(newData);
      }
    });
  }

  public removeSelectedRecord(): void {
    const selectedData = this.gridApi.getSelectedRows();

    this.gridApi.applyTransaction({remove: selectedData});

    this.updateGridData();
  }

  private updateGridData(): void {
    this.gridData = []
    this.gridApi.forEachNode((node) => {
      this.gridData.push(node.data)
    })
  }

  public rowClicked(selectedRow: any): void {
    this.selectedRowData = selectedRow.data
    this.rowIndex = selectedRow.rowIndex

  }

  public roleSelectionChange(value: number): void {
    this.selectedRole = +value
    this.filterData();
  }

  private filterByRole(value: number, showAllData: boolean = false): GridInterface[] {
    let filteredGridData = [];
    filteredGridData = this.gridData.filter(el => +el.role === value);
    this.gridApi.setRowData(showAllData ? this.gridData : filteredGridData);

    return showAllData ? this.gridData : filteredGridData
  }

  private filterByStatus(value: number, showAllData: boolean = false, currentData: GridInterface[]): void {
    let filteredGridData = [];
    filteredGridData = currentData.filter(el => +el.status === value);
    this.gridApi.setRowData(showAllData ? currentData : filteredGridData);
  }

  public statusSelectionChange(value: number): void {
    this.selectedStatus = +value
    this.filterData();
  }

  private filterData() {
    const columns = this.gridColumnApi.getAllColumns();
    // @ts-ignore
    const roleColumn = columns.filter(column => column.getColDef().field === "roleDescription")[0];
    let currentGridData = [];
    if (this.selectedRole === RoleEnum.Admin) {
      this.gridColumnApi.setColumnVisible(roleColumn, true);
      currentGridData = this.filterByRole(this.selectedRole, true)
    } else {
      this.gridColumnApi.setColumnVisible(roleColumn, false);
      currentGridData = this.filterByRole(this.selectedRole)
    }

    if (this.selectedStatus != StatusEnum.None) {
      this.filterByStatus(this.selectedStatus, false, currentGridData)
    } else {
      this.gridApi.setRowData(currentGridData);
    }
  }
}
