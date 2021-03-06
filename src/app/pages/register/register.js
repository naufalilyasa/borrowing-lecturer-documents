import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
// import { server } from "../../utils";

const useStyles = makeStyles((theme) => ({
  layout: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "768px",
    margin: "0 auto",
  },
  paper: {
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(8),
      padding: `${theme.spacing(6)}px ${theme.spacing(4)}px`,
    },
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

const Register = () => {
  const classes = useStyles({});
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    ni: "",
    telp: "",
    address: "",
    email: "",
    password: "",
  });

  const [submitting] = React.useState(false);
  // React.useEffect();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      firstName,
      lastName,
      ni,
      telp,
      address,
      email,
      password,
      confirmPassword,
    } = formData;

    const userData = {
      firstName,
      lastName,
      ni,
      telp,
      address,
      email,
      password,
      confirmPassword,
    };

    // const { success, data } = await server.postAsync("/auth/register", {
    //   userData,
    // });
    // if (success) {
    //   window.location.replace(data);
    //   return;
    // }
    // try {
    const response = await axios({
      // proxy: {
      //   host: "localhost",
      //   port: 5000,
      // },
      baseURL: `${process.env.REACT_APP_BASE_API_URL}`,
      url: `/auth/register`,
      method: "POST",
      withCredentials: true,
      headers: { "Content-type": "application/json" },
      responseType: "json",
      data: JSON.stringify(userData),
    });
    const { success, data } = await response.data;
    if (success) {
      window.location.replace(data);
      return;
    }
    // } catch (err) {
    //   console.error(err);
    // }
  };

  return (
    <main className={classes.layout}>
      <Paper className={classes.paper} elevation={2}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Register
          </Typography>
        </Box>
        <form
          method="POST"
          className={classes.form}
          noValidate
          onSubmit={handleSubmit}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            autoComplete="fname"
            autoFocus
            defaultValue={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="lname"
            defaultValue={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="ni"
            label="NI M/P"
            name="ni"
            autoComplete="ni"
            defaultValue={formData.ni}
            onChange={(e) => setFormData({ ...formData, ni: e.target.value })}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="telp"
            label="Phone Number"
            name="telp"
            autoComplete="telp"
            defaultValue={formData.telp}
            onChange={(e) => setFormData({ ...formData, telp: e.target.value })}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            multiline
            rows={4}
            id="address"
            label="Address"
            name="address"
            autoComplete="address"
            defaultValue={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            defaultValue={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="password"
            defaultValue={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="confirmpassword"
            defaultValue={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
          />
          <Box mb={6}>
            <Button
              disabled={submitting}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {submitting && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
              {submitting ? "Registering..." : "Register"}
            </Button>
          </Box>
        </form>
      </Paper>
    </main>
  );
};

export default Register;
