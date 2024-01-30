import React, { useState } from "react";
import StepWizard from "./StepWizard";
import { Box, Typography } from "@mui/material";
import { AddressDetailsI, PersonalDetailsI } from "./types";

export default function Register() {

  return (
    <section>
      <Typography fontSize={24} fontWeight={'bolder'} margin={'20px 0'}>
        Onito Test
      </Typography>
      <Box
        sx={{
          width: {
            // xs: '350px',
            sm: '95%'
          },
          margin: "auto",
          maxWidth: '1440px',
        }}
      >
        <StepWizard />
      </Box>
    </section>
  );
}
