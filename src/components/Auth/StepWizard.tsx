import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { AddressDetailsI, PersonalDetailsI } from "./types";
import StepOne from "./steps/StepOne";
import StepTwo from "./steps/StepTwo";
import { useEffect, useState } from "react";
import { GET } from "../../functions";

const steps = ["Personal Details", "Address Details"];

interface StepWizardI {
  formData: Array<PersonalDetailsI | AddressDetailsI> | undefined;
}

export default function StepWizard(props: StepWizardI) {
  const [activeStep, setActiveStep] = useState(0);
  const [countries, setCountries] = useState<string[]>([]);
  const [completed, setCompleted] = useState<{
    [k: number]: boolean;
  }>({});
  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep = activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const renderStep = (step: number) => {
    switch (step) {
      case 0:
        return <StepOne handleNext={handleNext} />;
      case 1:
        return <StepTwo countries={countries} />;
      default:
        return <StepOne handleNext={handleNext} />;
    }
  };

  useEffect(() => {
    GET("all").then((res: any) => {
      if (res["success"]) {
        const countryNames = res?.['data'].map((item: any) => {
          return item?.['name']?.['common'] ?? 'N/A';
        })
        setCountries(countryNames ?? []);
      }
    });
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton color="inherit">{label}</StepButton>
          </Step>
        ))}
      </Stepper>
      <div>
        {allStepsCompleted() ? (
          <>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </>
        ) : (
          <>
            <Box
              sx={{
                width: {
                  xs: "90%",
                  sm: "90%",
                  md: "80%",
                  lg: "60%",
                },
                margin: "10px auto",
                boxShadow:
                  "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
                padding: "20px 30px",
              }}
            >
              {renderStep(activeStep)}
            </Box>
          </>
        )}
      </div>
    </Box>
  );
}
