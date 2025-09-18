import { Link } from "react-router";

function NotFound() {
    return (
        <div>
            <h1>Oops, Page not found! 🙃</h1>
            <div className="sub-title">The page you are looking for has disappeared!</div>
            <div className="sub-title">&rarr; Please take me to <Link to='/'>Home</Link>!</div>
        </div>
    )
}

export default NotFound;