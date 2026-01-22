import { faAt, faCircleCheck, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useAuth } from "../AuthProvider";

const MePage = () => {
  const auth = useAuth();
  return (
    <Box flex="auto" display="flex" justifyContent="center" alignItems="center">
      <Card
        variant="outlined"
        sx={(theme) => ({
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing(3),
          padding: theme.spacing(4),
          width: "100%",
          [theme.breakpoints.up("sm")]: {
            maxWidth: "450px",
          },
          boxShadow:
            "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
        })}
      >
        <List>
          <ListItem>
            <ListItemIcon>
              <FontAwesomeIcon icon={faUser} size="xl" />
            </ListItemIcon>
            <ListItemText
              primary="Username"
              secondary={
                <Typography color="info" component="span">
                  {auth.user?.email}
                </Typography>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <FontAwesomeIcon icon={faAt} size="xl" />
            </ListItemIcon>
            <ListItemText>
              <ListItemText
                slotProps={{ secondary: { component: "div" } }}
                primary="Email"
                secondary={
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography color="info" component="span">
                      {auth.user?.email}
                    </Typography>
                    <Stack
                      direction="row"
                      alignItems="center"
                      border={1}
                      borderColor={(theme) => theme.palette.success.main}
                      color={(theme) => theme.palette.success.main}
                      borderRadius={100000}
                      paddingInline={1}
                    >
                      <FontAwesomeIcon icon={faCircleCheck} />
                      <span className="text-box-trim">Verified</span>
                    </Stack>
                  </Stack>
                }
              />
            </ListItemText>
          </ListItem>
        </List>
      </Card>
    </Box>
  );
};

export default MePage;
