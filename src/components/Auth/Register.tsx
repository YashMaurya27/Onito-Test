import React, { useState } from "react";
import StepWizard from "./StepWizard";
import { Box } from "@mui/material";
import { AddressDetailsI, PersonalDetailsI } from "./types";

export default function Register() {

  return (
    <section>
      <h1>Register</h1>
      <Box
        sx={{
          width: '95%',
          margin: "0 auto",
          maxWidth: '1440px',
        }}
      >
        <StepWizard />
      </Box>
    </section>
  );
}
