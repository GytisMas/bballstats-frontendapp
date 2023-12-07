import { useAuth } from "../../provider/Authentication";
import {BearerAuth, UserRoles} from '../../components/Helpers';
import { useNavigate } from "react-router-dom";
import {FormContainerStyle, FormMemberStyle, FormSumbitStyle} from '../../components/Helpers';
import { useState, useEffect } from 'react';
import axios from 'axios';

function ChangePassword() {
  const { accessToken } = useAuth();
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);  
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    var { oldpass, newpass } = document.forms[0];

    const userData = {
        oldpassword: oldpass.value,
        newpassword: newpass.value
    };
    try {
        const response = await axios.post("http://localhost:5142/api/changePassword/", userData
        , {headers: {
            Authorization: BearerAuth(accessToken)
          }}
        );
        navigate("/profile", { replace: true });
    } catch (error) {
        console.log(error);
        // setErrorMessages({ name: "uname", message: "Incorrect user name or password" });
    }
  };

  // Generate JSX code for error message
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  // JSX code for login form
  const renderForm = (
    <div className={FormContainerStyle}>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Old Password</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" name="oldpass" required />
        </div>
        <div className="input-container">
          <label>New Password</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" name="newpass" required />
        </div>
        <div className={FormSumbitStyle}>
          <input className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" />
        </div>
      </form>
    </div>
  );

  return (
    <div className="app">
      <div className="login-form">
        {isSubmitted ? <div>Submitted</div> : renderForm}
      </div>
    </div>
  );
}

export default ChangePassword;