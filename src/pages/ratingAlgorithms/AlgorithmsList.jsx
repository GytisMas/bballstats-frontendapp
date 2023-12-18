import { useEffect, useState } from 'react';
import axios from 'axios';
import { APIEndpoint } from "../../components/Helpers";
import { useAuth } from "../../provider/Authentication";
import {FormContainerStyle, FormMemberStyle, FormSumbitStyle} from '../../components/Helpers';
import BearerAuth, { FormulaSecondHalf } from '../../components/Helpers';
import UserGet from '../users/UserGet';
import AlgorithmGet from '../users/AlgorithmGet';

export default function AlgorithmsList() {
    const [algorithms, setAlgorithms] = useState([]);
    const [statTypes, setStatTypes] = useState([]);
      useEffect(() => {
        const loadAlgorithms = async () => {
          try {
              const response = await axios.get(APIEndpoint + "/ratingAlgorithms");
              setAlgorithms(response.data.sort(function(a, b){return b.id - a.id}));
              const statResponse = 
              Object.fromEntries((await axios.get(APIEndpoint + '/statistics/'))
                .data
                .map((stat) => [stat.id, stat.displayName]));
              setStatTypes(statResponse);
          } catch (error) {
              console.log(error);
          }
          
        };
    
        loadAlgorithms();
      }, []);
    
      return (
        <>
          <div className='mt-5 max-w-xl mx-auto px-2 bg-white border-2 rounded-3xl'>
            <p className='py-2 font-bold text-xl text-center'>User-created rating systems</p>
          </div>
          <div className='flex flex-row flex-wrap justify-evenly mt-5 max-w-6xl mx-auto px-2 pb-10 bg-white border-2 rounded-3xl'>
            {algorithms.map((algo) => (
              <div key={algo.id} className='w-72 mt-10'>
                <AlgorithmGet userId={algo.authorId} algoId={algo.id} sTypes={statTypes}/>
              </div>
            ))}
          </div>
        </>
      );
    }