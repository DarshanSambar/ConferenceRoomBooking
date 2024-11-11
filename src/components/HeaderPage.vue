<template>
    <header>
      <nav class="navbar">
        <div class="logo">
          <h1>MyApp</h1>
        </div>
        <div class="nav-links">
          <router-link to="/employee" class="nav-link">Employee Page</router-link>
          <router-link to="/calendar" class="nav-link">Calendar Page</router-link>
        </div>
        <button @click="logout" class="logout-button">Logout</button>
      </nav>
    </header>
  </template>
  
  <script>
  export default {
    name: "HeaderPage",
    methods: {
      logout() {
        localStorage.clear();
        alert("You have been logged out.");
        this.$router.push("/login");
      }
    }
  };
  </script>
  
  <style scoped>
  /* Basic reset */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  header {
    width: 100%;
    background-color: #2C3E50;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    overflow: hidden;
  }
  
  .navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;
    max-width: 100%;
    margin: auto;
    background-color: #34495e;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
  }
  
  .logo h1 {
    color: #ecf0f1;
    font-size: 1.5rem;
    font-weight: bold;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  }
  
  .nav-links {
    display: flex;
    gap: 1.5rem;
  }
  
  .nav-link {
    color: #ecf0f1;
    text-decoration: none;
    font-size: 1rem;
    font-weight: 500;
    padding: 0.5rem 0.8rem;
    position: relative;
    transition: color 0.3s ease, background-color 0.3s ease;
    border-radius: 6px;
  }
  
  .nav-link::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0%;
    height: 2px;
    background-color: #3498db;
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }
  
  .nav-link:hover {
    color: #3498db;
    background-color: rgba(52, 152, 219, 0.15);
    box-shadow: 0px 2px 5px rgba(52, 152, 219, 0.3);
  }
  
  .nav-link:hover::before {
    width: 100%;
  }
  
  .logout-button {
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 0.5rem 1.2rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0px 4px 6px rgba(231, 76, 60, 0.3);
  }
  
  .logout-button:hover {
    background-color: #c0392b;
    box-shadow: 0px 4px 10px rgba(231, 76, 60, 0.5);
  }
  </style>
  