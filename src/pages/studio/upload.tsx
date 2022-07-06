import * as React from "react";
import axios from "axios";
import {
  MantineProvider,
  AppShell,
  Box,
  Title,
  Group,
  TextInput,
  Container,
  Card,
  RingProgress,
  Textarea,
  Button,
} from "@mantine/core";
import { jsx, css } from "@emotion/react";
import { useCookies } from "react-cookie";
import { Badge } from "../../components/Badge";

const UploadPage = () => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [cookies, setCookie] = useCookies(["token"]);
  const [username, setUsername] = React.useState<string>("");
  const [userdata, setUserdata] = React.useState<any>({});
  const [video, chooseVideo]: any | any = React.useState(null);
  const [videoName, setVideoName] = React.useState<string>("");
  const [videoDescription, setVideoDescription] = React.useState<string>("");
  const [videoUploaded, toggleVideoUploaded]: [
    boolean | any,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = React.useState(false);
  const [videoUrl, setVurl]: [
    string | any,
    React.Dispatch<React.SetStateAction<string>>
  ] = React.useState("");
  const [error, setError]: [
    boolean | any,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = React.useState(false);
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
  const percentage = (partialValue: number, totalValue: number) => {
    return (100 * partialValue) / totalValue;
  };
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
      setVurl(resp.data.vurl);
      toggleVideoUploaded(true);
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };
  const videoDeploy = async () => {
    try {
      const resp = await axios({
        url: "https://api.huelet.net/videos/deploy/item",
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
        data: {
          vurl: videoUrl,
          title: videoName,
          description: videoDescription,
          private: false,
          authorId: userdata.uid,
        },
      });
      console.log(resp);
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
          <Box className={videoUploaded ? "hidden" : ""}>
            <Title>Upload</Title>
            <p className="text-standard--p">Uploading as {username}</p>
            <input
              type="file"
              name="file"
              id="file"
              accept="video/*"
              onChange={handleVideoSelectionChange}
            />
            <Group position="left" mt="md">
              <div
                onClick={fileSelect}
                css={css`
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  background: linear-gradient(
                    90deg,
                    var(--color-primary) 0%,
                    rgba(150, 0, 255, 1) 100%
                  );
                  border-radius: 12px;
                  border: 0;
                  box-sizing: border-box;
                  color: #eee;
                  padding: 1em;
                  cursor: pointer;
                  margin-top: 38px;
                  outline: 0;
                `}
              >
                <p
                  className="text-standard--p"
                  css={css`
                    font-size: 18px;
                  `}
                >
                  Upload
                </p>
              </div>
            </Group>
          </Box>
          <Box className={videoUploaded ? "" : "hidden"}>
            <Group>
              <Container>
                <div
                  css={css`
                    display: flex;
                    justify-content: center;
                    align-items: end;
                    flex-direction: row;
                  `}
                >
                  <TextInput
                    placeholder="Less than 80 characters"
                    label="Video Title"
                    value={videoName}
                    onChange={(e) => setVideoName(e.target.value)}
                    required
                    error={
                      videoName.length > 80 ? "Video title is too long" : false
                    }
                  />
                  <RingProgress
                    size={30}
                    thickness={4}
                    sections={[
                      {
                        color: `${
                          videoName.length < 80 ? "#7600ff" : "#ff0000"
                        }`,
                        value: percentage(videoName.length, 80),
                      },
                    ]}
                  />
                </div>
                <div
                  css={css`
                    display: flex;
                    justify-content: center;
                    align-items: end;
                    flex-direction: row;
                  `}
                >
                  <Textarea
                    placeholder="What's this video about?"
                    label="Description"
                    variant="filled"
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                    error={
                      videoDescription.length > 2048
                        ? "Video description is too long"
                        : false ||
                          videoDescription.includes("https") ||
                          videoDescription.includes("http")
                        ? "Add links in the links section"
                        : false
                    }
                  />
                  <RingProgress
                    size={30}
                    thickness={4}
                    sections={[
                      {
                        color: `${
                          videoDescription.length < 2048 ? "#7600ff" : "#ff0000"
                        }`,
                        value: percentage(videoDescription.length, 2048),
                      },
                    ]}
                  />
                </div>
                <div
                  css={css`
                    padding: 1em;
                  `}
                ></div>
                <div
                  css={css`
                    display: flex;
                    justify-content: center;
                    align-items: end;
                  `}
                >
                  <Button
                    variant="outline"
                    color="violet"
                    size="lg"
                    onClick={videoDeploy}
                  >
                    Deploy
                  </Button>
                </div>
              </Container>
              <Container>
                <Card>
                  <h2 className="text-big--h2">{videoName}</h2>
                  <p className="text-standard--p">{videoDescription}</p>
                  <video
                    src={videoUrl}
                    muted={true}
                    autoPlay={true}
                    controls={false}
                    loop={true}
                    width={`${window.innerWidth * 0.4}px`}
                    height={`${window.innerHeight * 0.4}px`}
                  ></video>
                </Card>
              </Container>
            </Group>
          </Box>
        </AppShell>
      </MantineProvider>
    </div>
  );
};

export default UploadPage;
