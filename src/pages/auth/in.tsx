import * as React from "react";
import { css, jsx } from "@emotion/react";
import {
  TextInput,
  PasswordInput,
  Group,
  Box,
  MantineProvider,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCookies } from "react-cookie";

const LoginPage = () => {
  const [cookies, setCookie] = useCookies(["token"]);
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
  });
  const validate = (values: typeof form.values) => {
    fetch("https://api.huelet.net/auth/in?creator=true", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.token) {
          setCookie("token", res.token, { path: "/" });
          location.assign("/profile/me");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div id="root">
      <MantineProvider theme={{ colorScheme: "dark" }}>
        <div
          css={css`
            width: 100%;
            height: 100%;

            display: flex;
            align-items: center;
          `}
        >
          <Box sx={{ maxWidth: 300 }} mx="auto">
            <form onSubmit={form.onSubmit(validate)}>
              <TextInput
                required
                label="Email"
                placeholder="you@probablygmail.com"
                {...form.getInputProps("email")}
              />
              <PasswordInput
                required
                label="Password"
                placeholder={"34569238e6038c3f52911b851f3501be"}
                {...form.getInputProps("password")}
              />

              <Group position="right" mt="md">
                <button
                  type="submit"
                  css={css`
                    background: linear-gradient(
                      90deg,
                      var(--color-primary) 0%,
                      rgba(150, 0, 255, 1) 100%
                    );
                    border-radius: 12px;
                    border: 0;
                    box-sizing: border-box;
                    color: #eee;
                    cursor: pointer;
                    font-size: 18px;
                    height: 50px;
                    margin-top: 38px;
                    outline: 0;
                    text-align: center;
                    width: 100%;
                  `}
                >
                  Login
                </button>
              </Group>
            </form>
          </Box>
        </div>
      </MantineProvider>
    </div>
  );
};

export default LoginPage;
