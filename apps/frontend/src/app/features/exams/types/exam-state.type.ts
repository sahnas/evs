import { Exam } from "@evs/shared";

export type LoadingState = 'idle' | 'loading' | 'error' | 'success';

export interface ExamsState {
  items: Exam[];
  loadingState: LoadingState;
  error?: string;
  currentFilter?: string;
  page: number;
  pageSize: number;
  total: number;
}