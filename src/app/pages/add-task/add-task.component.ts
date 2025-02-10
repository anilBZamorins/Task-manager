import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core'; 





@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule,MatFormFieldModule,MatDatepickerModule,MatInputModule,ReactiveFormsModule,MatIconModule,MatSelectModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
  providers: [provideNativeDateAdapter()], 

})
export class AddTaskComponent {

  taskForm: any;
  action:any = 'create';
  EditData: any;
  DataTable: any;
  priorityLevels: string[] = ['Low', 'Medium', 'High'];
  statusLevels: string[] = ['Completed', 'Pending',];
  editingTaskId: number | null = null;
  constructor(
    private router: Router,
    private builder: FormBuilder,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddTaskComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public EditType: any
  ){
    this.action = EditType.action;
    this.EditData = EditType.payload;
    this.DataTable=EditType.data;
  }
  ngOnInit() {
   
    
   
      this.taskForm = this.builder.group({
        id:[''],
        title: ['', Validators.required],
        description: ['', Validators.required],
        priority: ['', Validators.required],
        status: ['', Validators.required],
        deleted:[false],
        reminded:[false],
        dueDate: ['', Validators.required]
        
      })
      
      if(this.action === 'edit') {
      this.taskForm.setValue({
        id:this.EditData.id,
        title:this.EditData.title,
        description:this.EditData.description,
        priority:this.EditData.priority,
        status: this.EditData.status,
        deleted: this.EditData.deleted,
        reminded:this.EditData.reminded,
        dueDate: this.EditData.dueDate

      })
    }
  }
  formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }
  closeModal() {
    this.dialogRef.close();
     localStorage.clear()
  }
  onSubmit() {
    if (this.taskForm.valid) {
      let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  
      if (this.action === 'edit') {
        const index = tasks.findIndex((task:any) => task.id === this.EditData.id);
        if (index !== -1) {
          tasks[index] = { ...this.taskForm.value, id: this.EditData.id };
        }
        
      } else {
        const newTask = { 
          
          ...this.taskForm.value, 
          id: new Date().getTime(), 
          deleted: false ,
          reminded: false,
          dueDate: this.formatDate(this.taskForm.value.dueDate) 
        };
        tasks.push(newTask);
      }
  
      localStorage.setItem('tasks', JSON.stringify(tasks));
      this.dialogRef.close('refresh');
      this._snackBar.open('Successfully', 'CLOSE', { duration: 5000 });
      
    }
  }
  
  
}
