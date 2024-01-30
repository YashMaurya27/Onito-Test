import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { AddressDetailsI, PersonalDetailsI } from "./types";
import StepOne from "./steps/StepOne";
import StepTwo from "./steps/StepTwo";
import { useEffect, useMemo, useRef, useState } from "react";
import { GET, codeToTitle } from "../../functions";
import DataTable from 'datatables.net-dt';
// import 'datatables.net-responsive-dt';
import { useSelector } from "react-redux";
import './index.css';

const steps = ["Personal Details", "Address Details"];

export default function StepWizard() {
  const [activeStep, setActiveStep] = useState(0);
  const [countries, setCountries] = useState<string[]>([]);
  const [completed, setCompleted] = useState<{
    [k: number]: boolean;
  }>({});
  const registeredUsers = useSelector((state: any) => state?.users ?? []);
  const handleNext = () => {
    const newActiveStep = activeStep + 1;
    setActiveStep(newActiveStep);
  };
  const tableInit = useRef(false);
  const tableFields = ['name', 'age', 'sex', 'mobile', 'govtIdType', 'govtId', 'address', 'state', 'city', 'country', 'pincode'];

  // const handleReset = () => {
  //   setActiveStep(0);
  //   setCompleted({});
  // };

  const renderStep = (step: number) => {
    switch (step) {
      case 0:
        return <StepOne handleNext={handleNext} />;
      case 1:
        return <StepTwo countries={countries} handleNext={handleNext} />;
      default:
        return <StepOne handleNext={handleNext} />;
    }
  };

  let table: any;

  useEffect(() => {
    GET("all").then((res: any) => {
      if (res["success"]) {
        const countryNames = res?.['data'].map((item: any) => {
          return item?.['name']?.['common'] ?? 'N/A';
        })
        setCountries(countryNames ?? []);
      }
    });
    function handleResize() {
      table?.columns.adjust().responsive.recalc();
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    }
  }, []);

  const handleResize = () => {

  }

  useEffect(() => {
    if (tableInit.current === false && registeredUsers.length > 0) {
      table = new DataTable('#usersTable', {
        // responsive: true,
        // autoWidth: true
      });
      tableInit.current = true;
    }
  }, [registeredUsers]);

  useEffect(() => {
    if (activeStep === steps.length) {
      setActiveStep(0);
    }
  }, [activeStep]);

  return (
    // <Box>
    <>
      <Stepper
        sx={{
          width: '90%',
          margin: '10px auto'
        }}
        nonLinear
        activeStep={activeStep}
      >
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton color="inherit">{label}</StepButton>
          </Step>
        ))}
      </Stepper>
      <div>
        {(
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
                padding: "10px 0px",
                boxSizing: 'border-box'
              }}
            >
              {renderStep(activeStep)}
            </Box>
          </>
        )}
      </div>

      {registeredUsers.length > 0 && (
        <div className="table-container">
          <Typography fontSize={22} fontWeight={'bold'}>
            Registered Users
          </Typography>
          <hr />
          <div className="table-div">
            <table id="usersTable">
              <thead>
                <tr>
                  {tableFields.map((field) => {
                    return (
                      <th>
                        {codeToTitle(field)}
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {registeredUsers.map((user: any) => {
                  return (
                    <tr>
                      {tableFields.map((property) => {
                        return (
                          <td>{user?.[property] || 'N/A'}</td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
