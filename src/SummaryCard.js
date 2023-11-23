// SummaryCard.js
import React from "react";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import { AttachMoney, People } from "@mui/icons-material";

function SummaryCard({ title, value, icon }) {
  return (
    <Card>
      <CardContent>
        <IconButton>
          {icon === "attach_money" ? <AttachMoney /> : <People />}
        </IconButton>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h4">{value}</Typography>
      </CardContent>
    </Card>
  );
}

export default SummaryCard;
