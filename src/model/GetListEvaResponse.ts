export interface GetListEvaResponse {
  _metadata: {
    page: number;
    perPage: number;
    pageCount: number;
    totalCount: number;
    links: {
      self: string;
      first: string;
      previous: string;
      next: string;
      last: string;
    };
  };
  subscriptions: Array<{
    eventType: string;
    webHookUrl: string;
    enrollmentId: string;
    subscriptionId: string;
    dateTime: string;
  }>;
}

export interface ReturnListEvaResponse {
  eventType: string;
  webHookUrl: string;
  enrollmentId: string;
  subscriptionId: string;
  dateTime: string;
}
