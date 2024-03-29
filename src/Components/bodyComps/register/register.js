import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Formik, Field, Form, ErrorMessage } from "formik";

import { userSchema } from "../../../Validations/Registration/validateRegistration";
import { useHistory } from "react-router-dom";

import Aux from "../../../hoc/aux";
import classes from "./register.module.css";
import * as Mui from "@material-ui/core";

const Register = () => {
  const [userExists, setUserExists] = useState("");
  const [emailExists, setEmailExists] = useState("");

  let history = useHistory();

  return (
    <Aux>
      <Formik
        initialValues={{
          Email: "",
          Username: "",
          Password: "",
          confirmPassword: "",
        }}
        validationSchema={userSchema}
        onSubmit={(fields) => {
          fetch(process.env.REACT_APP_URL + "/checkRegisterDetails", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(fields),
          }).then((res) => {
            console.log(res.status);
            if (res.status === 200) {
              fetch(process.env.REACT_APP_URL + "/register", {
                method: "POST",
                headers: {
                  "Content-type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(fields),
              }).then((res) => {
                if (res.status === 200) {
                  res.json().then((data) => {
                    setUserExists("");
                    setEmailExists("");
                    history.push("/");
                    history.go(0);
                  });
                }
              });
            } else if (res.status === 400) {
              return res.json().then((problem) => {
                setUserExists(problem.errors[0].msg);
              });
            } else if (res.status === 409) {
              return res
                .json()
                .then((data) => {
                  console.log(data);
                  if (data.email && data.user) {
                    setEmailExists(data.email);
                    setUserExists(data.user);
                  } else if (data.email) {
                    setEmailExists(data.email);
                    setUserExists("");
                  } else if (data.user) {
                    setUserExists(data.user);
                    setEmailExists("");
                  } else {
                    return null;
                  }
                })
                .catch((error) => console.log(error));
            }
          });
        }}
      >
        <Form className={classes.Display}>
          <Field
            name="Email"
            type="text"
            placeholder="Email"
            className={classes.inputRegister}
            onKeyUp={() => setEmailExists("")}
          />
          <p className={classes.errorMessage}>{emailExists}</p>
          <ErrorMessage
            name="Email"
            component="p"
            className={classes.errorMessage}
          />
          <Field
            name="Username"
            type="text"
            placeholder="Username"
            className={classes.inputRegister}
            onKeyUp={() => setUserExists("")}
          />
          <p className={classes.errorMessage}>{userExists}</p>
          <ErrorMessage
            name="Username"
            component="p"
            className={classes.errorMessage}
          />
          <Field
            name="Password"
            type="password"
            placeholder="Password"
            className={classes.inputRegister}
          />
          <ErrorMessage
            name="Password"
            component="p"
            className={classes.errorMessage}
          />
          <Field
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            className={classes.inputRegister}
          />
          <ErrorMessage
            name="confirmPassword"
            component="p"
            className={classes.errorMessage}
          />
          <Mui.Button
            style={{ fontFamily: "DotGothic16", fontSize: "1em" }}
            variant="contained"
            color="default"
            size="medium"
            type="submit"
          >
            Register
          </Mui.Button>
          <div style={{ borderTop: "dotted white", width: "100%" }}></div>
          <Mui.Button
            style={{ fontFamily: "DotGothic16", fontSize: "1em" }}
            variant="contained"
            color="default"
            size="medium"
            component={Link}
            to="/"
          >
            Main Menu
          </Mui.Button>
        </Form>
      </Formik>
    </Aux>
  );
};

export default Register;
