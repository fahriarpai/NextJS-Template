export interface formModal {
  description: string;
  path: string;
  status: string | undefined;
  id?: string;
}

export interface IInsert extends formModal {
  header: string;
  level: string;
  icon: string | null;
  sort: string;
  sub: string;
}
