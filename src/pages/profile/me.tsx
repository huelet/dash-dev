import * as React from "react";
import { MantineProvider, AppShell, Tabs, Box, Title } from "@mantine/core";
import { Avatar, Bell, Check, Close, Upload, Video } from "@fdn-ui/icons-react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Badge } from "../../components/Badge";
import UploadPage from "../studio/upload";
import { Card } from "@huelet/foundation-ui";
import { StaticImage } from "gatsby-plugin-image";

const ProfilePage = () => {
  const [cookies, setCookie] = useCookies(["token"]);
  const [username, setUsername] = React.useState<string>("");
  const [userdata, setUserdata] = React.useState<any>({});
  React.useEffect(() => {
    axios
      .get(`https://api.huelet.net/auth/token`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res: any) => {
        setUsername(res.data.username);
      });
    if (username) {
      axios
        .get(`https://api.huelet.net/auth/user`, {
          params: {
            username: username,
          },
        })
        .then((res: any) => {
          setUserdata(res.data.data);
        });
    } else {
      setUserdata({});
    }
  }, []);
  return (
    <div id="root">
      <MantineProvider theme={{ colorScheme: "dark" }}>
        <Badge chonky={true} username={username} />
        <AppShell padding="md">
          <Tabs color={"violet"}>
            <Tabs.Tab label="Profile" icon={<Avatar fill={"white"} />}>
              <Box>
                <Title>{username}</Title>
                <Box>
                  <p className="text-standard--p">
                    {userdata.pronouns ? (
                      <p>
                        Pronouns: {userdata.pronouns.join("/")}
                        <br />
                        Verified:{" "}
                        {userdata.approved ? (
                          <Check fill={"green"} />
                        ) : (
                          <Close fill={"red"} />
                        )}
                      </p>
                    ) : (
                      <p>
                        Verified:{" "}
                        {userdata.approved ? (
                          <Check fill={"green"} />
                        ) : (
                          <Close fill={"red"} />
                        )}
                      </p>
                    )}
                  </p>
                </Box>
              </Box>
            </Tabs.Tab>
            <Tabs.Tab label="Upload" icon={<Upload fill={"white"} />}>
              <UploadPage />
            </Tabs.Tab>
            <Tabs.Tab
              label="Your Videos"
              icon={<Video fill={"white"} />}
            ></Tabs.Tab>
            <Tabs.Tab label="Your Earnings" icon={<Bell fill={"white"} />}>
              <Card padding={18} full={false}>
                <StaticImage
                  src="https://cdn.huelet.net/assets/logo.png"
                  alt="Huelet logo"
                  width={256}
                  height={256}
                />
                <h2 className="text-big--h2">
                  This feature is currently unavailable. Please check back
                  later.
                </h2>
              </Card>
            </Tabs.Tab>
          </Tabs>
        </AppShell>
      </MantineProvider>
    </div>
  );
};

export default ProfilePage;
