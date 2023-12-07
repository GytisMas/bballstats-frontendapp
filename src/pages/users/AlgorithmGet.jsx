import { useEffect, useState } from 'react';
import {FormulaTrunc} from '../../components/Helpers';
import { jwtDecode } from 'jwt-decode'
import { useAuth } from "../../provider/Authentication";
import {BearerAuth} from '../../components/Helpers';
import axios from 'axios';
import UserGet from './UserGet';
import { useNavigate } from "react-router-dom";
import Modal from '../../components/Modal';
export default function AlgorithmGet(props) {
  const navigate = useNavigate();
  const [algorithm, setAlgorithm] = useState([]);
  const [algoStats, setAlgoStats] = useState([]);
  const { accessToken, currentUserRoles } = useAuth();
  const [impressionsPos, setImpressionsPos] = useState(0);
  const [impressionsNeg, setImpressionsNeg] = useState(0);
  const [posIsSet, setPosIsSet] = useState(false);
  const [negIsSet, setNegIsSet] = useState(false);
  const [modalIsShowing, setModalIsShowing] = useState(false);

  const showModal = () => {
    setModalIsShowing(true);
  };
  const hideModal = () => {
    setModalIsShowing(false);
  };

  useEffect(() => {
    const loadAlgoStats = async () => {
        const response = (await axios.get('http://localhost:5142/api/users/' 
            + props.userId + '/ratingAlgorithms/' + props.algoId,
        ));
        setAlgorithm(response.data);
        const response2 = (await axios.get('http://localhost:5142/api/users/' 
            + props.userId + '/ratingAlgorithms/' + props.algoId + '/algorithmStatistics',
        ));
        setAlgoStats(response2.data.sort(function(a, b){return a.id - b.id}));
        const response3 = (await axios.get('http://localhost:5142/api/users/' 
            + props.userId + '/ratingAlgorithms/' + props.algoId + '/algorithmImpressions',
        )).data;
        let numToAddPos = 0
        let numToAddNeg = 0
        for (let i = 0; i < response3.length; i++) {
          let impr = response3[i]
          if (impr.positive) {
            numToAddPos += 1
          } else {
            numToAddNeg += 1
          }
        }
        setImpressionsPos(impressionsPos + numToAddPos);
        setImpressionsNeg(impressionsNeg + numToAddNeg);
        handleImpression(false, true)
    }
    loadAlgoStats();
  }, []);

  const handleImpression = async (thumbsUp, onlyCheck) => {
    const impressionData = {
      positive: thumbsUp
    }

    const impressionsResponse = await axios.get('http://localhost:5142/api/users/' 
    + props.userId + '/ratingAlgorithms/' + props.algoId + '/algorithmImpressions');
    let update = false;
    let imprId = 0;
    let imprIndex = 0;
    if (accessToken) {
      const thisUserId = jwtDecode(accessToken).sub
      for (let i = 0; i < impressionsResponse.data.length; i++) {
        if (impressionsResponse.data[i].userId == thisUserId) {
          update = true;
          imprIndex = i;
          imprId = impressionsResponse.data[i].id;
          if (impressionsResponse.data[i].positive) {
            setPosIsSet(true);
            setNegIsSet(false);
          } else {
            setNegIsSet(true);
            setPosIsSet(false);
          }
          break;
        }
      }
    }
    
    if (onlyCheck)
      return;
    if (!update) {
      try {
        const response = await axios.post('http://localhost:5142/api/users/' 
          + props.userId + '/ratingAlgorithms/' + props.algoId + '/algorithmImpressions', impressionData
          , {headers: {
              Authorization: BearerAuth(accessToken)
            }}
        );
        if (response.data.positive) {
          setPosIsSet(true);
          setImpressionsPos(impressionsPos+1)
        }
        else if (!response.data.positive) {
          setNegIsSet(true);
          setImpressionsNeg(impressionsNeg+1)
        }
      } catch (error) {
          console.log(error);
      }
    } else {
      if (impressionsResponse.data[imprIndex].positive == thumbsUp) {
        try {
          const response = await axios.delete('http://localhost:5142/api/users/' 
            + props.userId + '/ratingAlgorithms/' + props.algoId + '/algorithmImpressions/' + imprId
            , {headers: {
                Authorization: BearerAuth(accessToken)
              }}
          );
          if (thumbsUp) {
            setPosIsSet(false);
            setImpressionsPos(impressionsPos-1)
          }
          else if (!thumbsUp) {
            setNegIsSet(false);
            setImpressionsNeg(impressionsNeg-1)
          }
        } catch (error) {
            console.log(error);
        }
      } else {
        try {
          const response = await axios.put('http://localhost:5142/api/users/' 
            + props.userId + '/ratingAlgorithms/' + props.algoId + '/algorithmImpressions/' + imprId, impressionData
            , {headers: {
                Authorization: BearerAuth(accessToken)
              }}
          );
          if (response.data.positive) {
            setPosIsSet(true);
            setNegIsSet(false);
            setImpressionsPos(impressionsPos+1)
            setImpressionsNeg(impressionsNeg-1)
          }
          else if (!response.data.positive) {
            setNegIsSet(true);
            setPosIsSet(false);
            setImpressionsNeg(impressionsNeg+1)
            setImpressionsPos(impressionsPos-1)
          }
        } catch (error) {
            console.log(error);
        }
      }
      
    }
    
  }


  const handleInfo = (algoId) => {
    navigate('/algorithm/'+props.userId+'/'+algoId, { replace: true }); 
  }
  const handleUpdate = (algoId) => {
    navigate('/algorithm/update/'+props.userId+'/'+algoId, { replace: true }); 
  }

  const handleDelete = (algoId) => {
    navigate('/algorithm/delete/'+props.userId+'/'+algoId, { replace: true }); 
  }


  const handleDeleteModal = async (event) => {
    event.preventDefault();
    const response = (await axios.delete('http://localhost:5142/api/users/'+props.userId+'/ratingAlgorithms/'+props.algoId
      , {headers: {
        Authorization: BearerAuth(accessToken)
      }}));
    hideModal();
    props.onChange(props.algoId)
  }

  return (
    <div className='w-full'>        
        <div className='w-full border-b-2 flex flex-row justify-between'>
          <button onClick={() => handleInfo(props.algoId)}  className='btn hover:underline text-left text-xl font-bold pb-2'>Rating System #{algorithm.id}</button>
          <div>
            {posIsSet ? 
            <button className='text-xl' onClick={() => handleImpression(true, false)}>{impressionsPos}</button> 
            :<button onClick={() => handleImpression(true, false)}>{impressionsPos}</button> 
            }
            {negIsSet ? 
            <button className='text-xl' onClick={() => handleImpression(false, false)}>{impressionsNeg}</button>
            :<button onClick={() => handleImpression(false, false)}>{impressionsNeg}</button>
            }
          </div>
        </div>
        
        {!props.personal ?
          <p className='border-b-2 mt-2'>Author: <a href={'/public/user/'+props.userId}><UserGet userId={props.userId} noAlgorithms={true}/></a></p>
          : null
        }

        {/* <p>{algorithm.formula && FormulaTrunc(algorithm.formula)}</p> */}
        
        <div className='border-b-2'>
          <p className='mt-2 underline'>Uses stats including:</p>
          {algoStats.slice(0, 3).map((algoStat) => (
            <div key={algoStat.id}>
                <p>{props.sTypes[algoStat.statType]}</p>
            </div>
          ))}
        </div>

        {props.personal && props.personal == true &&
          <div className='mt-1'>
            <Modal show={modalIsShowing} handleClose={handleDeleteModal}>
              <p>Modal</p>
            </Modal>
            <button onClick={() => handleUpdate(props.algoId)}><img className='sepia hover:sepia-0 duration-75' src={process.env.PUBLIC_URL + '/icons/icons8-pencil-24.png'}/></button>
            <button onClick={() => showModal()}><img className='sepia hover:sepia-0 duration-75' src={process.env.PUBLIC_URL + '/icons/icons8-trash-24.png'}/></button>
          </div>
        }
    </div>
  );
}