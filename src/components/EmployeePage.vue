<template>
<div class="booking-page">
    <HeaderPage />
    <div class="content-container">
        <h1>Room Booking</h1>

        <div class="form-container">
            <select v-model="selectedRoom" @change="handleSelect" class="form-input">
                <option value="">Select a Room</option>
                <option v-for="room in rooms" :key="room.roomId" :value="room.id">{{ room.roomName }}</option>
            </select>

            <form @submit.prevent="handleSubmit" class="booking-form">
                <input type="text" v-model="form.roomId" readonly placeholder="Room ID" class="form-input" required />
                <input type="text" v-model="form.roomName" readonly placeholder="Room Name" class="form-input" required />
                <input type="text" v-model="form.capacity" readonly placeholder="Capacity" class="form-input" required />
                <input type="text" v-model="form.location" readonly placeholder="Location" class="form-input" required />
                <input type="date" v-model="form.bookingDate" @change="handleDate" class="form-input" :min="currentDate" required />

                <div class="time-inputs">
                    <div>
                        <label for="startTime">Start Time</label>
                        <input type="time" v-model="form.startTime" class="form-input" />
                    </div>
                    <div>
                        <label for="endTime">End Time</label>
                        <input type="time" v-model="form.endTime" class="form-input" />
                    </div>
                </div>

                <button type="submit" class="submit-button">Submit</button>

            </form>

        </div>

        <ul v-for="timeSlot in bookedSlots" :key="timeSlot.bookingId" class="booked-slot">
            <li class="booking-details">
                <p class="booking-date">{{ timeSlot.bookingDate }}</p>
                <div class="time-range">
                    <span class="start-time">{{ timeSlot.startTime }}</span> -
                    <span class="end-time">{{ timeSlot.endTime }}</span>
                </div>
            </li>
        </ul>

    </div>
</div>
</template>

<script>
import HeaderPage from './HeaderPage.vue';
import axios from 'axios';

