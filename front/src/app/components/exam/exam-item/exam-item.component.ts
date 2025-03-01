import { Component, Input } from '@angular/core';
import type { Exam } from '../../../models/exam.model';
import { DatePipe } from '@angular/common';
import { StatusDisplayPipe } from '../../../shared/pipes/status-display.pipe';

@Component({
  selector: 'app-exam-item',
  standalone: true,
  imports: [DatePipe, StatusDisplayPipe],
  template: `
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div class="grid grid-cols-5 gap-4 items-center">
        <div class="flex items-center gap-3">
          <span class="text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
          <span class="font-medium text-gray-900">
            {{ exam.student.first_name }}.{{ exam.student.last_name }}
          </span>
        </div>

        <div class="flex items-center gap-3">
          <span class="text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
          <span class="text-gray-700">{{
            exam.meeting_point || 'En attente'
          }}</span>
        </div>

        <div class="flex items-center gap-3">
          <span class="text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
          <span class="text-gray-700">
            {{ exam.date ? (exam.date | date : 'dd/MM/yyyy') : 'En attente' }}
          </span>
        </div>

        <div class="flex items-center gap-3">
          <span class="text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
          <span class="text-gray-700">
            {{ exam.date ? (exam.date | date : 'HH:mm') : 'En attente' }}
          </span>
        </div>

        <div class="flex justify-end">
          <span
            [class]="getStatusClasses(exam.status)"
            class="flex items-center gap-2"
          >
            <span class="text-current">
              @if (exam.status === 'Confirmé') {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              } @if (exam.status === 'Annulé') {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
              } @if (exam.status === 'A organiser') {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clip-rule="evenodd"
                />
              </svg>
              } @if (exam.status === 'Recherche de place') {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd"
                />
              </svg>
              }
            </span>
            {{ exam.status | statusDisplay }}
          </span>
        </div>
      </div>
    </div>
  `,
})
export class ExamItemComponent {
  @Input({ required: true }) exam!: Exam;

  getStatusClasses(status: string): string {
    const baseClasses = 'px-4 py-2 rounded-full text-sm font-medium';
    const statusClasses = {
      Confirmé: 'bg-green-50 text-green-700',
      Annulé: 'bg-red-50 text-red-700',
      'Recherche de place': 'bg-gray-50 text-gray-700',
      'A organiser': 'bg-orange-50 text-orange-700',
    };

    return `${baseClasses} ${
      statusClasses[status as keyof typeof statusClasses] || ''
    }`;
  }
}
