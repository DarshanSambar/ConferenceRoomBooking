<template>
<div>

    <HeaderPage></HeaderPage>
    <div class="calendar-container">
        <h1 class="calendar-title">Conference Calendar</h1>

        <div class="demo-app-main">
            <FullCalendar class="demo-app-calendar" :options="calendarOptions">
                <template v-slot:eventContent="arg">
                    <div class="event-content">
                        <b>{{ arg.timeText }}</b>
                        <i>{{ arg.event.title }} ({{ arg.event.extendedProps.endTime }})</i>
                    </div>
                </template>
            </FullCalendar>
        </div>
    </div>
</div>
</template>

<script>
import HeaderPage from './HeaderPage.vue';
import axios from 'axios';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default {
    name: "CalendarPage",
    components: {
        FullCalendar,
        HeaderPage
    },
    data() {
        return {
            userId: "",
            bookedSlots: [],
            calendarOptions: {
                plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                },
                initialView: 'dayGridMonth',
                events: [],
                editable: false,
                selectable: false,
                eventDisplay: 'auto',
                displayEventEnd: true,
                dayMaxEvents: 1,
                eventTimeFormat: {
                    hour: '2-digit',
                    minute: '2-digit',
                    meridiem: false
                }
            },
        };
    },
    mounted() {
        let user = JSON.parse(localStorage.getItem("user-info"))

        console.log(user)

        this.userId = user[0].id
        console.log(user[0].id)
        this.fetchBookings();
    },
    methods: {
        async fetchBookings() {
            try {
                const response = await axios.get(`http://localhost:3000/bookings?userId=${this.userId}`);
                if (response.status === 200) {
                    this.bookedSlots = response.data;
                    this.calendarOptions.events = this.transformBookingsToEvents();
                }
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        },
        transformBookingsToEvents() {
            return this.bookedSlots.map(slot => ({
                title: `Room ${slot.roomId}`,
                start: `${slot.bookingDate}T${slot.startTime}`,
                end: `${slot.bookingDate}T${slot.endTime}`,
                extendedProps: {
                    endTime: slot.endTime
                }
            }));
        }
    }
}
</script>

<style scoped>
.calendar-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.calendar-title {
    font-size: 2rem;
    color: #2c3e50;
    font-weight: 600;
    margin-bottom: 20px;
}

.demo-app-main {
    width: 100%;
    max-width: 900px;
}

.event-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 5px;
    border-radius: 4px;
    background-color: #e1f5fe;
    color: #0277bd;
    font-size: 0.9rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.event-content b {
    font-weight: 600;
}

.event-content i {
    color: #01579b;
    font-style: normal;
}
</style>
