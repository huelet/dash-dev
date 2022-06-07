import * as React from "react";
import { css, jsx } from "@emotion/react";
import { MantineProvider } from "@mantine/core";
import { useCookies } from "react-cookie";
import { Badge } from "../../components/Badge";

const ProfilePage = () => {
  const [cookies, setCookie] = useCookies(["token"]);
  const [username, setUsername] = React.useState<string>("");

  fetch("https://api.huelet.net/auth/token", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookies.token}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      setUsername(res.username);
    });
  return (
    <div id="root">
      <MantineProvider theme={{ colorScheme: "dark" }}>
        <Badge chonky={true} username={username} />
      </MantineProvider>
    </div>
  );
};

export default ProfilePage;
