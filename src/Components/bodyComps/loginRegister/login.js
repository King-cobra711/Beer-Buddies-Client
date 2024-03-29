import React, { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Link } from "react-router-dom";

import Aux from "../../../hoc/aux";
import classes from "./login.module.css";
import * as Mui from "@material-ui/core";
import { useHistory } from "react-router-dom";

const Login = () => {
  let history = useHistory();
  const [loginMessage, setLoginMessage] = useState("");

  return (
    <Aux>
      <Formik
        initialValues={{
          Username: "",
          Password: "",
        }}
        onSubmit={(fields) => {
          fetch(process.env.REACT_APP_URL + "/login", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(fields),
          })
            .then((res) => {
              if (res.status === 200) {
                res.json().then((data) => {
                  history.push("/");
                  history.go(0);
                });
              } else if (res.status === 406 || res.status === 404) {
                return res.json().then((data) => {
                  setLoginMessage(data.message);
                });
              } else {
                return null;
              }
            })
            .catch((error) => console.log(error));
        }}
      >
        <Form className={classes.Display}>
          <Field
            name="Username"
            type="text"
            placeholder="Username"
            className={classes.inputLogin}
            onKeyUp={() => setLoginMessage("")}
          />
          <Field
            name="Password"
            type="password"
            placeholder="Password"
            className={classes.inputLogin}
            onKeyUp={() => setLoginMessage("")}
          />
          <p className={classes.errorMessage}>{loginMessage}</p>
          <Mui.Button
            style={{ fontFamily: "DotGothic16", fontSize: "1em" }}
            variant="contained"
            color="default"
            size="medium"
            type="submit"
          >
            LOGIN
          </Mui.Button>
          <Mui.Button
            style={{ fontFamily: "DotGothic16", fontSize: "1em" }}
            variant="contained"
            color="default"
            size="medium"
            type="submit"
            component={Link}
            to="/register"
          >
            REGISTER
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

export default Login;
