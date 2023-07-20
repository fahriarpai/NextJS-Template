import { exeQuery } from "../../../lib/db";
import { IInsert } from "@/dto/menu.dto";

export const getMenu = async (username: string) => {
  const syntax = `SELECT A.id, A.id menu_header, A.description menu, A.path, A.level, A.header sub, B.m_insert, A.icon, B.m_update, B.m_delete, B.m_view
  FROM menu A,
      access_det B,
      "access" C,
      "user" D
  WHERE A.id = B."menuId"  
      AND B."accessId" = C.id
      AND C.id = D."accessId"
        AND D.username = '${username}'
        AND B.m_view = 1
        ORDER BY A.sort`;
  //console.log(syntax);

  const result = await exeQuery(syntax, []);

  return result;
};

export const listAll = async (type: string | number) => {
  let whereStatus = "";
  if (type == 1) {
    whereStatus = ` AND A.status = '1' `;
  }

  let syntax = `SELECT A.id menu_header, A.description menu, level, header sub, 0 AS m_insert, 0 AS m_update,
    0 AS m_delete, 0 AS m_view, 0 AS sort, 0 AS access_det_id, path, A.status, A.sort
    FROM menu A WHERE 1 = 1 ${whereStatus} ORDER BY A.sort ASC`;
  // console.log(syntax);

  const result: any = await exeQuery(syntax, []);
  return result;
  // return exeQuery(syntax, []);
};

export const findOneRole = (description: string) => {
  const syntax = `SELECT id FROM access A WHERE A.description = $1`;
  return exeQuery(syntax, [description]);
};

export const listLeftAccess = async (accessId: string) => {
  const syntax = `SELECT A.id menu_header, A.description menu, A.path, A.level, A.header sub, B.id AS access_det_id, 
    B.m_insert, B.m_update, B.m_delete, B.m_view, A.sort
    FROM menu A
    LEFT JOIN (SELECT id, m_insert, m_update, m_delete, m_view, "menuId" FROM "access_det" WHERE access_det."accessId" = $1) B 
    ON B."menuId" = A.id ORDER BY A.sort`;

  const result: any = await exeQuery(syntax, [accessId]);

  return result;
};

export const findOne = (param: IInsert) => {
  const syntax = `SELECT A.description headDesc, A.level headLevel, A.path headPath,
    B.description childDesc, B.level childDesc, B.header childDesc, B.path childPath, B.status childStatus
    FROM menu A, menu B WHERE A.id = B.header AND A.description = $1`;
  return exeQuery(syntax, [param.description]);
};

export const save = (param: IInsert) => {
  const syntax = `INSERT INTO menu (description, status, path, header, level, icon, sort, "masterMediaId") 
    VALUES ($1, $2, $3, $4, $5, $6, $7, 2)`;
  return exeQuery(syntax, [
    param.description,
    param.status || "",
    param.path,
    param.header,
    param.level,
    param.icon || "",
    param.sort,
  ]);
};

export const findLatestMenu = (header: string) => {
  var whereHeader = "";
  if (header) {
    whereHeader = `WHERE id = ${header}`;
  }

  const syntax = `SELECT sort FROM menu ${whereHeader} ORDER BY sort DESC LIMIT 1`;
  return exeQuery(syntax, []);
};

export const getMenuId = (param: { sort: any }) => {
  const syntax = `SELECT id, sort FROM menu WHERE sort > $1`;
  return exeQuery(syntax, [param.sort]);
};

export const updateManySort = (stx: string) => {
  var syntax = `UPDATE menu SET sort = CASE id ${stx}`;
  return exeQuery(syntax, []);
};

export const findIdMenu = (param: IInsert) => {
  const syntax = `SELECT id FROM menu A WHERE A.description = $1`;
  return exeQuery(syntax, [param.description]);
};

export const deleteOne = (id: string) => {
  const syntax = `DELETE FROM menu WHERE id = $1 OR header = $2`;
  return exeQuery(syntax, [id, id]);
};

export const updateOne = async (param: IInsert) => {
  const syntax = `UPDATE menu SET description = $1, status = $2, path = $3, header = $4, 
    level = $5, icon = $6 WHERE description = $7`;
  const result = await exeQuery(syntax, [
    param.description,
    param.status || "",
    param.path,
    param.sub,
    param.level,
    param.icon ? param.icon : "",
    param.id || "",
  ]);

  return result;
};

export const startTransaction = () => {
  return exeQuery("START TRANSACTION", []);
};

export const commitTransaction = () => {
  return exeQuery("COMMIT", []);
};

export const rollback = () => {
  return exeQuery("ROLLBACK", []);
};
