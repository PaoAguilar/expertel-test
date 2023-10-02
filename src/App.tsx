import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Grid } from "@mui/material";
import { useFormik } from "formik";

export interface IFields {
  name: string;
  label: string;
  columns: number;
  required: boolean;
}

function App() {
  const [fields, setFields] = useState<any>([]);
  console.log("fields", fields);

  const formik = useFormik<any>({
    initialValues: fields.reduce((acc: any, field: any) => {
      acc[field.name] = ""; // Inicializar los valores del formulario basado en los campos obtenidos
      return acc;
    }, {}),
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://devtest.juancg.ca/form/");
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        const data = await response.json();
        setFields(data);
        formik.resetForm({
          values: data.reduce((acc: any, field: any) => {
            acc[field.name] = "";
            return acc;
          }, {}),
        });
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      }
    };
    fetchData();
  }, []);

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: "20px" }}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          {fields.map((field: IFields) => (
            <Grid item xs={field.columns} key={field.name}>
              <TextField
                fullWidth
                name={field.name}
                label={field.label}
                value={formik.values[field.name]}
                onChange={formik.handleChange}
                error={
                  formik.touched[field.name] &&
                  Boolean(formik.errors[field.name])
                }
                // helperText={
                //   formik.touched[field.name] && formik.errors[field.name]
                // }
              />
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 3 }}>
          <Button type="submit" fullWidth variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </form>
    </Container>
  );
}

export default App;
