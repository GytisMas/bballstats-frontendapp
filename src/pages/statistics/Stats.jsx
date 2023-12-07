import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import NotFound from '../../components/NotFound';
export default function Stats(props) {
  const [stats, setStats] = useState([]);
  const navigate = useNavigate();
    useEffect(() => {
      const loadStats = async () => {
        if (!props.isCurator)
          return;
        const response = await axios.get('http://localhost:5142/api/statistics');
        setStats(response.data.sort(function(a, b){return a.id - b.id}));
      };

      loadStats();
    }, []);

    
  const handleUpdate = (statId) => {
    navigate('/statistic/update/'+statId, { replace: true }); 
  }

  const handleDelete = (statId) => {
    navigate('/statistic/delete/'+statId, { replace: true }); 
  }

  if (!props.isCurator)
    return <NotFound/>;

  return (
    <div className='flex flex-col flex-wrap justify-evenly items-center mt-5 pb-5 max-w-3xl mx-auto px-2  bg-white border-2 rounded-3xl'>
      <a href='/statistic/create' className='btn p-1 w-48 bg-amber-300 border-2 text-center my-2 border-black'>Create Statistic Type</a>
      <table>
        <tr>
          <th className='p-2 border-2 text-left'>ID</th>
          <th className='p-2 border-2 text-left'>Name</th>
          <th className='p-2 border-2 text-left'>Display Name</th>
          <th className='p-2 border-2 text-left'>Visibility Status</th>
          <th className='p-2 border-2 text-left'>Manage</th>
        </tr>
        {stats.map((stat) => (
          <tr key={stat.id}>
            <td className='p-2 border-2 text-right'>{stat.id}</td>
            <td className='p-2 border-2 text-left'>{stat.name}</td>
            <td className='p-2 border-2 text-left'>{stat.displayName}</td>
            <td className='p-2 border-2 text-left'>{stat.status}</td>
            <td className='p-2 border-2'>
              <button className='align-middle block mx-auto' onClick={() => handleUpdate(stat.id)} ><img className='sepia hover:sepia-0 duration-75' src={process.env.PUBLIC_URL + '/icons/icons8-pencil-24.png'}/></button>
              <button className='align-middle block mx-auto' onClick={() => handleDelete(stat.id)} ><img className='sepia hover:sepia-0 duration-75' src={process.env.PUBLIC_URL + '/icons/icons8-trash-24.png'}/></button>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}