export default function HeaderFields(props) {
    return <>
        <a href='/home' className="duration-75 brightness-95 hover:brightness-100 text-xl font-bold py-5 text-white inline" >
            Home
        </a>
        <a href='/public/algorithms' className="duration-75 brightness-95 hover:brightness-100 text-xl font-bold py-5 text-white inline" >
            Algorithms
        </a>
        <a href='/public/players' className="duration-75 brightness-95 hover:brightness-100 text-xl font-bold py-5 text-white inline" >
            Players
        </a>
        {props.roles &&
        <a href='/profile' className="duration-75 brightness-95 hover:brightness-100 text-xl font-bold py-5 text-white inline" >
            Profile
        </a>
        }
        
        
        {props.roles && props.roles.includes('Curator') &&
            <a href='/stats' className="duration-75 brightness-95 hover:brightness-100 text-xl font-bold py-5 text-white inline" >
                Stats
            </a>
        }

        {props.roles && props.roles.includes('Admin') &&
            <a href='/users' className="duration-75 brightness-95 hover:brightness-100 text-xl font-bold py-5 text-white inline" >
                Users
            </a>
        }
        
        {props.roles &&
            <a href='/logout' className="duration-75 brightness-95 hover:brightness-100 text-xl font-bold py-5 text-white inline" >
                Logout
            </a>
        }
        {!props.roles &&
            <a href='/login' className="duration-75 brightness-95 hover:brightness-100 text-xl font-bold py-5 text-white inline" >
                Login
            </a>
        }
        {!props.roles &&
            <a href='/register' className="duration-75 brightness-95 hover:brightness-100 text-xl font-bold py-5 text-white inline" >
                Register
            </a>
        }
    </>
}