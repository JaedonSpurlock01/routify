import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import React from "react";

export const Progress = ({ name, bytesLoaded, percentage, loading }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      {!loading && (
        <div className="w-[10rem] mb-2">
          <Box
            sx={{
              width: "100%",
            }}
          >
            <LinearProgress
              value={percentage}
              variant="determinate"
              sx={{
                borderRadius: 10,
                [`&.${linearProgressClasses.colorPrimary}`]: {
                  backgroundColor: "#737373",
                },
                [`& .${linearProgressClasses.bar}`]: {
                  borderRadius: 10,
                  backgroundColor: "#ffffff",
                },
              }}
            />
          </Box>
        </div>
      )}
      <p className="text-neutral-200">Currently loading {name}</p>
      {!loading && (
        <p className="text-neutral-500 text-xs">
          Loaded {bytesLoaded ? bytesLoaded.toLocaleString("en-us") : 0} bytes
        </p>
      )}
      {loading && (
        <p className="text-neutral-500 text-xs flex flex-row">
          Connecting to OpenStreetMap...
        </p>
      )}
    </div>
  );
};
