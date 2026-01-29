document.addEventListener("DOMContentLoaded", () => {

    const submitSchedule = document.getElementById("submitSchedule");

    submitSchedule.addEventListener("click", (e) => {
        e.preventDefault();
        buildSchedule();
    });

    function parseTimeToHour(timestring) {
        const [hours, minutes] = timestring.split (":").map(Number);
        return hours + minutes / 60;
    }


    function buildSchedule() {
        const schoolStart = parseTimeToHour(document.getElementById("schoolstart").value);
        const schoolEnd = parseTimeToHour(document.getElementById("schoolend").value);
        const workStart = parseTimeToHour(document.getElementById("workstart").value);
        const workEnd = parseTimeToHour(document.getElementById("workend").value);
        const wantsStudy = document.getElementById("classstudy").value === "yes";
        const studyHours = wantsStudy ? Number(document.getElementById("studyhours").value) : 0;
        
        const assignmentDiv = document.querySelectorAll("#due div");
        const assignments = [];
        
        assignmentDiv.forEach((div, index) => {
            const dateinput = div.querySelector('input[type="date"]');
            const hoursinput = div.querySelector('input[type="number"]');
            
            if (dateinput && hoursinput) {
                assignments.push({
                    name: `Assignment ${index + 1}`,
                    due: new Date(dateinput.value),
                    remaining: Number(hoursinput.value) * 60
                });
            }   
        });

        
        const schedule = generateSchedule(assignments, studyHours, schoolStart, schoolEnd, workStart, workEnd);
        localStorage.setItem("Schedule", JSON.stringify(schedule));
        localStorage.setItem("schoolStart", schoolStart);
        localStorage.setItem("schoolEnd", schoolEnd);
        localStorage.setItem("workStart", workStart);
        localStorage.setItem("workEnd", workEnd);
        
        window.location.href = "calender.html";
    }

    function generateSchedule(assignments, studyHours, schoolStart, schoolEnd, workStart, workEnd) {
        const schedule = {};
   

        assignments.sort((a,b) => a.due - b.due);
        let assignmentIndex = 0;

        const daysToBuild = 90;
        for (let x = 0; x < daysToBuild; x++) {
            const day = new Date();
            day.setDate(day.getDate() + x);
            const key = day.toISOString().split("T")[0];

            schedule[key] = { tasks: [] };
    
            schedule[key].tasks.push({
                name: "School",
                startHour: schoolStart,
                minutes: (schoolEnd - schoolStart) * 60,
                type: "school"
            });
        

            const workPeriods = [];
            
            if (workStart < schoolStart) {
                workPeriods.push([workStart, Math.min(workEnd, schoolStart)]);
            }

            if (workEnd > schoolEnd) {
                workPeriods.push([Math.max(workStart, schoolEnd), workEnd]);
            }

            workPeriods.forEach(([start, end]) => {
                let currentHour = start;
                let remainingMinutes = (end - start) * 60;
    
                if (studyHours > 0 && remainingMinutes >= studyHours * 60) {
                    schedule[key].tasks.push({
                        name:"Study",
                        startHour: currentHour,
                        minutes: studyHours * 60,
                        type: "Study"
                    });

                    currentHour += studyHours;
                    remainingMinutes -= studyHours * 60;
                }

                while (
                    assignmentIndex < assignments.length &&
                    remainingMinutes > 0
                ) {
                    const assa = assignments[assignmentIndex];
                    const chunk = Math.min (assa.remaining, remainingMinutes);

                    schedule[key].tasks.push({
                        name: assa.name,
                        startHour: currentHour,
                        minutes: chunk,
                        type: "Assignment"
                    });

                    assa.remaining -= chunk;
                    remainingMinutes -= chunk;
                    currentHour += chunk/ 60;

                    if (assa.remaining <=0) assignmentIndex++;
                }

                if (remainingMinutes > 0) {
                    schedule[key].tasks.push({
                        name: "Free time",
                        startHour: currentHour,
                        minutes: remainingMinutes,
                        type: "Free time"
                    })
                }
            });
        }
        return schedule;
    }

});
