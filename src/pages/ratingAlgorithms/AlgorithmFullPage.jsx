import { useAuth } from "../../provider/Authentication";
import {BearerAuth, FormulaFirstHalf, FormulaSecondHalf} from '../../components/Helpers';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import * as math from 'mathjs'

export default function AlgorithmFullPage(props) {
    let params = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState([]);
    const [algorithm, setAlgorithm] = useState([]);
    const [allStats, setAllStats] = useState([]);
    const [formulaStats, setFormulaStats] = useState([]);
    const [formula, setFormula] = useState([]);
    const [algoStats, setAlgoStats] = useState([]);
    const [playerEntries, setPlayerEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingPl, setIsLoadingPl] = useState(true);
    const { accessToken, currentUserRoles } = useAuth();
  
    useEffect(() => {
      const loadAlgoStats = async () => {
        const response = (await axios.get('https://whale-app-wxvqi.ondigitalocean.app/api/users/' 
            + params.userId + '/ratingAlgorithms/' + params.algoId,
        ));
        setAlgorithm(response.data);

        const userResponse = await axios.get('https://whale-app-wxvqi.ondigitalocean.app/api/users/' + params.userId);
        setUser(userResponse.data);
        
        const statResponse = 
            Object.fromEntries((await axios.get('https://whale-app-wxvqi.ondigitalocean.app/api/statistics/'))
                .data
                .map((stat) => [stat.id, stat.displayName]));
        setAllStats(statResponse)

        setFormulaStats(FormulaFirstHalf(response.data.formula))
        let formulaStatsArr = FormulaFirstHalf(response.data.formula)
            .split(' ')
            .map((elem) => Number(elem));
        const formulaLoc = FormulaSecondHalf(response.data.formula)
        setFormula(formulaLoc)
        const response2 = (await axios.get('https://whale-app-wxvqi.ondigitalocean.app/api/users/' 
            + params.userId + '/ratingAlgorithms/' + params.algoId + '/algorithmStatistics',
        ));
        setAlgoStats(response2.data.sort(function(a, b){return a.id - b.id}));
        let playerList = []
        setIsLoading(false)
        const teams = (await axios.get("https://whale-app-wxvqi.ondigitalocean.app/api/teams")).data;
        for (let i = 0; i < teams.length; i++) {
            const players = (await axios.get('https://whale-app-wxvqi.ondigitalocean.app/api/teams/'+teams[i].id+'/players')).data
            for (let j = 0; j < players.length; j++) {
                const playerStats = (await axios.get('https://whale-app-wxvqi.ondigitalocean.app/api/teams/'+teams[i].id+'/players/'+players[j].id+'/playerStatistics/'))
                    .data
                const playerStatIds = playerStats.map((elem) => elem.statType);
                let hasAllStats = true
                let statIndexes = []
                for (let k = 0; k < formulaStatsArr.length; k++) {
                    const statIndex = playerStatIds.indexOf(formulaStatsArr[k])
                    if (statIndex !== -1) {
                        statIndexes.push(statIndex)
                    } else {            
                        hasAllStats = false;
                        break;
                    }
                }
                if (hasAllStats) {
                    let tempFormula = formulaLoc
                    for (let k = 0; k < formulaStatsArr.length; k++) {
                        tempFormula = tempFormula.replaceAll("s"+(k+1), playerStats[statIndexes[k]].value)
                    }
                    const score = math.evaluate(tempFormula)
                    playerList.push(
                        {
                            player: players[j].name,
                            team: teams[i].name,
                            rating: score
                        }
                    )
                }
            }
        }
        setPlayerEntries(playerList.sort(function(a, b){return b.rating - a.rating}))
        setIsLoadingPl(false)
      }

      const parsePlayerData = async () => {

      }

      loadAlgoStats();
    }, []);

    return (
        <div className='w-full flex flex-col items-center'>    
            {!isLoading ?    
                <div className='max-w-xl bg-white px-10 border-2 rounded-3xl flex flex-col items-center justify-center'>
                    <p className='text-center font-bold pt-6 pb-3'>Rating System #{algorithm.id}</p>
                    <p className='text-center font-bold pt-3'>Author</p>
                    <p className='text-center pb-3'>{user.username}</p>
                    <p className='text-center font-bold pt-3'>Formula</p>
                    <p className='text-center pb-3'>{formula}</p>
                    <p className='text-center font-bold pt-3'>Uses these stats</p>
                    
                    <div className="pb-6 w-full flex flex-col justify-start">
                    {algoStats.map((algoStat) => (
                        <p key={algoStat.id} className='text-center'>{allStats[algoStat.statType]}</p>
                    ))}
                    </div>
                </div>
                : <p>Loading...</p>
            }
            {!isLoadingPl ?
                <div className="max-w-6xl flex flex-col mt-5 justify-center items-center bg-white px-10 border-2 rounded-3xl">
                    <div className="h-5 bg-slate-400"/>
                    <table>
                        <thead>
                            <tr>
                                <th className='p-2 border-2 text-left'>#</th>
                                <th className='p-2 border-2 text-left'>Player Name</th>
                                <th className='p-2 border-2 text-left'>Team Name</th>
                                <th className='p-2 border-2 text-left'>Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                        {playerEntries.map((elem, i) => (
                        <tr key={elem.player}>
                            <td className='p-2 border-2 text-right'>{i+1}</td>
                            <td className='p-2 border-2 text-left'>{elem.player}</td>
                            <td className='p-2 border-2 text-left'>{elem.team}</td>
                            <td className='p-2 border-2 text-right'>{elem.rating}</td>
                        </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className="h-5 bg-slate-400"/>
                </div>
                : <p>Loading...</p>
            }
            
        </div>
    );
}