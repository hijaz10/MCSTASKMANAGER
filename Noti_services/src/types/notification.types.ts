export interface TaskCreatedMessage {
  taskId: string;
  userId: string;
  title: string;
  userEmail?: string;
}
