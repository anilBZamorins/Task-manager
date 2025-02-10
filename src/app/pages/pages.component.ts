import { Component, ViewChild } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { AddTaskComponent } from './add-task/add-task.component';




interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
}

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [CommonModule,MatChipsModule,MatIconModule,MatSortModule,MatFormFieldModule,MatInputModule,MatInputModule,MatFormFieldModule,MatPaginatorModule,MatTableModule  ],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss'
})
export class PagesComponent {

  displayedColumns: string[] = ['id', 'title', 'description', 'priority', 'status', 'actions'];
  dataSource: MatTableDataSource<Task>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  lastFilterValue: string = '';
  taskIdCounter = 1;
  Data:any;
  constructor(
    private snackBar: MatSnackBar,  public dialog: MatDialog,
  ){
    this.dataSource = new MatTableDataSource();
  }
  ngOnInit() {
    this.FetchTask()
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
  FetchTask() {
    const storedData = localStorage.getItem('tasks');
    this.Data = storedData ? JSON.parse(storedData) : [];
    console.log(this.Data);
  
    this.dataSource = new MatTableDataSource<Task>(this.Data);
  }
  

  openTaskDialog(): void {
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '50%',
      height: '350px',
      data: this.dataSource
    });

    dialogRef.afterClosed().subscribe((result: string ) => {
      if (result === 'refresh') {
        this.FetchTask(); 
      }
    });
  }

  editTask(task: Task): void {
    // Implement edit logic
  }

  deleteTask(task: Task): void {
    const index = this.dataSource.data.findIndex(t => t.id === task.id);
    if (index !== -1) {
      this.dataSource.data.splice(index, 1);
      this.dataSource._updateChangeSubscription();
      this.snackBar.open('Task deleted successfully', 'Close', { duration: 2000 });
    }
  }
}
