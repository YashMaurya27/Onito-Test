import React, { useState } from "react";
import StepWizard from "./StepWizard";
import { Box } from "@mui/material";
import { AddressDetailsI, PersonalDetailsI } from "./types";

export default function Register() {
  const [formData, setFormData] =
    useState<Array<PersonalDetailsI | AddressDetailsI>>();

  return (
    <div>
      <h1>Register</h1>
      <Box
        sx={{
          width: {
            xs: "100%",
            sm: "100%",
            md: "90%",
            lg: "90%",
          },
          margin: "auto",
        }}
      >
        <StepWizard formData={formData} />
      </Box>
    </div>
  );
}
