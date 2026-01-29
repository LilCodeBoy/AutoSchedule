document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("calendar-container");
    if (!container) return;
        
   
    let schedule;
    try {
        schedule = JSON.parse(localStorage.getItem("Schedule"));
    } catch {
        container.innerHTML = "<h2 style='color:red; text-align:center;'>Invalid schedule data</h2>";
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const monthsToShow = 3;

    

    for (let offset = 0; offset < monthsToShow; offset++) {
        const currentmonth = new Date(today.getFullYear(), today.getMonth() + offset, 1);
        const year = currentmonth.getFullYear();
        const month = currentmonth.getMonth();

        const monthname = currentmonth.toLocaleString('default',{month: 'long', year: 'numeric' });
        const firstday = new Date (year, month, 1).getDay();
        const DaysInMonth = new Date(year, month + 1, 0).getDate();
        const monthbox = document.createElement("div");
        monthbox.innerHTML = `<h3>${monthname}</h3>`;
        
        const grid = document.createElement("div");
        grid.className = "month-grid";
        
        ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach(day => {
            const header = document.createElement("div");
            header.className = "calendar-header-cell";
            header.textContent = day;
            grid.appendChild(header);
        });

        const currentDay = today.getDay();
        const difftomonday = currentDay === 0 ? -6 : 1 -currentDay;
        const monday = new Date(today);
        monday.setDate(today.getDate() + difftomonday);
        monday.setHours(0,0,0,0);
        
        let Startoffset = firstday === 0 ? 6 : firstday - 1;
        for (let x = 0; x < firstday; x++) {
            const empty = document.createElement("div");
            empty.className = "empty-cell";
            grid.appendChild(empty);
        }

        for (let day = 1; day <= DaysInMonth; day++) {

        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const tasks = schedule[dateKey]?.tasks || [];
        
        const box = document.createElement("div");
        box.className = "calendar-box";

        const numberday = document.createElement("div");
        numberday.className = "number-day";
        numberday.textContent = day
        box.appendChild(numberday);

            tasks.sort((a,b) => a.startHour - b.startHour);
            tasks.forEach(task => {
                const minutes = task.minutes || 0;
                const hours = Math.floor(minutes / 60);
                const mins = minutes % 60;
                const duration = hours > 0? `${hours}h${mins > 0 ? mins + 'm' : ''}` : mins > 0 ? `${mins}m`: '';
                const timestructure = formatTime(task.startHour);
                const endtime = task.startHour + (minutes / 60);
                const endstructure = formatTime(endtime);
                const taskbox = document.createElement("div");
                taskbox.className = `task-item ${(task.type || 'other').toLowerCase()}`;
                taskbox.innerHTML = `${task.name}<br>${timestructure} - ${endstructure} (${duration})`;
                box.appendChild(taskbox);  
            });
                grid.appendChild(box);
        }
        monthbox.appendChild(grid);
        container.appendChild(monthbox);
    }
    function formatTime(hourDecimal) {
        const h = Math.floor(hourDecimal);
        const m = Math.round((hourDecimal - h) * 60);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;        
    }
});
    