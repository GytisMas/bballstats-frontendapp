export function BearerAuth(auth) {
    return 'Bearer ' + auth;
}

export function FormulaFirstHalf(formula) {
  let a = formula.split(') (')[0];
  return a.slice(1, a.length)
}

export function FormulaSecondHalf(formula) {
    return formula.split(') (')[1].slice(0, -1)
}

export const UserRoles = ['Admin', 'Moderator', 'Curator', 'Regular']

export default function isTokenInvalid(token) {
  if (!token)
    return true;
  const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
  return (Math.floor((new Date()).getTime() / 1000)) >= expiry;
}
export const APIEndpoint = 'https://whale-app-wxvqi.ondigitalocean.app/api';
export const FormMemberStyle = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight duration-75 hover:border-blue-400 focus:outline-none focus:shadow-outline";
export const FormHelperStyle = "shadow bg-slate-200 mt-2 border rounded py-2 px-3 text-gray-700 transition duration-75 hover:bg-blue-200 hover:border-blue-200 leading-tight focus:outline-none focus:shadow-outline";
export const FormSumbitStyle = "shadow max-w-min bg-blue-400 mt-2 border rounded py-2 px-3 text-gray-700 transition duration-75 hover:bg-blue-600 leading-tight focus:outline-none focus:shadow-outline";
export const FormSumbitStyleCancel = "shadow max-w-min bg-slate-400 border rounded py-2 px-3 text-gray-700 transition duration-75 hover:bg-slate-600 leading-tight focus:outline-none focus:shadow-outline";
export const FormContainerStyle = 'max-w-xs mx-auto mt-5 duration-75';