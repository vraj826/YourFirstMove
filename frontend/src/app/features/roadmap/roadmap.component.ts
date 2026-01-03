import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../core/services/task.service';
import { Task } from '../../core/models/task.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { TaskFormComponent } from '../tasks/task-form/task-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

interface TimeSlot {
  hour: number;
  displayTime: string;
  tasks: Task[];
}

@Component({
  selector: 'app-roadmap',
  templateUrl: './roadmap.component.html',
  styleUrls: ['./roadmap.component.scss']
})
export class RoadmapComponent implements OnInit {
  tasks: Task[] = [];
  loading = false;
  selectedDate = new Date().toISOString().split('T')[0];
  completionPercentage = 0;
  viewMode: 'timeline' | 'list' = 'timeline';
  timeSlots: TimeSlot[] = [];
  currentTime = new Date();

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    // Update current time every minute
    setInterval(() => {
      this.currentTime = new Date();
    }, 60000);
  }

  ngOnInit(): void {
    // Check for date query parameter
    this.route.queryParams.subscribe(params => {
      if (params['date']) {
        this.selectedDate = params['date'];
      }
      this.loadTasks();
    });
  }

  loadTasks(): void {
    this.loading = true;
    this.taskService.getTasksByDate(this.selectedDate).subscribe({
      next: (response) => {
        this.tasks = response.data.tasks;
        this.calculateCompletion();
        this.generateTimeSlots();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  generateTimeSlots(): void {
    this.timeSlots = [];
    for (let hour = 0; hour < 24; hour++) {
      const displayTime = this.formatHour(hour);
      
      this.timeSlots.push({
        hour,
        displayTime,
        tasks: [] // We'll position tasks absolutely, not in slots
      });
    }
  }

  // Get tasks with their visual positioning for timeline
  getTimelineTasksWithPosition(): any[] {
    return this.tasks
      .filter(task => task.due_time) // Only tasks with start time
      .map(task => {
        const [startHour, startMinute] = task.due_time!.split(':').map(Number);
        const startPosition = startHour + (startMinute / 60);
        
        // Calculate duration
        let duration = 1; // Default 1 hour
        const endTime = (task as any).end_time;
        if (endTime) {
          const [endHour, endMinute] = endTime.split(':').map(Number);
          const endPosition = endHour + (endMinute / 60);
          duration = endPosition - startPosition;
          if (duration <= 0) duration = 1; // Minimum 1 hour
        }
        
        return {
          ...task,
          startPosition: (startPosition / 24) * 100, // Percentage from top
          height: (duration / 24) * 100, // Height as percentage
          startTime: task.due_time,
          endTime: endTime || this.calculateEndTime(task.due_time!, duration)
        };
      });
  }

  calculateEndTime(startTime: string, durationHours: number): string {
    const [hour, minute] = startTime.split(':').map(Number);
    const totalMinutes = hour * 60 + minute + (durationHours * 60);
    const endHour = Math.floor(totalMinutes / 60) % 24;
    const endMinute = totalMinutes % 60;
    return `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
  }

  formatHour(hour: number): string {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  }

  isCurrentHour(hour: number): boolean {
    const today = new Date().toISOString().split('T')[0];
    if (this.selectedDate !== today) return false;
    return this.currentTime.getHours() === hour;
  }

  getCurrentTimePosition(): number {
    const minutes = this.currentTime.getMinutes();
    return (minutes / 60) * 100;
  }

  calculateCompletion(): void {
    if (this.tasks.length === 0) {
      this.completionPercentage = 0;
      return;
    }
    const completed = this.tasks.filter(t => t.is_completed).length;
    this.completionPercentage = Math.round((completed / this.tasks.length) * 100);
  }

  getCompletedCount(): number {
    return this.tasks.filter(t => t.is_completed).length;
  }

  getPriorityClass(priority: string): string {
    const classes: { [key: string]: string } = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-orange-100 text-orange-800',
      'critical': 'bg-red-100 text-red-800'
    };
    return classes[priority] || 'bg-gray-100 text-gray-800';
  }

  getPriorityBorderClass(priority: string): string {
    const classes: { [key: string]: string } = {
      'low': 'border-l-4 border-green-500',
      'medium': 'border-l-4 border-yellow-500',
      'high': 'border-l-4 border-orange-500',
      'critical': 'border-l-4 border-red-500'
    };
    return classes[priority] || 'border-l-4 border-gray-500';
  }

  drop(event: CdkDragDrop<Task[]>): void {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
    const taskIds = this.tasks.map(t => t.id);
    this.taskService.reorderTasks(taskIds).subscribe();
  }

  toggleComplete(task: Task): void {
    if (task.is_completed) {
      return;
    }
    this.taskService.markComplete(task.id).subscribe(() => {
      this.loadTasks();
      this.snackBar.open('Task completed! 🎉', 'Close', { duration: 2000 });
    });
  }

  openTaskDialog(task?: Task): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '600px',
      data: { task }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  deleteTask(task: Task, event: Event): void {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      this.taskService.deleteTask(task.id).subscribe(() => {
        this.snackBar.open('Task deleted', 'Close', { duration: 2000 });
        this.loadTasks();
      });
    }
  }

  onDateChange(): void {
    this.loadTasks();
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'timeline' ? 'list' : 'timeline';
  }

  getUnscheduledTasks(): Task[] {
    return this.tasks.filter(task => !task.due_time);
  }
}
