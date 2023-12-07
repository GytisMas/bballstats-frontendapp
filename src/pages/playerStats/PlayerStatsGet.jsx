import { useEffect, useState } from 'react';
import axios from 'axios';
import { statTypes } from '../players/PlayersList';
import { useNavigate } from "react-router-dom";
import {FormContainerStyle, FormMemberStyle, FormSumbitStyle} from '../../components/Helpers';
export default function PlayerStatsGet(props) {
  const [playerStats, setPlayerStats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPlayer = async () => {
        const response = (await axios.get('http://localhost:5142/api/teams/' 
            + props.teamId + '/players/' + props.playerId + '/playerStatistics'
        ));
        setPlayerStats(response.data.sort(function(a, b){return a.statType - b.statType}));
    }
    loadPlayer();
  }, []);

  const StatName = (id) => {
    return localStorage.getItem('statTypes') ? 
      (JSON.parse(localStorage.getItem('statTypes'))).find((el) => el.id == id).displayName
      : id;
  }

  let StatVisibility = (id) => {
    return localStorage.getItem('statTypes') ? 
      (JSON.parse(localStorage.getItem('statTypes'))).find((el) => el.id == id).status
      : id;
  }

  const handleUpdate = (statId) => {
    navigate('/player/statUpdate/'+props.teamId+'/'+props.playerId+'/'+statId, { replace: true }); 
  }

  const handleDelete = (statId) => {
    navigate('/player/statDelete/'+props.teamId+'/'+props.playerId+'/'+statId, { replace: true }); 
  }

  return (
    <>
        {props.isModerator && props.isModerator == true &&
          <div className='border-t-4 border-b-2 p-2 w-full'>
            <a href={'/player/statCreate/'+props.teamId+'/'+props.playerId} className='bth p-1 my-1 bg-amber-300 border-2 '>Create player statistic</a>
          </div>
        }
        {playerStats.map((playerStat) => (
          <div className=' w-full  border-b-2' key={playerStat.id}>
            {(!props.isModerator && StatVisibility(playerStat.statType) != 1) ?
              null
              : 
              <div className='w-full flex flex-row flex-nowrap items-center justify-between'>
                <div className='flex flew-row items-center justify-between w-4/5'>
                  <p className='text-sm ml-1'>{StatName(playerStat.statType)}</p>
                  <p className='font-bold mr-2 text-md'>{playerStat.value}</p>
                </div>
                {props.isModerator && props.isModerator == true &&
                  <div className='flex flex-row flex-nowrap items-center'>
                    <button onClick={() => handleUpdate(playerStat.id)}><img className='sepia hover:sepia-0 duration-75' src={process.env.PUBLIC_URL + '/icons/icons8-pencil-24.png'}/></button>
                    <button onClick={() => handleDelete(playerStat.id)}><img className='sepia hover:sepia-0 duration-75' src={process.env.PUBLIC_URL + '/icons/icons8-trash-24.png'}/></button>
                  </div>
                }
              </div>    
            }  
          </div>

        ))}
    </>
  );
}