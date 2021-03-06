import React, { useEffect } from "react";
import { css, jsx } from "@emotion/react";
import { Avatar } from "@mantine/core";

export interface BadgeProps {
  children?: React.ReactNode;
  chonky: boolean;
  username: string;
}

export const Badge = ({ children, chonky, username }: BadgeProps) => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [pfp, setPfp] = React.useState<string>("");
  const [bio, setBio] = React.useState<string>("");
  const [location, setLocation] = React.useState<string>("");
  const [pronouns, setPronouns]: any = React.useState([]);
  React.useEffect(() => {
    const getUserData = () => {
      if (username) {
        fetch(`https://api.huelet.net/auth/pfp?username=${username}`)
          .then((res) => res.json())
          .then((data) => {
            setPfp(data.pfp);
          });
        fetch(`https://api.huelet.net/auth/pronouns?username=${username}`)
          .then((res) => res.json())
          .then((data) => {
            setPronouns(data.pronouns);
          });
        fetch(`https://api.huelet.net/auth/bio?username=${username}`)
          .then((res) => res.json())
          .then((data) => {
            setBio(data.bio);
          });
        fetch(`https://api.huelet.net/auth/location?username=${username}`)
          .then((res) => res.json())
          .then((data) => {
            setLocation(data.location);
          });
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    if (loading === true) {
      getUserData();
    } else {
      null;
    }
  }, []);
  return (
    <div
      css={css`
        width: ${chonky ? "30em" : "2em"};
        height: ${chonky ? "15em" : "2em"};
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #181718;
        border-radius: 3px;
        padding: 0.5rem;
        margin: 0.5rem;
      `}
    >
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Avatar src={pfp} alt={"hi"} radius={"xl"} size={"lg"} />
      )}
      <div
        css={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-left: 0.5rem;
        `}
      >
        <span
          css={css`
            font-family: var(--font-primary);
            font-size: 2rem;
            font-weight: bold;
          `}
        >
          {username}
        </span>
        <span
          css={css`
            display: flex;
            flex-direction: column;
            font-family: var(--font-primary);
            font-size: 1.5rem;
            font-weight: bold;
          `}
        >
          {loading ? <div>loading</div> : pronouns.join("/")}
        </span>
      </div>
      {children}
    </div>
  );
};
