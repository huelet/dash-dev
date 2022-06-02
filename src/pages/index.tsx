import * as React from "react";
import { css, jsx } from "@emotion/react";

const IndexPage = () => {
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
