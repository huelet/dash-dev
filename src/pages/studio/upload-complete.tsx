import * as React from "react";
import { MantineProvider, AppShell } from "@mantine/core";
import { jsx, css } from "@emotion/react";
import { Card, Link } from "@huelet/foundation-ui";
import { Share } from "@fdn-ui/icons-react";

const UploadCompletePage = () => {
  const [url, setUrl] = React.useState<any>(null);
  const [vuid, setVuid] = React.useState<string>("");
  React.useEffect(() => {
    const parsedUrl = new URL(window.location.href);
    setUrl(parsedUrl);
    setVuid(parsedUrl.searchParams.get("vuid") as string);
  }, []);
  return (
    <div id="root">
      <MantineProvider theme={{ colorScheme: "dark" }}>
        <Card full={true} title={"Upload Complete!"}>
          <Link to={`https://huelet.net/w/${vuid}`}>
            <h2
              className="text-big--h2"
              css={css({
                textDecoration: "underline rgb(0, 125, 179) !important",
              })}
            >
              See your video here
            </h2>
          </Link>
          <p className="text-standard--p">
            Your video has been uploaded successfully. It can now be viewed by
            everyone on the internet. Share it!
          </p>
          <div
            css={css({
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
              width: "100%",
            })}
          >
            <div
              css={css({
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(128, 128, 128, 0.5)",
                borderRadius: "50%",
                padding: "2em",
                cursor: "pointer",
              })}
              onClick={() => {
                navigator.clipboard.writeText(
                  `https://amp.huelet.net/redir?vuid=${vuid}&src=copy`
                );
              }}
            >
              <Share fill="white" width={52} height={52} />
            </div>
            <a
              href={`https://twitter.com/intent/tweet?original_referer=${encodeURIComponent(
                url?.origin
              )}&related=TeamHuelet&text=Watch%20my%20new%20video!&url=${encodeURIComponent(
                `https://amp.huelet.net/redir?vuid=${vuid}&src=twitter`
              )}&via=TeamHuelet`}
            >
              <div
                css={css({
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#1D9BF0",
                  borderRadius: "50%",
                  padding: "2em",
                })}
              >
                <svg
                  width={52}
                  height={52}
                  fill={"white"}
                  viewBox="0 0 248 204"
                >
                  <g>
                    <path d="M221.95,51.29c0.15,2.17,0.15,4.34,0.15,6.53c0,66.73-50.8,143.69-143.69,143.69v-0.04   C50.97,201.51,24.1,193.65,1,178.83c3.99,0.48,8,0.72,12.02,0.73c22.74,0.02,44.83-7.61,62.72-21.66   c-21.61-0.41-40.56-14.5-47.18-35.07c7.57,1.46,15.37,1.16,22.8-0.87C27.8,117.2,10.85,96.5,10.85,72.46c0-0.22,0-0.43,0-0.64   c7.02,3.91,14.88,6.08,22.92,6.32C11.58,63.31,4.74,33.79,18.14,10.71c25.64,31.55,63.47,50.73,104.08,52.76   c-4.07-17.54,1.49-35.92,14.61-48.25c20.34-19.12,52.33-18.14,71.45,2.19c11.31-2.23,22.15-6.38,32.07-12.26   c-3.77,11.69-11.66,21.62-22.2,27.93c10.01-1.18,19.79-3.86,29-7.95C240.37,35.29,231.83,44.14,221.95,51.29z" />
                  </g>
                </svg>
              </div>
            </a>
          </div>
        </Card>
      </MantineProvider>
    </div>
  );
};

export default UploadCompletePage;
