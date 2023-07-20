// import * as crypto from "crypto";
// import { getSession } from "next-auth/react";
import { exeQuery } from "./db";
import { compare, hash } from "bcryptjs";
const saltOrRounds = 10;

export async function verifyPwrd(
  password: string | undefined,
  hshPassword: string
) {
  const isValid = await compare(password ? password : "", hshPassword);
  return isValid;
}

export const sortMenu = async (menu: any) => {
  let a = [];
  let tempHeader = null;
  let tempHeaderIndex = 0;
  let tempLevel = 0;
  let tempData = [];
  let pushCount: any = null;

  for (let index = 0; index < menu.length; index++) {
    const menu_header = menu[index].menu_header;
    const level = parseInt(menu[index].level);
    const sub = menu[index].sub;

    if (tempHeader != menu_header && tempHeader != sub) {
      tempHeader = menu_header;
      tempLevel = level;
      tempData = [];
      tempHeaderIndex = pushCount == null ? 0 : pushCount + 1;

      if (sub == 0) {
        a.push(menu[index]);
        pushCount = pushCount == null ? 0 : pushCount + 1;
      }
    }

    if (tempHeader == sub) {
      tempData.push(menu[index]);
    }

    if (
      (tempHeader != menu_header && tempHeader != null) ||
      index == menu.length - 1
    ) {
      Object.assign(a[pushCount], { [`subMenu${tempLevel + 1}`]: tempData });
    }
  }

  return a;
};

export const pageCheck = async (username: string, path: string) => {
  // const sessionDec = JSON.parse(await cryptoDecrypt(session.user));
  // const path = page.substring(1)

  // const syntax = `SELECT A.id menu_header, A.description menu, A.path, A.level, A.header sub, B.m_insert, B.m_update, B.m_delete, B.m_view
  // FROM menu A,
  //     access_det B,
  //     access C,
  //     users D
  // WHERE A.id = B.menuId
  //     AND B.accessId = C.id
  //     AND C.id = D.accessId
  //     AND D.username = $1 AND A.path = $2 AND B.m_view = 1`

  const syntax = `SELECT A.id, A.id menu_header, A.description menu, A.path, A.level, A.header sub, B.m_insert, B.m_update, B.m_delete, B.m_view
  FROM menu A,
      access_det B,
      "access" C,
      "user" D
  WHERE A.id = B."menuId"  
      AND B."accessId" = C.id
      AND C.id = D."accessId" 
        AND D.username = $1 AND A.path = $2 AND B.m_view = 1`;

  const result: any = await exeQuery(syntax, [username, path]);

  if (result.length < 1) {
    return [];
  }

  return result;
};

export const pagination = async (
  page: number,
  row: number,
  totalRow: number
) => {
  const dataPerPage = row;
  const totalPage = Math.ceil(totalRow / dataPerPage);
  const currentPage = page == 0 ? 1 : page;
  const firstData = dataPerPage * currentPage - dataPerPage;

  return {
    query: `LIMIT ${firstData},${dataPerPage}`,
    dataPerPage: dataPerPage,
    totalPage: totalPage,
    currentPage: currentPage,
    totalData: totalRow,
  };
};

export const formatNumber = (number: number) => {
  if (number === undefined || number === null) {
    return null;
  } else {
    //   return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    let nf = new Intl.NumberFormat("en-US");
    return nf.format(number);
  }
};

export const hashPassword = async (string: string | undefined) => {
  const hashPassword = await hash(string ? string : "", saltOrRounds);
  return hashPassword;
};
