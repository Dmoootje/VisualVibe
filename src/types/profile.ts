export type Profile = {
  uid: string;
  email: string;
  name?: string;
  /** Firebase Storage URL van de profielfoto; toont als auteursfoto op blog en cards. */
  photoUrl?: string;
  role: "admin";
  createdAt: string;
};
