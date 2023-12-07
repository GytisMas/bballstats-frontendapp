import { useParams } from "react-router-dom";
import { useAuth } from "../../provider/Authentication";
import {BearerAuth, UserRoles} from '../../components/Helpers';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { roles } from "../../components/PlayerRoles";
import axios from 'axios';
import {FormContainerStyle, FormMemberStyle, FormSumbitStyle} from '../../components/Helpers';

function UserUpdate() {
  let params = useParams();
  const { accessToken } = useAuth();
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);  
  const [user, setUser] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = (await axios.get('http://localhost:5142/api/users/'+params.userId));
        setUser(response.data);
        let roleNum = 1;
        let rolesToAdd = 0;
        for (let i = 0; i < UserRoles.length; i++) {
          if (response.data.roles.includes(UserRoles[i])) {
            rolesToAdd += roleNum;
          }
          roleNum = roleNum * 2;
        }
        setUserRoles(rolesToAdd);
      } catch (error) {
          console.log(error);
      }
    }
    loadUser();
  }, []);

  const MakeItem = function(x, i) {
    return <option key={i} value={i}>{x}</option>;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    var { oldpass, newpass, email, roles } = document.forms[0];

    const userData = {
        oldpassword: oldpass.value,
        newpassword: newpass.value,
        email: email.value,
        role: Number(roles.value)
    };
    try {
        const response = await axios.put("http://localhost:5142/api/users/"+params.userId, userData
        , {headers: {
            Authorization: BearerAuth(accessToken)
          }}
        );
        navigate("/users", { replace: true });
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
        <div className="input-container">
          <label>Email</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="email" name="email" defaultValue={user.email} required />
        </div>
        <div className="input-container">
          <label>Roles (1-15)</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="number" min='1' max='15' name="roles" defaultValue={userRoles} required />
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

export default UserUpdate;