import { useAuth } from "../../provider/Authentication";
import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode'
import axios from 'axios';
import AlgorithmGet from "./AlgorithmGet";
import { BearerAuth } from "../../components/Helpers";
export default function UserGet(props) {
  let params = useParams();
  const { accessToken } = useAuth();
  const [user, setUser] = useState([]);
  const [algorithms, setAlgorithms] = useState([]);
  const [statTypes, setStatTypes] = useState([]);
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();


  const handleRemoveItem = (id) => {
    setAlgorithms(algorithms.filter(item => item.id !== id));
  };

  useEffect(() => {
    const loadUserData = async () => {
      if (params.userId && accessToken && params.userId == jwtDecode(accessToken).sub) {
        navigate("/profile", { replace: true });
      }
      let userIdLocal = "";
      if (props.userId)
        userIdLocal = props.userId;
      else if (params.userId)
        userIdLocal = params.userId;
      setUserId(userIdLocal);
      const userResponse = await axios.get('http://localhost:5142/api/users/' + userIdLocal);
      setUser(userResponse.data);
      if (props.noAlgorithms)
        return;
      const algoResponse = await axios.get('http://localhost:5142/api/users/' + userIdLocal + '/ratingAlgorithms/');
      setAlgorithms(algoResponse.data.sort(function(a, b){return a.id - b.id}));
      const statResponse = 
        Object.fromEntries((await axios.get('http://localhost:5142/api/statistics/'))
        .data.sort(function(a, b){return a.id - b.id})
        .map((stat) => [stat.id, stat.displayName]));
      setStatTypes(statResponse);
    }
    loadUserData();
  }, []);


  if (props.noAlgorithms)
    return user.username;
  else
  return (
    <div>
      <div className="flex flex-row mt-5 max-w-xl mx-auto px-2 items-center justify-evenly bg-white border-2 rounded-3xl">
        <div className="p-5 my-auto">
          <img className="w-48" src={process.env.PUBLIC_URL + '/icons/user-avatar-svgrepo-com.svg'}/>
        </div>
        <div className='flex flex-col'>
          <p>User name: {user.username}</p>
          {props.personal && 
          <div className="flex flex-col">
            <p>Email: {user.email}</p>
            <a href='/changePassword' className='btn p-1 bg-red-300 border-2 border-black'>Change password</a>
            <a href='/algorithm/create' className='btn p-1 bg-amber-300 border-2 border-black'>Create new algorithm</a>
          </div>}
        </div>
      </div>
      <div className="flex flex-row flex-wrap mt-5 max-w-6xl mx-auto px-2 pb-10 bg-white border-2 rounded-3xl">
        {algorithms.map((algo, i) => (
          <div key={algo.id} className='w-72 mx-10 pt-7'>
            <AlgorithmGet personal={props.userId ? true : false} onChange={handleRemoveItem} userId={user.id} algoId={algo.id} sTypes={statTypes}/>
          </div>
        ))} 
      </div>           
    </div>
  );
}