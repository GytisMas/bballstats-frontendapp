import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../provider/Authentication";
import Header from "../components/Header";
import '../../src/App.css';
import { useState, useEffect } from "react";
import SideBar from '../components/SideBar';

export const RegularRoute = () => {  
  const { currentUserRoles } = useAuth();
  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 700;

  useEffect(() => {
    const handleResizeWindow = () => setWidth(window.innerWidth);
     // subscribe to window resize event "onComponentDidMount"
     window.addEventListener("resize", handleResizeWindow);
     return () => {
       // unsubscribe "onComponentDestroy"
       window.removeEventListener("resize", handleResizeWindow);
     };
  }, []);

  if (width > breakpoint) {
    return <div className='Container'>
      <Header roles={currentUserRoles}/>
      <div className="Content">
        <Outlet />
      </div>
    </div>;
  } else {
    return <div className='Container'>
      <SideBar pageWrapId={'page-wrap'} outerContainerId={'Container'} />
      <div className="Content">
        <Outlet />
      </div>
    </div>;
  }
};