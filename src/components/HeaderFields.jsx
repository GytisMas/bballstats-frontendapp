export default function HeaderFields(props) {
    return <>
        <a href='/home' className={(props.footer ? "mx-2 text-md h-8 " : "text-xl font-bold h-16 ") + "duration-75 brightness-95 hover:brightness-100 text-white inline"} >
            <img className="h-full" src={process.env.PUBLIC_URL + '/icons/home.svg'}/>
        </a>
        <a href='/public/algorithms' className={(props.footer ? "mx-2 text-md " : "text-xl font-bold ") + "duration-75 brightness-95 hover:brightness-100 text-white inline"} >
            Algorithms
        </a>
        <a href='/public/players' className={(props.footer ? "mx-2 text-md " : "text-xl font-bold ") + "duration-75 brightness-95 hover:brightness-100 text-white inline"} >
            Players
        </a>
        {props.roles &&
        <a href='/profile' className={(props.footer ? "mx-2 text-md " : "text-xl font-bold ") + "duration-75 brightness-95 hover:brightness-100 text-white inline"} >
            Profile
        </a>
        }
        
        
        {props.roles && props.roles.includes('Curator') &&
            <a href='/stats' className={(props.footer ? "mx-2 text-md " : "text-xl font-bold ") + "duration-75 brightness-95 hover:brightness-100 text-white inline"} >
                Stats
            </a>
        }

        {props.roles && props.roles.includes('Admin') &&
            <a href='/users' className={(props.footer ? "mx-2 text-md " : "text-xl font-bold ") + "duration-75 brightness-95 hover:brightness-100 text-white inline"} >
                Users
            </a>
        }
        
        {props.roles &&
            <a href='/logout' className={(props.footer ? "mx-2 text-md " : "text-xl font-bold ") + "duration-75 brightness-95 hover:brightness-100 text-white inline"} >
                Logout
            </a>
        }
        {!props.roles &&
            <a href='/login' className={(props.footer ? "mx-2 text-md " : "text-xl font-bold ") + "duration-75 brightness-95 hover:brightness-100 text-white inline"} >
                Login
            </a>
        }
        {!props.roles &&
            <a href='/register' className={(props.footer ? "mx-2 text-md " : "text-xl font-bold ") + "duration-75 brightness-95 hover:brightness-100 text-white inline"} >
                Register
            </a>
        }
    </>
}