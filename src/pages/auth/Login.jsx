import { useAuth } from "../../provider/Authentication";
import {BearerAuth, FormContainerStyle, FormMemberStyle, FormSumbitStyle} from '../../components/Helpers';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import axios from 'axios';
import { APIEndpoint } from "../../components/Helpers";
function Login() {
  // React States
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);  
  const { setTokens } = useAuth();
  const navigate = useNavigate();

  const errors = {
    uname: "invalid username",
    pass: "invalid password"
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    var { uname, pass } = document.forms[0];
    const userData = {
        userName: uname.value,
        password: pass.value
    };
    try {
        const response = await axios.post(APIEndpoint + "/login", userData);
        setTokens(response.data.accessToken, response.data.refreshToken);
        navigate("/home", { replace: true });
    } catch (error) {
        console.log(error);
        setErrorMessages({ name: "uname", message: "Incorrect user name or password" });
    }
  };

  // Generate JSX code for error message
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  // JSX code for login form
  const renderForm = (
    <div>
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Username </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="uname" required />
          {renderErrorMessage("uname")}
        </div>
        <div className="input-container">
          <label>Password </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" name="pass" required />
          {renderErrorMessage("pass")}
        </div>
        <div>
          <input className="bg-blue-500 hover:bg-blue-700 mt-2 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" value="Sign In" />
        </div>
      </form>
    </div>
  );

  return (
    <div>
      <div className="max-w-xs mx-auto pt-10">
        <div className="text-xl text-center p-1 ">Login</div>
        {isSubmitted ? <div>User is successfully logged in</div> : renderForm}
      </div>
    </div>
  );
}

export default Login;