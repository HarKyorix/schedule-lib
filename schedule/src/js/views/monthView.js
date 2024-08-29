export class MonthView {
  constructor(calendar) {
    this.eventManager = calendar.eventManager;
    this.langManager = calendar.langManager;
    this.editable = calendar.editable;
    this.calendar = calendar;
  }


  render() {
    const monthView = document.getElementById('month-view');
    monthView.innerHTML = ''; // Clear existing content

    const weekDays = this.langManager.getWeekDays();
    // Create and append week days header
    const weekDaysHeader = document.createElement('div');
    weekDaysHeader.className = 'week-header';
    weekDays.forEach(day => {
      const dayElement = document.createElement('div');
      dayElement.className = 'week-day';
      dayElement.textContent = day;
      weekDaysHeader.appendChild(dayElement);
    });
    monthView.appendChild(weekDaysHeader);

    // Get and display days of the month
    const monthDays = this.calendar.getDaysInMonth(this.calendar.currentMonthIndex, this.calendar.currentYear);
    const monthGrid = document.createElement('div');
    monthGrid.className = 'month-grid';

    // Add empty days before the first day of the month
    const firstDayOfMonth = new Date(this.calendar.currentYear, this.calendar.currentMonthIndex, 1).getDay();
    for (let i = 0; i < firstDayOfMonth; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'empty';
      monthGrid.appendChild(emptyCell); // Empty cells
    }

    // Create a mapping of date to events
    const eventMap = this.createEventMap();

    monthDays.forEach((day) => {
      const date = new Date(this.calendar.currentYear, this.calendar.currentMonthIndex, (day+1)).toISOString().split('T')[0];
      const events = eventMap[date] || [];
      const dayElement = document.createElement('div');
      dayElement.className = 'calendar-date';
      dayElement.innerHTML = `<span class="day-number">${day}</span>`;

      if (events.length > 0) {
        events.forEach(event => {
          const eventElement = document.createElement('div');
          eventElement.className = 'event-item';
          if (this.editable) {
            eventElement.style.cursor = 'move';  
            eventElement.setAttribute('draggable', 'true')
          }
          eventElement.style.backgroundColor = event.color; // Set event color
          eventElement.textContent = event.title; // Display the title of the event
          eventElement.dataset.date = date;
          eventElement.dataset.id = event.id;
          dayElement.appendChild(eventElement);
        });
      }

      if (date === new Date().toISOString().split('T')[0]) {
        dayElement.classList.add('current-date');
      }
      if (date === this.calendar.currentDate.toISOString().split('T')[0]) {
        dayElement.classList.add('selected-date');
      }
      dayElement.dataset.date = date;

      monthGrid.appendChild(dayElement);
    });

    // Add empty days after the last day of the month
    const lastDayOfMonth = new Date(this.calendar.currentYear, this.calendar.currentMonthIndex + 1, 0).getDay();
    for (let i = lastDayOfMonth; i < 6; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'empty';
      monthGrid.appendChild(emptyCell); // Empty cells
    }

    monthView.appendChild(monthGrid);
  }

  createEventMap() {
    const month = this.calendar.currentDate.getMonth();
    const year = this.calendar.currentDate.getFullYear();
    let allEvents = this.eventManager.getAllEventsForMonth(year, month);
    
    return allEvents;
  }
}