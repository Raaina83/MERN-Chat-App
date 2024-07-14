import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { userExists, userNotExists } from "../redux/reducers/auth";
// import { useAuthContext } from "../context/AuthContext";

const useSignup = () =>{
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()
    // const { setAuthUser} = useAuthContext()

    const signup = async({fullName, userName, password, confirmPassword, email, gender}) =>{
        const success = handleInputErrors({fullName, userName, password, confirmPassword, email, gender})
        if(!success) return

        setLoading(true)

        try {
            const res = await fetch("/api/v1/auth/signup", {
                method: 'POST',
                headers: {"Content-type" : "application/json"},
                body: JSON.stringify({fullName, userName, password, confirmPassword, email,  gender}),
                credentials: 'include'
            })

            const data = await res.json()
            if(data.error){
                dispatch(userNotExists())
                throw new Error(data.error);
            }

            dispatch(userExists(data))
            // localStorage.setItem('chat-user', JSON.stringify(data))
            // setAuthUser(data)
        } catch (error) {
            toast.error(error.message)
        } finally{
            setLoading(false)
        }
    }

    return {signup, loading}
}

export default useSignup;

function handleInputErrors({fullName, userName, password, confirmPassword, email, gender}){
    if(!fullName || !userName || !password || !confirmPassword || !email || !gender){
        toast.error('Please fill in all the fields')
        return false
    }

    if(password!== confirmPassword){
        toast.error('Passwords do not match')
        return false
    }

    if(password.length < 6){
        toast.error('Password must be 6 characters')
        return false
    }

    return true
}