<template>
<div>
    <form v-on:submit.prevent="handleSignup" class="signup-form">
        <h2>Admin Page - Add Room</h2>

        <input type="text" v-model="form.roomName" placeholder="Room Name" required v-on:change="handleChange" />

        <input type="text" v-model="form.capacity" placeholder="Capacity" required />

        <input type="text" v-model="form.location" placeholder="Location" required />

        <input type="date" v-model="form.date" :min="currentDate" placeholder="Date" required />

        <div class="checkbox-group">
            <label>
                <input type="checkbox" v-model="form.isAvailable" />
                Available
            </label>
        </div>

        <button type="submit">Create Room</button>
    </form>

    <div>
        <table class="room-table">
            <thead>
                <tr>
                    <th>Booked By</th>
                    <th>Room Name</th>
                    <th>Capacity</th>
                    <th>Location</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                <!-- Display only rooms booked on the selected date -->
                <tr v-for="room in filteredRooms" :key="room.id">
                    <td>{{ admin }}</td>
                    <td>{{ room.roomName }}</td>
                    <td>{{ room.capacity }}</td>
                    <td>{{ room.location }}</td>
                    <td>{{ room.date }}</td>
                </tr>
            </tbody>
        </table>
    </div>

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
                date: '',
                isAvailable: true,
            },
            currentDate: new Date().toISOString().split("T")[0],
            roomNames: [],
            rooms: [],
            admin: ""
        };
    },
    computed: {
        // Filter rooms based on the selected date
        filteredRooms() {
            return this.rooms.filter(room => room.date === this.form.date);
        }
    },
    methods: {
        async handleChange() {
            let result = await axios.get("http://localhost:3000/rooms");
            console.log(result.data);

            let rooms = result.data.map((e) => this.normalizeRoomName(e.roomName));
            this.roomNames = rooms;
            console.log(this.roomNames);

            let enteredRoomName = this.normalizeRoomName(this.form.roomName);

            for (let roomName of this.roomNames) {
                if (enteredRoomName === roomName) {
                    alert("Room name already exists");
                    this.form.roomName = "";
                    return;
                }
            }

            this.form.roomName = enteredRoomName;
            console.log("Room name to be saved:", this.form.roomName);
        },
        normalizeRoomName(name) {
            name = name.toLowerCase().replace(/\s|_/g, "");
            if (/^\d+$/.test(name)) {
                name = "room" + name;
            }
            return name;
        },

        handleSignup() {
            axios.post('http://localhost:3000/rooms', this.form)
                .then(response => {
                    console.log('Room created:', response.data);
                    alert("Room created");
                    this.form = "";
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
    async mounted() {
        let user = JSON.parse(localStorage.getItem("user-info"));
        this.admin = user[0].name;
        if (user[0].role !== "admin") {
            this.$router.push("/employee");
        }

        let result = await axios.get("http://localhost:3000/rooms");
        this.rooms = result.data;
        console.log(this.rooms);
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

.logout-button {
    width: 10%;
    padding: 12px;
    background-color: #d32f2f;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;

    display: block;
    margin: 2.5rem auto 3rem;
}

.logout-button:hover {
    background-color: #b71c1c;
}

/* Table Styling */
.room-table {
    width: 80%;
    margin-top: 2rem;
    margin: auto;
    border-collapse: collapse;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.room-table th,
.room-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

.room-table th {
    background-color: #0277bd;
    color: white;
    font-weight: bold;
}

.room-table tbody tr:nth-child(odd) {
    background-color: #f2f2f2;
}

.room-table td {
    font-size: 14px;
    color: #333;
}
</style>
