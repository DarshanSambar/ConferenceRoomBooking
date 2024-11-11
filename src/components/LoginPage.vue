<template>
    <div class="form-container">
     <form v-on:submit.prevent="handleLogin" class="signup-form">
       <h2>Login</h2>

       <input type="email" placeholder="Enter email" required v-model="form.email">
       <input type="password" placeholder="Enter password" required v-model="form.password">
 
       <button id="login">Login</button>
       <button type="button" class="signup" v-on:click="handleSignup">Sign Up</button>
     </form>
   </div>
</template>
<script>
import axios from 'axios';

export default
{
   name:"LoginPage",
   data()
   {
       return{

           form:{
               email:"",
               password:""
           }
       }
   },
   methods:{
       handleSignup(){
           this.$router.push("/signup")
       },
      async handleLogin(){
       let user = await axios.get(`http://localhost:3000/users?email=${this.form.email}&password=${this.form.password}`)
       if(user.status==200 && user.data.length>0) 
       {
           localStorage.setItem("user-info",JSON.stringify(user.data))
           this.$router.push("/admin")
       }  
       else
       {
           alert("bad credentials")
       } 
       
   }
   }
}
</script>
<style >
.signup{
   transition: background-color 0.3s;
   background-color: #33b533;
}
.signup:hover{
   background-color: #1c7e1ccf;
}
</style>