export default {
    name: "BookingPage",
    components: {
        HeaderPage
    },
    data() {
        return {
            userId: "",
            userName: "",
            rooms: [],
            selectedRoom: "",
            form: {
                roomId: "",
                roomName: "",
                capacity: "",
                location: "",
                bookingDate: "",
                startTime: "",
                endTime: ""
            },
            currentDate: new Date().toISOString().split("T")[0],
            bookedSlots: [],
            count: 0
        };
    },
    methods: {
        async handleSelect() {
            alert("changed" + " " + this.selectedRoom)

            let result = await axios.get(`http://localhost:3000/rooms?id=${this.selectedRoom}`);

            if (this.count == 1) {
                this.handleDate()
            }
            if (result.status === 200) {
                this.count = 1;
                let roomObj = result.data[0];
                console.log(roomObj)
                this.form.roomId = roomObj.id;
                this.form.roomName = roomObj.roomName;
                this.form.capacity = roomObj.capacity;
                this.form.location = roomObj.location;
            }
        },

        async handleDate() {
            let result = await axios.get(`http://localhost:3000/bookings?roomId=${this.selectedRoom}&bookingDate=${this.form.bookingDate}`);
            alert("inside handleDate")
            console.log(this.selectedRoom)
            console.log(this.form.bookingDate)
            console.log(result)
            if (result.status === 200) {
                this.bookedSlots = result.data.map(e => ({
                    bookingId: e.id,
                    roomId: e.roomId,
                    bookingDate: e.bookingDate,
                    startTime: e.startTime,
                    endTime: e.endTime
                }));
            }
            console.log(this.bookedSlots)
        },

        async handleSubmit() {
            alert("clicked");

            if (this.form.endTime <= this.form.startTime) {
                alert("End time must be later than start time.");
                return;
            }

            const startTime = new Date(`1970-01-01T${this.form.startTime}:00`);
            const endTime = new Date(`1970-01-01T${this.form.endTime}:00`);
            const duration = (endTime - startTime) / (1000 * 60 * 60); // Duration in hours

            if (duration < 1) {
                alert("The booking must be for at least 1 hour.");
                this.form.startTime = "",
                    this.form.endTime = ""
                return;
            } else if (duration > 4) {
                alert("The booking cannot exceed 4 hours.");
                return;
            }

            const allowedStartTime = new Date(`1970-01-01T07:00:00`);
            const allowedEndTime = new Date(`1970-01-01T21:00:00`);

            if (startTime < allowedStartTime || endTime > allowedEndTime) {
                alert("Booking must be between 7:00 AM and 9:00 PM.");
                return;
            }

            const isAvailable = await this.checkAvailabilityWithBuffer(startTime, endTime);
            if (!isAvailable) {
                return; // Just return, don't reset the form
            }

            try {
                let result = await axios.post("http://localhost:3000/bookings", {
                    userId: this.userId,
                    roomId: this.form.roomId,
                    roomName: this.form.roomName,
                    capacity: this.form.capacity,
                    location: this.form.location,
                    bookedBy: this.userName,
                    bookingDate: this.form.bookingDate,
                    startTime: this.form.startTime,
                    endTime: this.form.endTime
                });

                if (result.status === 201) {
                    console.log(this.bookedSlots)
                    alert("Booking created successfully!");
                    this.form.bookingDate = ""
                    this.form.startTime = "";
                    this.form.endTime = "";
                    this.bookedSlots = []; // Clear booked slots
                }
            } catch (error) {
                alert("Failed to create booking. Please try again.");
            }
        },

        async checkAvailabilityWithBuffer(startTime, endTime) {
            try {
                let result = await axios.get(`http://localhost:3000/bookings`, {
                    params: {
                        roomId: this.form.roomId,
                        bookingDate: this.form.bookingDate
                    }
                });

                if (result.data.length === 0) {
                    alert("Room is available for booking.");
                    this.bookedSlots = result.data.map(booking => ({
                        bookingDate:booking.bookingDate,
                        startTime: booking.startTime,
                        endTime: booking.endTime
                    }));
                    return true;
                }

                this.bookedSlots = result.data.map(booking => ({
                    bookingDate:booking.bookingDate,
                    startTime: booking.startTime,
                    endTime: booking.endTime
                }));

                const bufferTime = 10 * 60 * 1000;

                for (let slot of this.bookedSlots) {
                    let slotStart = new Date(`1970-01-01T${slot.startTime}:00`);
                    let slotEnd = new Date(`1970-01-01T${slot.endTime}:00`);

                    let slotEndWithBuffer = new Date(slotEnd.getTime() + bufferTime);
                    let slotStartWithBuffer = new Date(slotStart.getTime() - bufferTime);

                    if (
                        (startTime < slotEndWithBuffer && startTime >= slotStartWithBuffer) ||
                        (endTime > slotStartWithBuffer && endTime <= slotEndWithBuffer) ||
                        (startTime <= slotStartWithBuffer && endTime >= slotEndWithBuffer)
                    ) {
                        alert(`Room is already booked or there's a buffer conflict of 10 min with another booking.`);
                        this.startTime="",
                        this.endTime=""
                        return false;
                    }
                }

                alert("Room is available for booking.");
                return true;

            } catch (error) {
                console.error("Error checking room availability:", error);
                alert("An error occurred. Please try again.");
                return false;
            }
        },
    },

    async mounted() {

        const savedFormData = JSON.parse(localStorage.getItem('bookingFormData'));
        if (savedFormData) {
            this.form = savedFormData;
        }
        let user = JSON.parse(localStorage.getItem("user-info"));
        this.userId = user[0].id;
        this.userName = user[0].name;
        let result = await axios.get("http://localhost:3000/rooms");
        if (result.status === 200) {
            this.rooms = result.data;
        }
    }
};
</script>

<style scoped>
/* Page background */
.booking-page {
    background-color: #f4f7fc;

    font-family: 'Arial', sans-serif;
}

/* Content container */
.content-container {
    width: 100%;
    max-width: 900px;
    margin: 4rem auto 0;
    padding: 1rem;
    padding-bottom: 10px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h1 {
    text-align: center;
    font-size: 2rem;
    color: #34495e;
    margin-bottom: 1rem;
}

.form-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-input {
    padding: 0.8rem;
    margin-bottom: 0.8rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 1rem;
    width: 100%;
    box-sizing: border-box;
}

.form-input:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
}

.time-inputs {
    display: flex;
    gap: 2rem;
}

label {
    font-size: 0.9rem;
    color: #34495e;
    margin-bottom: 0.5rem;
}

button.submit-button {
    margin-top: 1rem;
    padding: 0.8rem;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button.submit-button:hover {
    background-color: #2980b9;
}

.booked-slot {
    list-style-type: none;
    margin-bottom: 1rem;
    padding: 1rem;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.booking-details {
    font-family: Arial, sans-serif;
    color: #34495e;
}

.booking-date {
    font-weight: bold;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
}

.time-range {
    font-size: 1rem;
    color: #3498db;
}

.start-time,
.end-time {
    padding: 0.2rem;
}
</style>
