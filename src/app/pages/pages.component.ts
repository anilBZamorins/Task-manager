import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { FormsModule } from '@angular/forms';
import {CdkDragDrop, DragDropModule,CdkDropList, CdkDrag, moveItemInArray} from '@angular/cdk/drag-drop';
import { MatTable } from '@angular/material/table';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';




interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string;
  reminded?: boolean;
}

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [CommonModule,DragDropModule,MatSlideToggleModule,FormsModule,MatChipsModule,MatIconModule,MatSortModule,MatFormFieldModule,MatInputModule,MatInputModule,MatFormFieldModule,MatPaginatorModule,MatTableModule  ],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss'
})
export class PagesComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['id', 'title', 'description', 'priority', 'status','dueDate', 'actions'];
  dataSource: MatTableDataSource<Task>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  lastFilterValue: string = '';
  taskIdCounter = 1;
  Data:any;
  filteredTasks: any[] = [];
  sortBy: string = 'date';
  filterBy: string = 'all'; 
  tasks: any[] = [];
  reminderInterval: any;
  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(
    private snackBar: MatSnackBar,  public dialog: MatDialog,
    private _snackBar: MatSnackBar,
  ){
    this.dataSource = new MatTableDataSource();
  }
  ngOnInit() {
    this.FetchTask()
    this.startReminderCheck();
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    }
  }
  ngOnDestroy() {
    clearInterval(this.reminderInterval); 
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
  FetchTask() {
    const storedData = localStorage.getItem('tasks');
    this.Data = storedData ? JSON.parse(storedData) : [];
    this.dataSource = new MatTableDataSource<Task>(this.Data);
  }
  

  openTaskDialog(): void {
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '50%',
      data: this.dataSource
    });

    dialogRef.afterClosed().subscribe((result: string ) => {
      if (result === 'refresh') {
        this.FetchTask(); 
        this.startReminderCheck();
      }
    });
  }

  editTask(task: Task): void {
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width:'50%',
      data: {
        action: 'edit',
        payload: task
      }   
      });
      dialogRef.afterClosed().subscribe((result: string ) => {
        if (result === 'refresh') {
          this.FetchTask(); 
        }
      });
  }


  softDeleteTask(id: number) {
    let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const index = tasks.findIndex((task:any) => task.id === id);
    if (index !== -1) {
      tasks[index].deleted = true;
      localStorage.setItem('tasks', JSON.stringify(tasks));
      this._snackBar.open('Task deleted (soft delete)', 'CLOSE', { duration: 3000 });
      this.loadTasks(); 
    }
  }
  loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    this.dataSource.data = tasks.filter((task:any) => !task.deleted);
  }

  applyFilters() {
    let filtered = this.Data; 
  
    if (this.filterBy === 'Completed') {
      filtered = filtered.filter((task:any) => task.status === 'Completed');
      this.dataSource.data = filtered;
    } else if (this.filterBy === 'Pending') {
      filtered = filtered.filter((task:any) => task.status === 'Pending');
      this.dataSource.data = filtered;
    }else{
      this.dataSource = new MatTableDataSource<Task>(this.Data);
    }
  }
  startReminderCheck() {
    this.reminderInterval = setInterval(() => {
      const today = new Date().toISOString().split('T')[0];
      let tasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]');

      tasks.forEach((task) => {
        if (task.dueDate === today && !task.reminded) {
          alert(`Reminder: Task "${task.title}" is due today!`);
          task.reminded = true;
        }
      });

      localStorage.setItem('tasks', JSON.stringify(tasks));
    }, 60000);
  }
  drop(event: CdkDragDrop<string>) {
    const previousIndex = this.dataSource.data.findIndex(d => d === event.item.data);
    moveItemInArray(this.dataSource.data, previousIndex, event.currentIndex);
    this.table.renderRows();
}
toggleDarkMode(event: MatSlideToggleChange) {
  if (event.checked) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
  }
}
}
