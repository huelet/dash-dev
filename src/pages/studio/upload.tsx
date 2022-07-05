import * as React from "react";
import axios from "axios";
import {
  MantineProvider,
  AppShell,
  Box,
  Title,
  Group,
  Text,
} from "@mantine/core";
import { useCookies } from "react-cookie";
import { Badge } from "../../components/Badge";

const UploadPage = () => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [cookies, setCookie] = useCookies(["token"]);
  const [username, setUsername] = React.useState<string>("");
  const [video, chooseVideo]: any | any = React.useState(null);
  const [error, setError]: [
    boolean | any,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = React.useState(false);
  React.useEffect(() => {
    const getToken = () => {
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
      setLoading(false);
    };
    const getUserData = () => {
      fetch(`https://api.huelet.net/auth/user?username=${username}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        });
      setLoading(false);
    };
    if (loading === true) {
      getToken();
      getUserData();
    } else {
      null;
    }
  }, []);
  const handleVideoSelectionChange = (event: any) => {
    chooseVideo(event.target.files[0]);
  };
  const fileSelect = async (event: any) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", video);
    try {
      const resp = await axios({
        url: "https://api.huelet.net/videos/upload/item",
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
      console.log(resp.data);
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };
  return (
    <div id="root">
      <MantineProvider theme={{ colorScheme: "dark" }}>
        <Badge chonky={true} username={username} />
        <AppShell padding="md">
          <Box>
            <Title>Upload</Title>
            <input
              type="file"
              name="file"
              id="file"
              onChange={handleVideoSelectionChange}
            />
            <div onClick={fileSelect}>uplaod</div>
          </Box>
        </AppShell>
      </MantineProvider>
    </div>
  );
};

export default UploadPage;
