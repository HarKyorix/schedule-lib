export class YearView {
  constructor(calendar) {
    this.eventManager = calendar.eventManager;
    this.langManager = calendar.langManager;
    this.editable = calendar.editable;
    this.calendar = calendar;
  }

  render() {
    const yearView = document.getElementById('year-view');
    yearView.innerHTML = ''; // Clear existing content

    const months = this.langManager.getMonths();
    const weekDays = this.langManager.getWeekDays();
    const yearGrid = document.createElement('div');
    yearGrid.className = 'year-grid';

    months.forEach((month, index) => {
      const monthContainer = document.createElement('div');
      monthContainer.className = 'month-container';

      const monthHeader = document.createElement('h4');
      monthHeader.textContent = month;
      monthContainer.appendChild(monthHeader);

      // Header for days of the week
      const weekHeader = document.createElement('div');
      weekHeader.className = 'week-header';
      weekDays.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.textContent = day;
        weekHeader.appendChild(dayElement);
      });
      monthContainer.appendChild(weekHeader);

      const monthDays = this.calendar.getDaysInMonth(index, this.calendar.currentYear);
      const monthGrid = document.createElement('div');
      monthGrid.className = 'month-grid';

      // Add empty days before the first day of the month
      const firstDayOfMonth = new Date(this.calendar.currentYear, index, 1).getDay();
      for (let i = 0; i < firstDayOfMonth; i++) {
        monthGrid.appendChild(document.createElement('div')); // Empty cells
      }

      monthDays.forEach(day => {
        const date = new Date(this.calendar.currentYear, index, (day+1)).toISOString().split('T')[0];
        const events = this.eventManager.getEvents(date);
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-date';
        if (events.length > 0) {
          dayElement.classList.add('has-event');
          if (this.editable) {
            dayElement.style.cursor = 'move';  
            dayElement.setAttribute('draggable', 'true')
          }
        } 
        if (date === new Date().toISOString().split('T')[0]) {
          dayElement.classList.add('current-date');
        }
        if (date === this.calendar.currentDate.toISOString().split('T')[0]) {
          dayElement.classList.add('selected-date');
        }
        dayElement.dataset.date = date;
        dayElement.textContent = day;

        monthGrid.appendChild(dayElement);
      });

      // Add empty days after the last day of the month
      const lastDayOfMonth = new Date(this.calendar.currentYear, index + 1, 0).getDay();
      for (let i = lastDayOfMonth; i < 6; i++) {
        monthGrid.appendChild(document.createElement('div')); // Empty cells
      }
      
      monthContainer.appendChild(monthGrid);
      yearGrid.appendChild(monthContainer);
    });

    yearView.appendChild(yearGrid);
  }  
  createEventMap() {
    const year = this.calendar.currentDate.getFullYear();
    let allEvents = this.eventManager.getAllEventsForYear(year);
    
    return allEvents;
  }
}