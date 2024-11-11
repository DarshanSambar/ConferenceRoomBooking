import { createRouter, createWebHistory } from "vue-router";
import SignUp from "./components/SignUp.vue";
import LoginPage from "./components/LoginPage.vue";
import HomePage from "./components/HomePage.vue";
import AdminPage from "./components/AdminPage.vue"
import EmployeePage from "./components/EmployeePage.vue"
import CalendarPage from "./components/CalendarPage.vue";


const routes = [
    {
        name: "HomePage",
        component: HomePage,
        path: "/"
    },
    {
        name:"SignUp",
        component:SignUp,
        path:"/signup"
    },
    {
        name: "LoginPage",
        component: LoginPage,
        path: "/login"
    },
    {
        name: "AdminPage",
        component: AdminPage,
        path: "/admin"
    },
    {
        name: "EmployeePage",
        component: EmployeePage,
        path: "/employee"
    },
    {
        name: "CalendarPage",
        component: CalendarPage,
        path: "/calendar"
    },
   


];

const router = createRouter({
    history: createWebHistory(),  
    routes
});

export default router;
