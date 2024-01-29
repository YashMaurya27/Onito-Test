import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { GET, codeToTitle } from "../../../functions";
import {
  Autocomplete,
  Box,
  Button,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

interface StepTwoI {
  countries: string[];
}

export default function StepTwo(props: StepTwoI) {
  const [filteredCountries, setFilteredCountries] = useState([
    ...(props?.countries ?? []),
  ]);
  // const [countrySearch, setCountrySearch] = useState<string>();
  const addressDetailsSchema: any = yup.object().shape({
    address: yup.string(),
    state: yup.string(),
    city: yup.string(),
    country: yup
      .string()
      .oneOf(filteredCountries, "*Please select a valid country")
      .required("*Please select the country"),
    pincode: yup.string(),
  });

  const requiredFields = Object.keys(addressDetailsSchema.fields).filter(
    (fieldName) => {
      const fieldValidation = addressDetailsSchema.fields[fieldName];
      return (
        fieldValidation &&
        (fieldValidation.describe().optional === false ||
          fieldValidation
            .describe()
            .tests.some((test: any) => test.name === "required"))
      );
    }
  );

  const { control, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(addressDetailsSchema),
  });
  const { errors } = formState;

  const onSubmit = (e: any) => {
    console.log("submit", e);
  };

  // const searchHandler = (txt: string) => {
  //   clearTimeout(timeoutId);

  //   // Set a new timeout for 2000 milliseconds (2 seconds)
  //   const newTimeoutId = setTimeout(() => {
  //     // Implement your API call logic here
  //     console.log('Making API call with search term:', value);
  //   }, 2000);

  //   // Save the new timeout ID in the state
  //   setTimeoutId(newTimeoutId);
  //   GET(`name/${txt}`);
  // }

  const handleAutoComplete = (e: any) => {
    setValue('country', e.target.textContent);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {Object.keys(addressDetailsSchema.fields).map((fieldName) => {
          const fieldData = addressDetailsSchema.fields[fieldName];
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
                          <Box
                            sx={{
                              display: "flex",
                            }}
                          >
                            <Autocomplete
                              options={filteredCountries}
                              getOptionLabel={(option) => option}
                              sx={{
                                width:
                                  field["value"] && field["value"] != ""
                                    ? "80%"
                                    : "100%",
                              }}
                              renderInput={(params) => {
                                console.log('searchbar', params);
                                return (
                                <TextField
                                  {...params}
                                  onChange={(e) => {
                                    const txt = e.target.value;
                                    // searchHandler(txt);
                                  }}
                                  label="Choose a country"
                                  variant="outlined"
                                />
                              )}}
                              isOptionEqualToValue={(option, value) =>
                                option === value
                              }
                              {...field}
                              onChange={handleAutoComplete}
                            />
                            {field["value"] && field["value"] != "" && (
                              <IconButton
                                onClick={() => setValue(fieldName, "")}
                                edge="end"
                              >
                                <HighlightOffIcon />
                              </IconButton>
                            )}
                          </Box>
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
                          InputProps={{
                            endAdornment: (
                              <InputAdornment
                                position="end"
                                sx={{
                                  margin: "20px 0",
                                }}
                              >
                                {field["value"] && field["value"] != "" && (
                                  <IconButton
                                    onClick={() => setValue(fieldName, "")}
                                    edge="end"
                                  >
                                    <HighlightOffIcon />
                                  </IconButton>
                                )}
                              </InputAdornment>
                            ),
                          }}
                          {...field}
                          error={errors?.[fieldName] != undefined}
                          helperText={
                            errors?.[fieldName]?.message &&
                            `${errors?.[fieldName]?.message}`
                          }
                        />
                      )}
                    </Box>
                    {console.log("fieldData for", fieldName, fieldData, field)}
                    {console.log("errors", errors)}
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
            Next
          </Button>
        </Box>
      </form>
    </>
  );
}
