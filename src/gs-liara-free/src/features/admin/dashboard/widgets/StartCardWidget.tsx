import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";

export interface StatCardProps {
  title: string;
  value: string;
  // icon?
  // trend?: {
  //   value: string;
  //   direction: "up" | "down" | "neutral";
  //   label?: string;
  // };

  // color?
  // link?
  // tooltip?
  // chartData[]?
}

const StartCardWidget = (props: StatCardProps) => {
  const theme = useTheme();
  // const trend = props.trend;
  // const trendColor =
  //   trend?.direction === "up"
  //     ? theme.palette.success.main
  //     : trend?.direction === "down"
  //     ? theme.palette.error.main
  //     : theme.palette.text.secondary;
  // const trendIcon =
  //   trend?.direction === "up"
  //     ? faArrowTrendUp
  //     : trend?.direction === "down"
  //     ? faArrowTrendDown
  //     : faArrowRight;
  return (
    <Card
      elevation={2}
      sx={{
        height: "100%",
        borderRadius: 2,
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardContent
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Typography
          component="h3"
          variant="body1"
          color={theme.palette.text.secondary}
        >
          {props.title}
        </Typography>
        <Typography
          variant="h3"
          component="span"
          flexGrow="1"
          alignContent="center"
        >
          {props.value}
        </Typography>

        {/* {props.trend && (
          <Stack direction="row" sx={{ color: trendColor }} alignItems="center">
            <FontAwesomeIcon icon={trendIcon} />
            <Typography flexGrow="1" lineHeight={1} paddingTop="3px">
              {props.trend.value}
            </Typography>
            {props.trend.label && (
              <Typography color={theme.palette.text.secondary}>
                {props.trend.label}
              </Typography>
            )}
          </Stack>
        )} */}
      </CardContent>
    </Card>
  );
};

export default StartCardWidget;
