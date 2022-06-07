import React from "react";
import { css, jsx } from "@emotion/react";
import { Avatar } from "@mantine/core";

export interface BadgeProps {
  children?: React.ReactNode;
  chonky: boolean;
  username: string;
}

export const Badge = ({ children, chonky, username }: BadgeProps) => {
  const [pfp, setPfp] = React.useState<string>("");
  const [bio, setBio] = React.useState<string>("");
  const [location, setLocation] = React.useState<string>("");
  const [pronouns, setPronouns]: any = React.useState([]);
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
      fetch(`https://api.huelet.net/auth/bio?username=${username}`);
      fetch(`https://api.huelet.net/auth/location?username=${username}`);
    }
  };
  getUserData();
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
      <Avatar src={pfp} alt={"hi"} radius={"xl"} size={"lg"} />
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
          {pronouns.join("/")}
        </span>
      </div>
      {children}
    </div>
  );
};
