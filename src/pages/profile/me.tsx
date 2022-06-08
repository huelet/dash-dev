import * as React from "react";
import { css, jsx } from "@emotion/react";
import { MantineProvider, AppShell, Tabs, Box, Title } from "@mantine/core";
import { Avatar, Bell, Video } from "@fdn-ui/icons-react";
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
        <AppShell padding="md">
          <Tabs color={"violet"}>
            <Tabs.Tab label="Profile" icon={<Avatar fill={"white"} />}>
              <Box>
                <Title>Profile</Title>
                <Box>
                  
                </Box>

              </Box>
            </Tabs.Tab>
            <Tabs.Tab
              label="Your Videos"
              icon={<Video fill={"white"} />}
            ></Tabs.Tab>
            <Tabs.Tab
              label="Your Earnings"
              icon={<Bell fill={"white"} />}
            ></Tabs.Tab>
          </Tabs>
        </AppShell>
      </MantineProvider>
    </div>
  );
};

export default ProfilePage;