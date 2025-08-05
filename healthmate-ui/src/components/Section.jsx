import React from "react";
import { Box, Typography, Divider, List, ListItem, ListItemText } from "@mui/material";

const Section = ({ title, items, content, fallback }) => (
  <Box sx={{ mt: 0.5 }}>
    <Typography variant="subtitle1" color="text.secondary">
      {title}
    </Typography>
    <Divider sx={{ my: 0.5 }} />
    {items ? (
      <List dense disablePadding>
        {items.length > 0 ? (
          items.map((item, i) => (
            <ListItem key={i} sx={{ pl: 2, py: 0.5 }}>
              <ListItemText primary={`• ${item}`} primaryTypographyProps={{ variant: "body2" }} />
            </ListItem>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
            {fallback || "None."}
          </Typography>
        )}
      </List>
    ) : (
      <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
        {content || "No additional information available."}
      </Typography>
    )}
  </Box>
);

export default Section;
