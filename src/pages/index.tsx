import * as React from "react";
import { css, jsx } from "@emotion/react";
import { useCookies } from "react-cookie";

const IndexPage = () => {
  const [cookies, setCookie] = useCookies(["token"]);
  fetch("https://api.huelet.net/auth/token", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookies.token}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.response === "Success!") {
        location.assign("/profile/me");
      }
    });
  return (
    <div id="root">
      <h2 className="text-big--h2">
        if youre here, there's a good chance that you're looking for the{" "}
        <a href="/auth/in">login page</a>. if you're not, you're probably in the
        wrong place.
      </h2>
    </div>
  );
};

export default IndexPage;
