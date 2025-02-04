import { useState } from "react"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import {  userNotExists } from "../redux/reducers/auth"

const useLogout = () =>{
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    // const {setAuthUser} = useAuthContext()
    const logout = async () =>{
        setLoading(true)
        try {
            const res  = await fetch("/api/v1/auth/logout", {
                method: "POST",
                headers: {"Content-type" : "application/json"},
                credentials: 'include'
            })

            const data = await res.json();

            if(data.error){
                // dispatch(userNotExists())
                throw new Error(data.error)
            }
            
            localStorage.removeItem("chat-user")
            dispatch(userNotExists())
            toast.success("Logged out successfully")
            // localStorage.removeItem("chat-user")
            // setAuthUser(null)
        } catch (error) {
            dispatch(userNotExists())
            toast.error(error.message)
        }finally{
            setLoading(false)
        }
    };

    return {loading, logout}
}

export default  useLogout;