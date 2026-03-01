export interface SubscribeEvaResponse {
  acknowledgeId: string;
  dateTime: string;
  operation: string;
  message: string;
  subscription: Subscription;
}

export interface Subscription {
  eventType: string;
  webHookUrl: string;
  enrollmentId: string;
  subscriptionId: string;
  dateTime: string;
}
