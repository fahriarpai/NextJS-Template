export interface ISession {
  // accessToken: any;
  // accessToken(accessToken: any): IMenu[] | PromiseLike<IMenu[]>;
  id: number;
  username: string;
  email?: string;
  name: string;
  fullname: string;
  password?: string;
  accessId?: number;
  role: string;
  createdAt?: number;
  maxAge?: number;
}

export interface IMenu {
  menu_header: number;
  menu: string;
  path: string;
  level: number;
  sub: number;
  icon: string | null;
  m_insert: number;
  m_delete: number;
  m_update: number;
  m_view: number;
}
