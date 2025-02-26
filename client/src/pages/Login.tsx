
import { useEffect, useState } from 'react'
import { Button, Form, Image } from 'react-bootstrap'
import axios from 'axios'
import { useAuth } from '../AuthContext'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { Show } from '../utils/ConditionalRendering'


const Login = () => {
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const { login, isAuthenticated } = useAuth()

    useEffect(()=>{
        console.log(email, password)
    }, [email, password])
    
    useEffect(()=>{
        if(isAuthenticated) {
         navigate("/")
        }
    }, [])

    async function handleLogin() {

        setIsLoading(true)
        
        const fetchUrl = `${import.meta.env.VITE_API_URL}/api/auth/login`

        try {
            const response = await axios.post(
                fetchUrl,
                { email, password },
                { headers: { "Content-Type": "application/json" } }
            );

            console.log(response.data)
            

            login(response.data.token)
            localStorage.setItem("login_time", Date.now().toString()); // Save login time
            toast.success("Logged in successfully!", {duration: 5000})
            navigate("/")
            setIsLoading(false)

            

        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Axios Error:", error.response?.data);
                if(!error.response?.data.message) {
                    toast.error("Request failed", {duration: 5000})
                    setIsLoading(false)
                } else {
                    toast.error(error.response?.data.message, {duration: 5000})
                    setIsLoading(false)
                }
             
            } else {
                console.error("Unexpected Error:", error);
                toast.error("Unexpected Error!", {duration: 5000})
                setIsLoading(false)
              
            }
        }
        
    }

    return (
    <div className='bg-danger min-vh-100 d-flex align-items-center justify-content-center'>
        <Form className='bg-secondary p-2 rounded-3 d-flex flex-column align-items-center justify-content-center' 
            style={{
                width: "350px"
            }}
            onSubmit={(e) => {
                e.preventDefault()
                handleLogin()
            }}
        >
            <Image fluid src='/comtech-logo.png' />
            <h4 className='text-dark'>Login</h4>
            <Form.Label>
                {/* <span>email:</span> */}
                <Form.Control type='email' placeholder='Email' required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Form.Label>
            <Form.Label>
                <Form.Control type='password' placeholder='Password'  required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Form.Label>
            <Show when={!isLoading}>
                <Button type='submit' variant='danger px-5'>Login</Button>    
            </Show>
            <Show when={isLoading}>
                <Button type='submit' variant='danger px-5' disabled>Logging in...</Button>    
            </Show>

            <p className='pt-3'>Forgot password? Contact administrator.</p>
        </Form>
    </div>
  )
}

export default Login