<template>
    <div class="form-container">
      <form v-on:submit.prevent="handleSignup" class="signup-form">
        <h2>Sign Up</h2>
  
        <input type="text" placeholder="Enter name" required v-model="form.name" pattern="[A-Za-z]+" title="Name should contain at least one letter">

        <input type="email" placeholder="Enter email" required v-model="form.email">
        <input type="password" placeholder="Enter password" required v-model="form.password">
  
        <button class="signup">Sign Up</button>
        <button type="button" id="login" v-on:click="handleLogin">Login</button>
      </form>
    </div>
  </template>
  
  <script>
import axios from 'axios';

  export default {
    name: "SignUp",
    data()
    {
        return{
            form:{
                id:0,
                name:"",
                email:"",
                password:""
            },
            users:[]
        }
    },
    methods:{
        async handleSignup()
        {
            if(this.form.name && this.form.password && this.form.email)
            {
                let users = await axios.get("http://localhost:3000/users")
            let maxid=users.data.reduce((a,b)=>a.id>b.id?a.id:b.id)   
            this.form.id=parseInt(maxid) 
           
        }
        
        let user=await axios.post("http://localhost:3000/users",{
            id:this.form.id+1,
            name:this.form.name,
            email:this.form.email,
            password:this.form.password,
            role:"Employee"
          
        })
        if(user.status==201)
        {
            localStorage.setItem("user-info",JSON.stringify(user.data))
            
            this.form.name="",
            this.form.email="",
            this.form.password="",

            this.$router.push("/login")
            
            alert("signed up")

        }
        else
        {
            alert("signup failed")
        }

        },
        handleLogin(){
          this.$router.push("/login")
        }

    },
  



  };

  </script>

  
  <style >
 
  /* Form Container */
  .form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  /* Form Styling */
  .signup-form {
    background: #ffffff;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    text-align: center;
  }
  
  /* Form Title */
  .signup-form h2 {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }
  
  /* Input Styling */
  .signup-form input {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border-radius: 5px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    font-size: 16px;
    background-color: #fafafa;
    transition: border-color 0.3s;
  }
  
  /* Input Focus Style */
  .signup-form input:focus {
    border-color: #007bff;
    outline: none;
  }
  #login{
    background-color: #007bff;
  }
  #login:hover{
    background-color: #0b6dd6;
  }
  /* Button Styling */
  .signup-form button {
    color: white;
    padding: 12px;
    border: none;
    border-radius: 5px;
    width: 100%;
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-top: 1rem;
  }
  
  /* Button Hover Effect */
  .signup-form button:hover {
    background-color: #1c7e1ccf;
  }
  </style>
  