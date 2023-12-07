import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../provider/Authentication";
import Header from "../components/Header";
import '../../src/App.css';
import isTokenInvalid, { BearerAuth } from "../components/Helpers";
import axios from "axios";
import { useState, useEffect } from "react";
import SideBar from '../components/SideBar';
import { jwtDecode } from "jwt-decode";
import Footer from "../components/Footer";

export const ProtectedRoute = () => {
    const [width, setWidth] = useState(window.innerWidth);
    const breakpoint = 700;
    const [ tokenChecked, setTokenChecked ] = useState(false);
    const { accessToken } = useAuth();
    const { refreshToken } = useAuth();
    const { setTokens } = useAuth();
    const { currentUserRoles } = useAuth();

    useEffect(() => {
      const handleResizeWindow = () => setWidth(window.innerWidth);
       // subscribe to window resize event "onComponentDidMount"
       window.addEventListener("resize", handleResizeWindow);
       return () => {
         // unsubscribe "onComponentDestroy"
         window.removeEventListener("resize", handleResizeWindow);
       };
    }, []);

    async function getNewToken() {      
      const tokenData = {
        refreshToken: refreshToken
      }
      const response = await axios.post("https://whale-app-wxvqi.ondigitalocean.app/api/accessToken", tokenData
      , {headers: {
          Authorization: BearerAuth(accessToken)
        }}
      );
      setTokenChecked(true);
      let roles = jwtDecode(response.data.accessToken)["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      setTokens(response.data.accessToken, response.data.refreshToken, roles);
    }

    if (!tokenChecked) {
      if (isTokenInvalid(refreshToken)) {
        // If not authenticated, redirect to the login page
        return <Navigate to='/login' />;
      } else {
        getNewToken();
      }
    }
    
    if (width > breakpoint) {
      return <div className='Container'>
        <Header roles={currentUserRoles}/>
        <div className="Content">
          <Outlet />
        </div>
      <Footer roles={currentUserRoles}/>
      </div>;
    } else {
      return <div className='Container'>
        <SideBar roles={currentUserRoles} pageWrapId={'page-wrap'} outerContainerId={'Container'} />
        <div className="Content">
          <Outlet />
        </div>
      <Footer roles={currentUserRoles}/>
      </div>;
    }
    
};