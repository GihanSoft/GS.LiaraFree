import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import api from "../../../shared/api";
import StartCardWidget from "./widgets/StartCardWidget";

interface Dto {
  totalMembers: {
    value: string;
    // trend?: {
    //   value: string;
    //   direction: "up" | "down" | "neutral";
    //   label?: string;
    // };
  };
  members: [{ userName: string; email: string }];
}

const AdminDashboardPage: React.FC = () => {
  const [dto, setDto] = useState<Dto>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const statCardSize = { xs: 12, sm: 6, md: 3 };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api("/api/admin/dashboard");
        if (!res.ok) throw new Error("Failed to load dashboard");

        setDto(await res.json());
      } catch (err) {
        console.error(err);
        setError("Could not load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading)
    return (
      <Grid container spacing={2} marginBlock={2}>
        <Grid size={statCardSize}>
          <Skeleton
            variant="rectangular"
            height={120}
            sx={{ borderRadius: 2 }}
          />
        </Grid>
        <Grid size={statCardSize}>
          <Skeleton
            variant="rectangular"
            height={120}
            sx={{ borderRadius: 2 }}
          />
        </Grid>
        <Grid size={statCardSize}>
          <Skeleton
            variant="rectangular"
            height={120}
            sx={{ borderRadius: 2 }}
          />
        </Grid>
        <Grid size={statCardSize}>
          <Skeleton
            variant="rectangular"
            height={120}
            sx={{ borderRadius: 2 }}
          />
        </Grid>
      </Grid>
    );

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Grid container spacing={2} marginBlock={2}>
      <Grid size={{ xs: 12, sm: 4, md: 3 }}>
        <StartCardWidget
          title="Total Members"
          value={dto!.totalMembers.value}
          // trend={dto?.totalMembers.trend}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 8, md: 9 }}>
        <DataGrid
          columns={[
            { field: "userName", headerName: "UserName", flex: 1 },
            { field: "email", headerName: "Email", flex: 1 },
          ]}
          rows={dto?.members}
        />
      </Grid>
    </Grid>
  );
};

export default AdminDashboardPage;
