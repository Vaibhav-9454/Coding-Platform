
import {useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector} from 'react-redux';
import { useNavigate } from 'react-router';
import { loginUser } from '../authSlice';
import {useEffect} from 'react';



const signupSchema = z.object({
   
    emailId:z.string().email("Invalid Email"),
    password:z.string().min(8, "Password is to weak")
});

function Login(){

    const dispatch = useDispatch();
    const navigate =useNavigate();
    const{isAuthenticated, loading, error} = useSelector((state)=>state.auth);
   const { register,handleSubmit,formState: { errors },} = useForm({resolver: zodResolver(signupSchema)});

//    const submittedData = (data)=>{
//     console.log(data);
//    }

//     return (
//     <>
//     <form onSubmit={handleSubmit((data) => console.log(data))} className='min-h-screen flex flex-col justify-center item-center gap-y-2 max-w-xl ml-50'>
//         <input {...register('firstName')} placeholder='Enter Your Name' />
//         {errors.firstName && (<span>{errors.firstName.message}</span>)}
//         <input {...register('emailId')} placeholder='Enter Your Email' />
//         {errors.emailId && (<span>{errors.emailId.message}</span>)}
//         <input {...register('password')} placeholder='Enter Your Password' type ="password"/>
//         {errors.password && (<span>{errors.password.message}</span>)}

//    <button type='submit' className='btn btn-lg'>Submit</button>
//     </form>
//     </>
//     )

useEffect(()=>{
    if(isAuthenticated){
        navigate('/');
    }
}, [isAuthenticated, navigate]);

const onSubmit = (data)=>{
    dispatch(loginUser(data));
};


return (
  <div className="min-h-screen flex items-center justify-center bg-base-200">

    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">

        <h2 className="card-title justify-center text-2xl mb-4">
          Login
        </h2>

<form onSubmit={handleSubmit(onSubmit)}>

         

          <div className="form-control mb-3">
            <label className="label">
              <span className="label-text">Email</span>
            </label>

            <input
              
              type="email"
              placeholder="Enter Your Email"
              className={`input input-bordered ${errors.emailId && 'input-error'}`}
              {...register("emailId")}
            />

            {errors.emailId && (
              <span className="text-error">
                {errors.emailId.message}
              </span>
            )}
          </div>


          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Password</span>
            </label>

            <input
              {...register("password")}
              type="password"
              placeholder="Enter Your Password"
              className="input input-bordered w-full"
            />

            {errors.password && (
              <span className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </span>
            )}
          </div>


          <button type="submit" className="btn btn-primary w-full">
            Login
          </button>

        </form>

      </div>
    </div>

  </div>
);
}


export default Login;






















// import { useState} from "react";
// function Signup(){

//     const [name,setName]=useState('');
//     const [email,setEmail]=useState('');
//     const [password,setPassword]=useState('');

//     const handleSubmit = (e)=>{
//         e.preventDefault();
//         console.log(name, email, password)

//     }
//     return (
//        <form onSubmit={handleSubmit} className="min-h-screen flex flex-col justify-center items-center gap-y-3">
//            <input type="text" value={name} placeholder="Enter your firstName" onChange={(e)=>setName(e.target.value)}></input>
//             <input type="email" value={email} placeholder="Enter your Email" onChange={(e)=>setEmail(e.target.value)}></input>
//              <input type="password" value={password} placeholder="Enter your Password" onChange={(e)=>setPassword(e.target.value)}></input>
//              <button type="submit">Submit</button>
//        </form>
//     )
// }

// export default Signup;