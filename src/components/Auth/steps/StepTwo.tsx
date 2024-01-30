import React, { useEffect, useRef, useState } from "react";
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
  TextField,
} from "@mui/material";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useDispatch } from "react-redux";

interface StepTwoI {
  countries: string[];
  handleNext: () => void;
}

export default function StepTwo(props: StepTwoI) {
  const [filteredCountries, setFilteredCountries] = useState([
    ...(props?.countries ?? []),
  ]);
  const [countrySearch, setCountrySearch] = useState<string>();
  const [countryLoad, setCountryLoad] = useState(false);
  const isFirstRender = useRef<boolean>(true);
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
  const dispatch = useDispatch();

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
    let stepOneData: any = sessionStorage.getItem("step_one_data");
    stepOneData = JSON.parse(stepOneData || '');
    dispatch({
      type: 'ADD_USER',
      payload: {
        ...stepOneData,
        ...e
      }
    });
    props.handleNext();
  };

  const handleAutoComplete = (e: any, val: any) => {
    setValue('country', e.target.textContent || val);
  };

  const fetchSearchedCountries = (name: string) => {
    GET(`name/${name}`, {}, true)
      .then((res) => {
        if (res['success']) {
          const countryNames = res?.['data'].map((item: any) => {
            return item?.['name']?.['common'] ?? 'N/A';
          });
          setFilteredCountries(countryNames);
          setCountryLoad(false);
        }
      })
  };

  const countryError = (fieldName: string, field: any) => {
    return errors?.[fieldName] !== undefined &&
      (
        field?.['value'] === undefined ||
        field['value'] === '' ||
        field['value'] === null
      )
  }

  useEffect(() => {
    if (isFirstRender.current === false && countrySearch) {
      setCountryLoad(true);
      const myTimeout = setTimeout(() => {
        if (countrySearch !== '') {
          fetchSearchedCountries(countrySearch);
        } else {
          setFilteredCountries(props.countries);
          setCountryLoad(false);
        }
      }, 1500)
      return () => {
        clearTimeout(myTimeout)
      }
    }
    isFirstRender.current = false;
  }, [countrySearch]);

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
                        display: {
                          xs: "block",
                          sm: "flex",
                          md: "flex"
                        },
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: '95%',
                        margin: "20px auto",
                      }}
                    >
                      <InputLabel
                        sx={{
                          textAlign: 'start',
                          width: {
                            xs: '100%',
                            sm: "50%",
                            md: '50%'
                          },
                        }}
                        id={fieldName + "label"}
                      >
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
                            width: {
                              xs: '100%',
                              sm: "50%",
                              md: '50%'
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: 'start'
                            }}
                          >
                            <Autocomplete
                              options={countryLoad === true ? [] : filteredCountries}
                              getOptionLabel={(option) => option}
                              fullWidth
                              loading={countryLoad}
                              loadingText={'Please wait..'}
                              renderInput={(params) => {
                                return (
                                  <TextField
                                    {...params}
                                    value={countrySearch}
                                    onChange={(e) => {
                                      const txt = e.target.value;
                                      setCountrySearch(txt);
                                    }}
                                    error={
                                      countryError(fieldName, field)
                                    }
                                    label="Choose a country"
                                    variant="outlined"
                                    onKeyDown={(event) => {
                                      if (event.key === 'Enter') {
                                        event.preventDefault();
                                      }
                                    }}
                                  />
                                )
                              }}
                              isOptionEqualToValue={(option, value) =>
                                option === value
                              }
                              {...field}
                              onChange={handleAutoComplete}
                            />
                          </Box>
                          {countryError(fieldName, field) && (
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
                            width: {
                              xs: '100%',
                              sm: "50%",
                              md: '50%'
                            },
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
                                {field["value"] && field["value"] !== "" && (
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
                          error={errors?.[fieldName] !== undefined}
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
            width: '95%',
            margin: "auto",
            padding: '10px 0'
          }}
        >
          <Button
            type="submit"
            color="primary"
            endIcon={<KeyboardDoubleArrowRightIcon />}
          >
            Submit
          </Button>
        </Box>
      </form>
    </>
  );
}
