import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, removeToken } from "../api/auth";

const Logout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        if(getToken()) {
            removeToken()
            navigate('/login')
        } else {
            navigate('/login')
        }
    }, [])
    return <></>;
};

export default Logout;
