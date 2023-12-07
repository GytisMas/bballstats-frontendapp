import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import '../Sidebar.css';

export default props => {
  return (
    <Menu>
      <a href='/home' className="duration-75 brightness-95 hover:brightness-100 text-xl font-bold py-5 text-white inline" >
            Home
      </a>
      <a href='/stats' className="duration-75 brightness-95 hover:brightness-100 text-xl font-bold py-5 text-white inline" >
          Stats
      </a>
      <a href='/public/algorithms' className="duration-75 brightness-95 hover:brightness-100 text-xl font-bold py-5 text-white inline" >
          Algorithms
      </a>
      <a href='/public/players' className="duration-75 brightness-95 hover:brightness-100 text-xl font-bold py-5 text-white inline" >
          Players
      </a>
      <a href='/profile' className="duration-75 brightness-95 hover:brightness-100 text-xl font-bold py-5 text-white inline" >
          Profile
      </a>
      <a href='/users' className="duration-75 brightness-95 hover:brightness-100 text-xl font-bold py-5 text-white inline" >
          Users
      </a>
      <a href='/login' className="duration-75 brightness-95 hover:brightness-100 text-xl font-bold py-5 text-white inline" >
          Login
      </a>
      <a href='/register' className="duration-75 brightness-95 hover:brightness-100 text-xl font-bold py-5 text-white inline" >
          Register
      </a>
      <a href='/logout' className="duration-75 brightness-95 hover:brightness-100 text-xl font-bold py-5 text-white inline" >
          Logout
      </a>
    </Menu>
  );
};