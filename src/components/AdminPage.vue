<template>
    <div>

      <form v-on:submit.prevent="handleSignup" class="signup-form">
        <h2>Admin Page - Add Room</h2>
      
      <input 
        type="text" 
        v-model="form.roomName" 
        placeholder="Room Name" 
        required 
        v-on:change="handleChange"
        />
        
      <input 
      type="text" 
        v-model="form.capacity" 
        placeholder="Capacity" 
        required 
      />
      
      <input 
        type="text" 
        v-model="form.location" 
        placeholder="Location" 
        required 
      />
      
      <div class="checkbox-group">
        <label>
          <input 
          type="checkbox" 
          v-model="form.isAvailable" 
          />
          Available
        </label>
      </div>
      
      <div v-if="!form.isAvailable" class="unavailable-section">
        <h3>Mark Room as Unavailable</h3>
        
        <label for="unavailableDate">Unavailable Date:</label>
        <input 
        type="date" 
        v-model="form.unavailableDate" 
          placeholder="Select Date" 
          required
          />
          
          <label for="startTime">Unavailable Time:</label>
          <div class="time-group">
            <input 
            type="time" 
            v-model="form.startTime" 
            required 
            />
            to
            <input 
            type="time" 
            v-model="form.endTime" 
            required 
            />
          </div>
      </div>
      
      <button type="submit">Create Room</button>
    </form>
    <button class="logout-button" @click="handleLogout">Logout</button>
  </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: "AdminPage",
    data() {
      return {
        form: {
          roomName: '',
          capacity: '',
          location: '',
          isAvailable: true, 
           
        },
        roomNames:[]
      };
    },
    methods: {
      async handleChange(){
        let result = await axios.get("http://localhost:3000/rooms")
        console.log(result.data)
        let rooms = result.data.map((e)=>e.roomName)
        this.roomNames=rooms
        console.log(this.roomNames)

        for(let roomName of this.roomNames)
      {
        if(this.form.roomName==roomName)
      {
        alert("roomName already exits")
        break;
      
      }
      }
        

      },
      handleSignup() {
        axios.post('http://localhost:3000/rooms', this.form)
          .then(response => {
            console.log('Room created:', response.data);
            alert("room created")
          })
          .catch(error => {
            console.error('There was an error creating the room:', error);
          });
      },
      handleLogout() {
      localStorage.removeItem("user-info");
      this.$router.push("/login"); 
    }
    },
    mounted(){
        let user =JSON.parse(localStorage.getItem("user-info"))
        if(user[0].role!="admin")
    {
        this.$router.push("/employee")
    }
        
    }
  };
  </script>
  
  <style scoped>
  .signup-form {
    max-width: 500px;
    margin: 4rem auto;
    padding: 3rem;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  input {
    width: 100%;
    padding: 10px;
    margin: 8px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    width: 100%;
    padding: 12px;
    background-color: #0277bd;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0772b1b3;
  }
  
  .checkbox-group {
    margin-bottom: 15px;
  }
  
  label {
    font-weight: normal;
  }
  
  .unavailable-section {
    margin-top: 20px;
    padding: 10px;
    background-color: #f7f7f7;
    border-radius: 5px;
  }
  
  .time-group {
    display: flex;
    gap: 5px;
  }
.signup-form {
  max-width: 500px;
  margin: 4rem auto;
  padding: 3rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.logout-button {
  width: 100%;
  padding: 12px;
  background-color: #d32f2f;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  max-width: 500px;
  display: block;
  margin: 20px auto 0;
}

.logout-button:hover {
  background-color: #b71c1c;
}
</style>