import { useAuth } from "../../provider/Authentication";
import {BearerAuth, FormMemberStyle} from '../../components/Helpers';
import {FormContainerStyle, FormSumbitStyle} from '../../components/Helpers';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode'
import { useState, useEffect } from 'react';
import { roles } from "../../components/PlayerRoles";
import axios from 'axios';
import { APIEndpoint } from "../../components/Helpers";

function AlgorithmCreate() {
  const { accessToken } = useAuth();
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);  
  const [statTypes, setStatTypes] = useState([]);
  const [formulaMembers, setFormulaMembers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadStatTypes = async () => {
        const response = (await axios.get(APIEndpoint + '/statistics/v'));
        setStatTypes(response.data);
    }
    loadStatTypes();
  }, []);

  const errors = {
    uname: "invalid username",
    pass: "invalid password"
  };

  const MakeItem = function(x, i) {
    return <option key={i} value={i}>{x}</option>;
  }

  const MakeFormulaMember = (i) => {
    <div className="input-container">
      <label>Stat {i}</label>
      <select className={FormMemberStyle} name={"s"+i} defaultValue = {statTypes[0]}>
        {statTypes.map((stat, i) => (MakeItem(stat.name, stat.id)))}
      </select>
    </div>
  }

  const handleAdd = (event) => {
    event.preventDefault();
    setFormulaMembers(formulaMembers => [...formulaMembers, 's'+(formulaMembers.length+1)]);
  }

  const handleRemove = (event) => {
    event.preventDefault();    
    setFormulaMembers((formulaMembers) => (formulaMembers.slice(0, -1)));
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const promoted = false;
    let formula = "(";
    for (let i = 0; i < event.target.elements.length-2; i++) {
      formula += event.target.elements[i].value;
      if (i + 1 < event.target.elements.length-2)
        formula += " "
    }
    formula += ')';
    formula += ' (';
    formula += event.target.formula.value;
    formula += ')';

    const algoData = {
        formula: formula,
        promoted: false
    };
    try {
        const response = await axios.post(APIEndpoint + "/users/"+jwtDecode(accessToken).sub+'/ratingAlgorithms/', algoData
        , {headers: {
            Authorization: BearerAuth(accessToken)
          }}
        );
        navigate("/profile", { replace: true });
    } catch (error) {
        console.log(error);
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
      <div className='flex flex-row w-full pb-1 justify-evenly'>
        <div className={FormSumbitStyle + ' min-h-max min-w-max max-w-max flex items-center justify-center w-1/3'}>
          <button onClick={handleAdd}>Add stat</button>
        </div>
        <div className={FormSumbitStyle + ' min-h-max flex items-center justify-center w-1/3'}>
          <button onClick={handleRemove}>Remove last stat</button>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        {formulaMembers.map((fm) => (
          <div key={fm} style={{display: 'flex'}}>
            <select className={FormMemberStyle} name={fm}>
              {statTypes.map((stat, i) => (MakeItem(stat.displayName, stat.id)))}
            </select>
            <p>Variable name: {fm}</p>
          </div>          
        ))}

        <div className="input-container">
          <label>Formula</label><br/>
          <textarea className={FormMemberStyle} name="formula" rows="4" cols="50" required />
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

export default AlgorithmCreate;