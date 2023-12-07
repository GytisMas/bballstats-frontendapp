import { useParams } from "react-router-dom";
import { useAuth } from "../../provider/Authentication";
import {BearerAuth, FormContainerStyle, FormMemberStyle, FormSumbitStyle} from '../../components/Helpers';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';

function StatisticUpdate() {
  let params = useParams();
  const { accessToken } = useAuth();
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);  
  const [statType, setStatType] = useState([]);  
  const [statVisibility, setStatVisibility] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPlayer = async () => {
      try {
        const response = (await axios.get('http://localhost:5142/api/statistics/'+params.statId));
        setStatType(response.data);
        setStatVisibility(response.data.status)
      } catch (error) {
          console.log(error);
      }
    }
    loadPlayer();
  }, []);

  const errors = {
    uname: "invalid username",
    pass: "invalid password"
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    var { dname, sname, visibility } = document.forms[0];
    const statData = {
        displayName: dname.value,
        name: sname.value,
        status: Number(visibility.value)
    };

    try {
        const response = await axios.put("http://localhost:5142/api/statistics/"+params.statId, statData
        , {headers: {
            Authorization: BearerAuth(accessToken)
          }}
        );
        navigate("/stats", { replace: true });
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
          <label>Display name</label>
          <input className={FormMemberStyle} type="text" name="dname" defaultValue={statType.displayName} required />
        </div>
        <div className="input-container">
          <label>Short name</label>
          <input className={FormMemberStyle} type="text" name="sname" defaultValue={statType.name} required />
        </div>
        <div className="input-container">
          <label>Visibility status</label>
            <select className={FormMemberStyle} defaultValue={statVisibility} name='visibility'>
              <option key={1} value={1}>Visible</option>
              <option key={0} value={0}>Not visible</option>
            </select>
        </div>
        <input className={FormSumbitStyle} type="submit" />
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

export default StatisticUpdate;