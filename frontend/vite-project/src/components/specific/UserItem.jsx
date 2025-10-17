import { Avatar, IconButton, ListItem, Typography, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useState } from "react";
import { useEffect } from "react";

function UserItem({ user, handler, handlerIsLoading, isAdded, styling }) {
  const { fullName, _id, profile } = user;
  const [profileImg, setProfileIMg] = useState("");

  useEffect(() => {
    if (typeof profile == "object") {
      setProfileIMg(profile.url);
    } else {
      setProfileIMg(profile);
    }
  }, [profile]);

  return (
    <ListItem>
      <Stack
        direction={"row"}
        spacing={"2rem"}
        width={"100%"}
        alignItems={"center"}
        {...styling}
      >
        <Avatar src={profileImg} />

        <Typography
          variant="body1"
          sx={{
            flexGlow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
          }}
        >
          {fullName}
        </Typography>

        <IconButton
          size="small"
          sx={{
            bgcolor: isAdded ? "error.main" : "primary.main",
            color: "white",
            "&:hover": {
              bgcolor: isAdded ? "error.main" : "primary.dark",
            },
          }}
          onClick={() => handler(_id)}
          disabled={handlerIsLoading}
        >
          {isAdded ? <RemoveIcon /> : <AddIcon />}
        </IconButton>
      </Stack>
    </ListItem>
  );
}

export default UserItem;
