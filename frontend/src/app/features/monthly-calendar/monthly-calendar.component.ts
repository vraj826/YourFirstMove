import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../core/services/task.service';
import { Task } from '../../core/models/task.model';
import { Router } from '@angular/router';

interface CalendarDay {
  date: Date;
  dateString: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
  completedCount: number;
  totalCount: number;
  completionPercentage: number;
}

@Component({
  selector: 'app-monthly-calendar',
  templateUrl: './monthly-calendar.component.html',
  styleUrls: ['./monthly-calendar.component.scss']
})
export class MonthlyCalendarComponent implements OnInit {
  currentDate = new Date();
  calendarDays: CalendarDay[] = [];
  loading = false;
  monthName = '';
  year = 0;

  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCalendar();
  }

  loadCalendar(): void {
    this.loading = true;
    this.monthName = this.currentDate.toLocaleString('default', { month: 'long' });
    this.year = this.currentDate.getFullYear();

    const month = this.currentDate.getMonth();
    const year = this.currentDate.getFullYear();
    const monthString = `${year}-${String(month + 1).padStart(2, '0')}`;

    this.taskService.getTasksByMonth(monthString).subscribe({
      next: (response) => {
        const tasks = response.data.tasks;
        this.generateCalendarDays(year, month, tasks);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  generateCalendarDays(year: number, month: number, tasks: Task[]): void {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    this.calendarDays = [];

    // Add previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      this.calendarDays.push(this.createCalendarDay(date, false, tasks));
    }

    // Add current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      this.calendarDays.push(this.createCalendarDay(date, true, tasks));
    }

    // Add next month days to complete the grid
    const remainingDays = 42 - this.calendarDays.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      this.calendarDays.push(this.createCalendarDay(date, false, tasks));
    }
  }

  createCalendarDay(date: Date, isCurrentMonth: boolean, allTasks: Task[]): CalendarDay {
    // Create date string in local timezone (YYYY-MM-DD)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    // Get today's date in same format
    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    // Filter tasks for this date - compare date strings
    const dayTasks = allTasks.filter(t => {
      const taskDate = t.due_date.split('T')[0]; // Remove time component if present
      return taskDate === dateString;
    });
    
    const completedCount = dayTasks.filter(t => t.is_completed).length;
    const totalCount = dayTasks.length;
    const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return {
      date,
      dateString,
      isCurrentMonth,
      isToday: dateString === todayString,
      tasks: dayTasks,
      completedCount,
      totalCount,
      completionPercentage
    };
  }

  previousMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.loadCalendar();
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.loadCalendar();
  }

  goToToday(): void {
    this.currentDate = new Date();
    this.loadCalendar();
  }

  onDayClick(day: CalendarDay): void {
    if (day.isCurrentMonth) {
      this.router.navigate(['/dashboard/roadmap'], {
        queryParams: { date: day.dateString }
      });
    }
  }

  getDayClasses(day: CalendarDay): string {
    const classes = ['calendar-day'];
    if (!day.isCurrentMonth) classes.push('other-month');
    if (day.isToday) classes.push('today');
    if (day.totalCount > 0) classes.push('has-tasks');
    return classes.join(' ');
  }

  getCompletionBadgeClass(percentage: number): string {
    if (percentage === 100) return 'bg-green-500';
    if (percentage > 0) return 'bg-yellow-500';
    return 'bg-gray-400';
  }

  getTaskDotClass(priority: string, isCompleted: boolean): string {
    const baseClasses: { [key: string]: string } = {
      'low': 'bg-green-500',
      'medium': 'bg-yellow-500',
      'high': 'bg-orange-500',
      'critical': 'bg-red-500'
    };
    const colorClass = baseClasses[priority] || 'bg-gray-500';
    return isCompleted ? `${colorClass} opacity-50` : colorClass;
  }
}
