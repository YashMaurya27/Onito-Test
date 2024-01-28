import React from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import "../index.css";
import { codeToTitle } from "../../../functions";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

export default function StepOne() {
  const personalDetailsSchema: any = yup.object().shape({
    name: yup
      .string()
      .min(3, "*Name must have atleast 3 characters")
      .required("*Please enter your name"),
    age: yup
      .number()
      .integer("*Please enter a valid age")
      .typeError("*Please enter a valid age")
      .positive("*Age must be a positive age")
      .min(1, "*Please enter a valid age")
      .max(100, "*Please enter a valid age")
      .required("*Please enter your age"),
    sex: yup
      .string()
      .oneOf(["male", "female"], "Enter a valid sex")
      .required("*Please enter your sex"),
    mobile: yup
      .string()
      .matches(/^[6-9]\d{9}$/, "*Please enter a valid Indian mobile number")
      .min(10, "*Mobile number must be at least 10 digits")
      .max(10, "*Mobile number must not exceed 10 digits"),
    govtIdType: yup
      .string()
      .oneOf(["Aadhar", "PAN"], "*Please enter a valid government ID type"),
    govtId: yup.string().test("govtId", "Invalid ID", function (value) {
      const govtIdType = this.resolve(yup.ref("govtIdType"));

      if (govtIdType === "Aadhar") {
        return yup
          .string()
          .matches(
            /^[2-9]\d{11}$/,
            "Invalid Aadhar ID. Must be a 12-digit number and shouldn't start with 0 or 1"
          )
          .isValidSync(value);
      } else if (govtIdType === "PAN") {
        return yup
          .string()
          .matches(
            /^[A-Za-z0-9]{10}$/,
            "Invalid PAN ID. Must be a 10 digit alphnumeric ID."
          )
          .isValidSync(value);
      }

      return true; // If govtIdType is neither Aadhar nor PAN, no additional validation
    }),
  });

  const addressDetailsSchema = yup.object().shape({
    address: yup.string(),
    state: yup.string(),
    city: yup.string(),
    country: yup.string(),
    pincode: yup.string(),
  });

  const { control, handleSubmit, formState } = useForm({
    resolver: yupResolver(personalDetailsSchema),
  });
  const { errors } = formState;

  const onSubmit = (e: any) => {
    alert("submit");
    console.log("submit", e);
  };

  const requiredFields = Object.keys(personalDetailsSchema.fields).filter(
    (fieldName) => {
      const fieldValidation = personalDetailsSchema.fields[fieldName];
      return (
        fieldValidation &&
        (fieldValidation.describe().optional === false ||
          fieldValidation
            .describe()
            .tests.some((test: any) => test.name === "required"))
      );
    }
  );

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {Object.keys(personalDetailsSchema.fields).map((fieldName) => {
          const fieldData = personalDetailsSchema.fields[fieldName];
          return (
            <div key={fieldName}>
              <Controller
                name={fieldName}
                control={control}
                render={({ field }) => (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        margin: "20px 0",
                      }}
                    >
                      <InputLabel id={fieldName + "label"}>
                        {codeToTitle(fieldName)}{" "}
                        {requiredFields.includes(fieldName) && (
                          <span
                            style={{
                              color: "red",
                            }}
                          >
                            *
                          </span>
                        )}
                      </InputLabel>
                      {fieldData["_whitelist"].size > 0 ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "50%",
                          }}
                        >
                          <Select
                            labelId={fieldName + "label"}
                            error={errors?.[fieldName] != undefined}
                            {...field}
                          >
                            {Array.from(fieldData?.["_whitelist"]).map(
                              (item) => {
                                return (
                                  <MenuItem
                                    value={`${item}`}
                                  >{`${item}`}</MenuItem>
                                );
                              }
                            )}
                          </Select>
                          {errors?.[fieldName]?.message && (
                            <FormHelperText
                              sx={{
                                color: "#d32f2f",
                              }}
                            >
                              {`${errors?.[fieldName]?.message}`}
                            </FormHelperText>
                          )}
                        </Box>
                      ) : (
                        <TextField
                          id={fieldName}
                          label={"Enter " + fieldName}
                          variant="standard"
                          sx={{
                            width: "50%",
                          }}
                          type={
                            fieldData?.["type"] === "number" ? "number" : "text"
                          }
                          {...field}
                          error={errors?.[fieldName] != undefined}
                          helperText={
                            errors?.[fieldName]?.message &&
                            `${errors?.[fieldName]?.message}`
                          }
                        />
                      )}
                    </Box>
                  </>
                )}
              />
            </div>
          );
        })}
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
          }}
        >
          <Button
            type="submit"
            color="primary"
            endIcon={<KeyboardDoubleArrowRightIcon />}
          >
            Proceed
          </Button>
        </Box>
      </form>
    </>
  );
}
