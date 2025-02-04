import { useState } from "react"
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { userExists, userNotExists } from "../redux/reducers/auth";

const useLogin = () =>{
    const [loading, setLoading] = useState(false);
    // const {setAuthUser} = useAuthContext()
    const dispatch = useDispatch()

    const login = async (userName, password) =>{
        const success = handleInputErrors({ userName, password})
        if(!success) return

        setLoading(true)
        try {
            const res = await fetch("/api/v1/auth/login", {
                method: "POST",
                headers: {"Content-type": "application/json"}, 
                body: JSON.stringify({userName, password}),
                credentials: 'include'
            });

            const data = await res.json()

            console.log(data)

            if(data.error){
                dispatch(userNotExists())
                throw new Error(data.error)
            }

            dispatch(userExists(data))
            console.log(data)
            localStorage.setItem("chat-user", JSON.stringify(data))
            // setAuthUser(data)
            toast.success(data.message)

        } catch (error) {
            console.log(error)
            toast(error.message)
        }finally{
            setLoading(false)
        }
    }
    return {loading, login}
}

export default useLogin

function handleInputErrors({ userName, password}){
    if(!userName || !password){
        toast.error('Please fill in all the fields')
        return false
    }

    return true
}