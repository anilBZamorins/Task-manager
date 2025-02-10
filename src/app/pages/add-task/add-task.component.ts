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



@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule,MatFormFieldModule,MatInputModule,ReactiveFormsModule,MatIconModule,MatSelectModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {

  taskForm: any;
  action:any = 'create';
  EditData: any;
  DataTable: any;
  priorityLevels: string[] = ['Low', 'Medium', 'High'];
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
      title: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['', Validators.required],
      status: ['Pending', Validators.required]
      
    })
  }
  closeModal() {
    this.dialogRef.close();
     localStorage.clear()
  }
  onSubmit() {
    if (this.taskForm.valid) {
      let tasks = JSON.parse(localStorage.getItem('tasks') || '[]'); 
      const newTask = { 
        id: new Date().getTime(),
        ...this.taskForm.value 
      };
      tasks.push(newTask); 
      localStorage.setItem('tasks', JSON.stringify(tasks));
      this._snackBar.open('Successfully', 'CLOSE', {
        duration: 5000, 
      }) 
      this.dialogRef.close('refresh');
      // this.closeModal()

    }
  }
  
}
