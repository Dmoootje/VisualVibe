export type Subscriber = {
  id: string;
  email: string;
  /** Path the subscriber signed up from (e.g. /kennisbank). */
  sourcePage?: string;
  createdAt: string;
};
