import { FormControl } from "@mui/base";
import { Button, TextField } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactElement, useCallback, useReducer } from "react";

interface ILogin {
  form: {
    username: string;
    password: string;
  };
  isLogin: boolean;
  isLoading: boolean;
}

let initialState = {
  form: {
    username: "",
    password: "",
  },
  isLogin: false,
  isLoading: false,
};

const Login = (props: any) => {
  const router = useRouter();
  const [states, setStates] = useReducer(
    (state: ILogin, newState: Partial<ILogin>) => ({ ...state, ...newState }),
    initialState
  );

  const login = useCallback(async (values: any): Promise<void> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.status === 200) {
        router.push("/login/redirect");
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("An unexpected error happened occurred:", error);
        alert(error.message);
      }
    }
  }, []);

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <FormControl>
        <div className="login-page">
          <TextField
            id="outlined-basic"
            name="username"
            label="Username"
            variant="outlined"
            value={states.form.username}
            onChange={(value: any) => {
              setStates({
                form: {
                  ...states.form,
                  username: value.target.value,
                },
              });
            }}
          />
          <TextField
            name="password"
            onChange={(value: any) => {
              setStates({
                form: {
                  ...states.form,
                  password: value.target.value,
                },
              });
            }}
            value={states.form.password}
            id="outlined-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
          />
          <Button variant="contained" onClick={() => login(states.form)}>
            Login
          </Button>
        </div>
      </FormControl>
    </>
  );
};

export default Login;

Login.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};
