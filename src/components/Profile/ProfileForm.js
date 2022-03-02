import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import classes from "./ProfileForm.module.css";
import authContext from "../../store/auth.context";

const ProfileForm = () => {
  const history = useHistory();
  const authCtx = useContext(authContext);

  const [changePassword, setChangePassword] = useState("");
  const onChangeHandler = (e) => {
    setChangePassword(e.target.value);
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    const url =
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyB08UVprZUpR5gO2824IKn-OvGcPZPcpBA";
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        idToken: authCtx.token,
        password: changePassword,
        returnSecureToken: false,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    history.replace("/auth");
    console.log(data);
    console.log(authCtx);
  };
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          value={changePassword}
          onChange={onChangeHandler}
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
