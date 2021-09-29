import React, { useState, useEffect } from "react";
import avatarimg from "assets/images/avatar.jpg";
import { Avatar } from "@material-ui/core";

export const ProfilePic = props => {
  const [state, setState] = useState({ url: avatarimg });

  useEffect(() => {
    async function getUrl(id) {
      if (id) {
        props.getFile(id).then(res => {
          //console.log(resumeUpload);
          if (res.status) {
            const { url } = res.result;
            setState({
              ...state,
              url
            });
          }
        });
      } else {
        setState({
          ...state,
          url: avatarimg
        });
      }
    }

    getUrl(props.id);
  }, [props.id]);

  return (
    <Avatar
      alt="Avatar"
      src={state.url}
      className={props.className}
      style={props.style}
    />
  );
};
