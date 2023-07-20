import { exeQuery } from "../db";
import { ISession } from "./common.interface";
interface IPermission {
  m_insert: number;
  m_update: number;
  m_delete: number;
  m_view: number;
}

export const pageCheck = async (
  username: string,
  currentPath: string
): Promise<{ isPass: Boolean; permission?: IPermission }> => {
  const path = currentPath.substring(0, currentPath.length - 1);

  // A.id menu_header, A.description menu, A.path, A.level, A.header sub,
  const syntax = `SELECT A.id menu_header, A.description menu, A.path, A.level, A.header sub, A.icon, B.m_insert, B.m_update, B.m_delete, B.m_view
  FROM menu A,
      access_det B,
      "access" C,
      "user" D
  WHERE A.id = B."menuId"  
      AND B."accessId" = C.id
      AND C.id = D."accessId" 
        AND D.username = ? AND A.path = ? AND B.m_view = 1`;

  const result: any = await exeQuery(syntax, [username, path]);

  if (result.length < 1) {
    return { isPass: false };
  }

  return { isPass: true, permission: result[0] };
};

export const _csvMaker = (data: any) => {
  const items = data;
  const replacer = (key: string, value: any) => (value === null ? "" : value); // specify how you want to handle null values here
  const header = Object.keys(items[0]);
  const csv = [
    header.join(","), // header row first
    ...items.map((row: any) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(",")
    ),
  ].join("\r\n");

  return csv;
};
