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
  RingProgress,
  Textarea,
  Button,
} from "@mantine/core";
import { jsx, css } from "@emotion/react";
import { useCookies } from "react-cookie";
import { Card } from "@huelet/foundation-ui";
import { Play, Video, Upload, Add } from "@fdn-ui/icons-react";
import Loader from "../../components/Loader";

const isBrowser = typeof window !== "undefined";

const UploadPage = () => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [cookies, setCookie] = useCookies(["token"]);
  const [username, setUsername] = React.useState<string>("");
  const [userdata, setUserdata] = React.useState<any>({});
  const [videoName, setVideoName] = React.useState<string>("");
  const [videoDescription, setVideoDescription] = React.useState<string>("");
  const [videoUploaded, toggleVideoUploaded] = React.useState<any>(null);
  const [videoUrl, setVurl] = React.useState<string>("");
  const [links, setLinks] = React.useState<any[]>([]);
  const [linkError, setLinkError] = React.useState<string>("");
  const [error, setError] = React.useState<boolean>(false);
  const [videoPosted, setVideoPosted] = React.useState<boolean>(false);
  const [videoId, setVideoId] = React.useState<string>("");
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
  const handleThumbnail = async (event: any) => {
    event.preventDefault();
    if (!videoUploaded) {
      return;
    }
    const formData = new FormData();
    formData.append("file", videoUploaded);
    formData.append("id", videoId);
  };
  const handleVideoSelectionChange = async (event: any) => {
    event.preventDefault();
    toggleVideoUploaded(false);
    const video = event.target.files[0];
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
      setVideoPosted(true);
      setVideoId(resp.data.vuid);
      window.location.href = `/studio/upload-complete?vuid=${resp.data.vuid}`;
      console.log(resp);
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };
  return (
    <div id="root">
      <MantineProvider theme={{ colorScheme: "dark" }}>
        <AppShell padding="md">
          <Group>
            <Video fill="white" width={32} height={32} />
            <Title>Create</Title>
          </Group>
          <Box
            css={css({
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            })}
          >
            <Card
              css={css({
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                width: "25vw",
                height: "15em",
                marginTop: "1em",
              })}
            >
              <div
                css={css({
                  display: "flex",
                  backgroundColor: "rgba(128, 128, 128, 0.5)",
                  borderRadius: "50%",
                  padding: "2em",
                })}
              >
                <Upload fill="white" width={52} height={52} />
              </div>
              <div css={css({ display: "flex", flexDirection: "column" })}>
                <h2 className="text-big--h2">Upload Video</h2>
                <p className="text-standard--p">Uploading as {username}</p>
                <input
                  type="file"
                  name="videoFile"
                  id="videoFile"
                  accept="video/*"
                  onChange={handleVideoSelectionChange}
                  css={css({
                    display: "none",
                  })}
                />
                <label htmlFor="videoFile">
                  {videoUploaded === null ? (
                    <div
                      css={css`
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border: 1px solid #9775fa;
                        color: #9775fa;
                        height: 50px;
                        padding: 0 26px;
                        width: auto;
                        border-radius: 4px;
                        font-weight: 600;
                        font-size: 18px;
                        user-select: none;
                        cursor: pointer;
                      `}
                    >
                      <p className="text-standard--p">Select Video</p>
                    </div>
                  ) : <Loader /> || videoUploaded === false ? (
                    <Loader />
                  ) : (
                    <></>
                  )}
                </label>
              </div>
            </Card>
            <Card
              padding={0.1}
              css={css({
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: `${
                  videoUploaded
                    ? `${isBrowser ? window.innerWidth * 0.25 : 0}px`
                    : "25vw"
                }`,
                height: `${
                  videoUploaded
                    ? `${isBrowser ? window.innerWidth * 0.25 : 0}px`
                    : "15em"
                }`,
                marginTop: "1em",
              })}
            >
              <Container>
                <h2 className="text-big--h2">{videoName}</h2>
                <p className="text-standard--p">{videoDescription}</p>
                {videoUrl ? (
                  <video
                    src={videoUrl}
                    muted={true}
                    autoPlay={true}
                    controls={false}
                    loop={true}
                    width={`${isBrowser ? window.innerWidth * 0.2 : 15}px`}
                    height={`${isBrowser ? window.innerWidth * 0.2 : 15}px`}
                  ></video>
                ) : (
                  <div
                    css={css({
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    })}
                  >
                    <Play stroke="white" width={32} height={32} />
                    <h2 className="text-big--h2">Video Preview</h2>
                  </div>
                )}
              </Container>
            </Card>
          </Box>

          <Box
            css={css({
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            })}
          >
            <Box>
              <div
                css={css`
                  display: flex;
                  justify-content: center;
                  align-items: end;
                  flex-direction: row;
                  padding: 0.5em;
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
                      color: `${videoName.length < 80 ? "#7600ff" : "#ff0000"}`,
                      value: percentage(videoName.length, 80),
                    },
                  ]}
                />
              </div>
              <Card
                css={css({
                  width: "25vw",
                  height: "15em",
                  padding: "10em",
                })}
              >
                <input
                  type="file"
                  name="thumbnailImage"
                  id="thumbnailImage"
                  accept="image/*"
                  onChange={handleThumbnail}
                  css={css({
                    display: "none",
                  })}
                />
                <label htmlFor="videoFile">
                  <div
                    css={css`
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      text-align: center;
                      border: 1px solid #9775fa;
                      color: #9775fa;
                      height: 50px;
                      padding: 0 26px;
                      width: auto;
                      border-radius: 4px;
                      font-weight: 600;
                      font-size: 18px;
                      user-select: none;
                      cursor: pointer;
                    `}
                  >
                    <p className="text-standard--p">Select Thumbnail</p>
                  </div>
                </label>
                <p className="text-standard--p">
                  We strongly recomment you upload a thumbnail. Your thumbnail
                  must:
                  <table>
                    <thead>
                      <th>
                        <p className="text-standard--p">Format</p>
                      </th>
                      <th>
                        <p className="text-standard--p">Minimum dimensions</p>
                      </th>
                      <th>
                        <p className="text-standard--p">File size</p>
                      </th>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <p className="text-standard--p">JPEG</p>
                        </td>
                        <td>
                          <p className="text-standard--p">1920x780</p>
                        </td>
                        <td>
                          <p className="text-standard--p">Less than 8MBs</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="text-standard--p">PNG</p>
                        </td>
                        <td>
                          <p className="text-standard--p">1280x720</p>
                        </td>
                        <td>
                          <p className="text-standard--p">Less than 8MBs</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </p>
              </Card>
            </Box>
            <Box
              css={css({
                width: "25vw",
                height: "15em",
                padding: "10em",
              })}
            >
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
            </Box>
          </Box>

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
              Publish
            </Button>
          </div>
        </AppShell>
      </MantineProvider>
    </div>
  );
};

export default UploadPage;
