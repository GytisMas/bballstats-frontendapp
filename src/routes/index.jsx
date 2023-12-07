import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../provider/Authentication";
import { ProtectedRoute } from "./ProtectedRoute";
import Home from "../pages/Home";
import Stats from "../pages/statistics/Stats";
import Logout from "../pages/auth/Logout";
import Login from "../pages/auth/Login";
import UsersList from "../pages/users/UsersList";
import UserGet from "../pages/users/UserGet";
import PlayersList from "../pages/players/PlayersList";
import PlayerCreate from "../pages/players/PlayerCreate";
import PlayerUpdate from "../pages/players/PlayerUpdate";
import PlayerDelete from "../pages/players/PlayerDelete";
import AlgorithmsList from "../pages/ratingAlgorithms/AlgorithmsList";
import AlgorithmCreate from "../pages/ratingAlgorithms/AlgorithmCreate";
import AlgorithmUpdate from "../pages/ratingAlgorithms/AlgorithmUpdate";
import { RegularRoute } from "./RegularRoute";
import UserUpdate from "../pages/users/UserUpdate";
import UserDelete from "../pages/users/UserDelete";
import PlayerStats from "../pages/playerStats/PlayerStats";
import PlayerStatsCreate from "../pages/playerStats/PlayerStatsCreate";
import PlayerStatsUpdate from "../pages/playerStats/PlayerStatsUpdate";
import PlayerStatsDelete from "../pages/playerStats/PlayerStatsDelete";
import UserCreate from "../pages/users/UserCreate";
import { jwtDecode } from "jwt-decode";
import isTokenInvalid from "../components/Helpers";
import AlgorithmDelete from "../pages/ratingAlgorithms/AlgorithmDelete";
import StatisticCreate from "../pages/statistics/StatisticCreate";
import StatisticUpdate from "../pages/statistics/StatisticUpdate";
import StatisticDelete from "../pages/statistics/StatisticDelete";
import Register from "../pages/auth/Register";
import ChangePassword from "../pages/auth/ChangePassword";
import Dashboard from "../components/Dashboard";
import NotFound from "../components/NotFound";

const Routes = () => {
  const { accessToken } = useAuth();
  const { refreshToken } = useAuth();
  const { currentUserRoles } = useAuth();

  // Define public routes accessible to all users
  const routesForPublic = [
    {
      path: "/public",
      element: <RegularRoute />, // Wrap the component in ProtectedRoute
      children: [
        {
          path: "/public/user/:userId",
          element: <UserGet personal={false} />,
        },
        {
          path: "/public/algorithms",
          element: <AlgorithmsList />,
        },
        {
          path: "/public/players",
          element: <PlayersList isModerator={currentUserRoles ? currentUserRoles.includes('Moderator') : false} />,
        },
      ],
    },    
  ];

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      children: [
        {
          path: "/home",
          element: <AlgorithmsList/>,
        },
        {
          path: "/stats",
          element: <Stats isCurator={currentUserRoles ? currentUserRoles.includes('Curator') : false}/>,
        },
        {
          path: "/profile",
          element: <UserGet userId={accessToken && jwtDecode(accessToken).sub} personal={true} />,
        },
        {
          path: "/statistic/create",
          element: <StatisticCreate />,
        },
        {
          path: "/statistic/update/:statId",
          element: <StatisticUpdate />,
        },
        {
          path: "/statistic/delete/:statId",
          element: <StatisticDelete />,
        },
        {
          path: "/users",
          element: <UsersList isAdmin={currentUserRoles ? currentUserRoles.includes('Admin') : false}/>,
        },
        {
          path: "/user/create",
          element: <UserCreate />,
        },
        {
          path: "/user/update/:userId",
          element: <UserUpdate />,
        },
        {
          path: "/user/delete/:userId",
          element: <UserDelete />,
        },
        {
          path: "/player/create",
          element: <PlayerCreate />,
        },
        {
          path: "/player/statCreate/:teamId/:playerId",
          element: <PlayerStatsCreate />,
        },
        {
          path: "/player/statUpdate/:teamId/:playerId/:statId",
          element: <PlayerStatsUpdate />,
        },
        {
          path: "/player/statDelete/:teamId/:playerId/:statId",
          element: <PlayerStatsDelete />,
        },
        {
          path: "/algorithm/create",
          element: <AlgorithmCreate />,
        },
        {
          path: "/algorithm/update/:userId/:algoId",
          element: <AlgorithmUpdate />,
        },
        {
          path: "/algorithm/delete/:userId/:algoId",
          element: <AlgorithmDelete />,
        },
        {
          path: "/player/:teamId/:playerId",
          element: <PlayerStats />,
        },
        {
          path: "/player/update/:teamId/:playerId",
          element: <PlayerUpdate />,
        },
        {
          path: "/player/delete/:teamId/:playerId",
          element: <PlayerDelete />,
        },
        {
          path: "/logout",
          element: <Logout/>,
        },
        {
          path: "/changePassword",
          element: <ChangePassword/>,
        },
      ],
    },
  ];

  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: "/",
      element: <RegularRoute />,
      children: [
        {
          path: "/home",
          element: <AlgorithmsList/>,
        },
        {
          path: "/login",
          element: <Login/>,
        },
        {
          path: "/register",
          element: <Register/>,
        },
      ],
    }    
  ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...routesForPublic,
    ...(isTokenInvalid(refreshToken) ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
    {
      path: "*",
      element: <RegularRoute />,
      children: [
        {
          path: "*",
          element: <NotFound/>,
        },
      ]
    }
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;