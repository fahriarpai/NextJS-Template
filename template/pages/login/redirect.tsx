import { GetServerSideProps, NextApiRequest } from "next";
import { getMenu } from "../api/menu/list";
import { getLoginSession } from "../../lib/auth/auth";

const Redirect = () => {
  return <></>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // const session = await getSession({ req: ctx.req });
  const session = await getLoginSession(ctx.req as NextApiRequest);

  console.log("sess", session);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  interface IMenu {
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

  const menus = (await getMenu(session)) as IMenu[];

  console.log("menus", menus);

  var path = "";

  for (let index = 0; index < menus.length; index++) {
    const nextSub = menus[index + 1] ? menus[index + 1].sub : "";
    if (menus[index].sub == 0 && nextSub == 0) {
      path = `${menus[index].path}`;
      break;
    }

    if (
      menus[index].sub == 0 &&
      menus[index + 1].sub == menus[index].menu_header
    ) {
      path = `${menus[index + 1].path}`;
      break;
    }
  }

  return {
    redirect: {
      destination: path,
      permanent: false,
    },
  };
};

export default Redirect;
