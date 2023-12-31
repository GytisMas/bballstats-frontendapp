import { useParams } from "react-router-dom";
import { useAuth } from "../../provider/Authentication";
import {FormContainerStyle, FormMemberStyle, FormSumbitStyle} from '../../components/Helpers';
import {BearerAuth} from '../../components/Helpers';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { roles } from "../../components/PlayerRoles";
import axios from 'axios';
import { APIEndpoint } from "../../components/Helpers";

function PlayerStatsUpdate(props) {
  let params = useParams();
  const { accessToken } = useAuth();
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);  
  const [playerStat, setPlayerStat] = useState([]);
  const [selectedStatType, setSelectedStatType] = useState(0);
  const [statistics, setStatistics] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPlayer = async () => {
      try {
        const response = (await axios.get(APIEndpoint + '/statistics/'));        
        // setFormulaMembers(formulaMembers => [...formulaMembers, 's'+(formulaMembers.length+1)]);
        for (let i = 0; i < response.data.length; i++) {
          let m = response.data[i]
          if (m.status != 0 && !statistics.includes(m)) {
            setStatistics(statistics => [...statistics, m]);
          }
        }
        const response2 = (await axios.get(APIEndpoint + '/teams/'+params.teamId+'/players/'+params.playerId+'/playerStatistics/'+params.statId));
        setPlayerStat(response2.data);
        setSelectedStatType(response2.data.statisticId)
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

  const MakeItem = function(x, i) {
    return <option key={i} value={i}>{x}</option>;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    var { statType, value } = document.forms[0];
    const playerData = {
        statisticId: Number(statType.value),
        value: Number(value.value)
    };
    try {
        const response = await axios.put(APIEndpoint + "/teams/"+params.teamId+'/players/'+params.playerId+'/playerStatistics/'+params.statId, playerData
        , {headers: {
            Authorization: BearerAuth(accessToken)
          }}
        );
        navigate("/public/players", { replace: true });
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
          <label>Statistic type</label>
          <select className={FormMemberStyle} name="statType" defaultValue = {selectedStatType}>
            {statistics.map((statistic, i) => (MakeItem(statistic.displayName, statistic.id)))}
          </select>
        </div>
        <div className="input-container">
          <label>Value</label>
          <input className={FormMemberStyle} type="number" step="0.01" name="value" defaultValue={playerStat.value} required />
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

export default PlayerStatsUpdate;