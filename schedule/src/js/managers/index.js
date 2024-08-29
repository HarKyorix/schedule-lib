import { ViewManager } from "../views/index.js";
import { EventManager } from "./eventManager.js";
import { LangManager } from "./langManager.js";

import { ModalView } from "../views/modalView.js";
import { YearView } from "../views/yearView.js";
import { MonthView } from "../views/monthView.js";
import { WeekView } from "../views/weekView.js";
import { DayView } from "../views/dayView.js";;
import { EventView } from "../views/eventView.js";
import { CheckboxView } from "../views/checkboxView.js";

export class Schedule {
  constructor({containerId = 'schedule', defaultView = 'month', defaultLang = 'en', editable = false, checkboxes = {list: [], name: ''}, events = []}) {
    if (!document.getElementById(containerId)) {
      let container = document.createElement('div');
      container.id = containerId;
      document.body.appendChild(container);
    }

    this.editable = editable;
    this.clickTimeout = null;
    this.currentDate = new Date();
    this.defaultRefs = [];
    

    this.langManager = new LangManager();
    this.eventManager = new EventManager();

    this.viewManager = new ViewManager({containerId, defaultView, defaultLang}, this); 
    this.modalView = new ModalView(containerId, this);



    if (events.length != 0) {
      this.eventManager.addEvents(events);
    }

    this.initViews();
    this.checkboxView = new CheckboxView(checkboxes, this);

    if (checkboxes.list.length > 0 ) {
      this.checkboxView.init();
    } else {
      this.updateView()
    }
  }

  initViews() {
    this.updateCurrentDateInfo();

    this.yearView = new YearView(this);
    this.monthView = new MonthView(this);
    this.weekView = new WeekView(this);
    this.dayView = new DayView(this);
    this.eventView = new EventView(this);
    
    this.initEventListeners();
  }

  updateCurrentDateInfo() {
    this.currentYear = this.currentDate.getFullYear();
    this.currentMonthIndex = this.currentDate.getMonth();
    this.currentMonthName = new Date(this.currentYear, this.currentMonthIndex).toLocaleString(this.langManager.lang, { year: 'numeric', month: 'long' });
    this.currentWeekRange = this.getWeekRange(this.langManager.lang, this.currentDate);
    this.currentDay = this.currentDate.toLocaleString(this.langManager.lang, { year: 'numeric', month: 'long', weekday: 'long', day: 'numeric' });
  }
  updateView() {
    const viewTitleElement = document.getElementById('current-view-title');
    this.updateCurrentDateInfo();
    
    switch (this.viewManager.currentView) {
      case 'year':
        this.yearView.render();
        viewTitleElement.textContent = `${this.currentYear}`;
        break;
      case 'month':
        this.monthView.render();
        viewTitleElement.textContent = `${this.currentMonthName}`;
        break;
      case 'week':
        this.weekView.render();
        viewTitleElement.textContent = `${this.currentWeekRange}`;
        break;
      case 'day':
        this.dayView.render();
        viewTitleElement.textContent = `${this.currentDay}`;
        break;
    }
    if (document.getElementById('event-view').style.display == "block") {
      this.eventsView()
    } else {
      this.updateViewEvents()
    }
  }

  eventsView () {
    switch (this.viewManager.currentView) {
      case 'year':
        this.eventView.renderEvents(this.yearView.createEventMap());
        break;
      case 'month':
        this.eventView.renderEvents(this.monthView.createEventMap());
        break;
      case 'week':
        this.eventView.renderEvents(this.weekView.createEventMap());
        break;
      case 'day':
        this.eventView.renderEvents(this.dayView.createEventMap());
        break;
    }
    this.updateViewEvents()
  }
    
  updateViewEvents() {    
    const eventElements = document.querySelectorAll(`.event-item`);

    if (this.defaultRefs.length > 0) {
      const refEvents = this.eventManager.getRefEvents(this.defaultRefs);

      eventElements.forEach(element => {
        const date = element.getAttribute('data-date');
        const id = element.getAttribute('data-id');

        if (refEvents.find(event => (date == event.date && id == event.id))) {     
          element.style.display = 'block';
        } else {
          element.style.display = 'none';
        }
      });
    } else {
      eventElements.forEach(element => {
        element.style.display = 'none';
      });
    }
  }
  navigate(direction) {
    const currentDate = this.currentDate;
    switch (direction) {
      case 'prev-day':
        this.currentDate.setDate(currentDate.getDate() - 1);
        break;
      case 'next-day':
        this.currentDate.setDate(currentDate.getDate() + 1);
        break;
      case 'prev':
        if (this.viewManager.currentView === 'year') {
          this.currentDate.setFullYear(currentDate.getFullYear() - 1);
        }
        if (this.viewManager.currentView === 'month') {
          this.currentDate.setMonth(currentDate.getMonth() - 1);
        }
        if (this.viewManager.currentView === 'week') {
          this.currentDate.setDate(currentDate.getDate() - 7);
        }
        if (this.viewManager.currentView === 'day') {
          this.currentDate.setDate(currentDate.getDate() - 1);
        }
        break;
      case 'next':
        if (this.viewManager.currentView === 'year') {
          this.currentDate.setFullYear(currentDate.getFullYear() + 1);
        }
        if (this.viewManager.currentView === 'month') {
          this.currentDate.setMonth(currentDate.getMonth() + 1);
        }
        if (this.viewManager.currentView === 'week') {
          this.currentDate.setDate(currentDate.getDate() + 7);
        }
        if (this.viewManager.currentView === 'day') {
          this.currentDate.setDate(currentDate.getDate() + 1);
        }
        break;
      case 'today':
        this.currentDate = new Date();
        break;
    }
    this.updateCurrentDateInfo();
    this.updateView();
  }

  initEventListeners() {
    document.getElementById('btn-events').addEventListener('click', () => {
      if (this.eventView.eventView.style.display == "none") {
        this.eventsView()
      } else {
        this.eventView.eventView.style.display = 'none'
      }
    });
    document.getElementById('btn-prev').addEventListener('click', () => this.navigate('prev'));
    document.getElementById('btn-next').addEventListener('click', () => this.navigate('next'));
    document.getElementById('btn-prev-day').addEventListener('click', () => this.navigate('prev-day'));
    document.getElementById('btn-next-day').addEventListener('click', () => this.navigate('next-day'));
    document.getElementById('btn-today').addEventListener('click', () => this.navigate('today'));
    
    document.addEventListener('click', (event) => {
      clearTimeout(this.clickTimeout);
      this.clickTimeout = setTimeout(() => {
        const date = event.target.dataset.date;
        const id = event.target.dataset.id;
        if (
            event.target.classList.contains('calendar-date') || 
            event.target.classList.contains('event-date-header')
          ) {
          this.handleSingleClick(new Date(date));
        }
        if (event.target.classList.contains('event-item')) {
          this.eventView.detailEvent(date, id);
        }
      }, 300);     
    })

    document.addEventListener('dblclick', (event) => {
      clearTimeout(this.clickTimeout);  
      if (this.editable) {    
        const hour = event.target.dataset.hour ? ('T'+((event.target.dataset.hour.length == 1) ? ('0'+event.target.dataset.hour) : event.target.dataset.hour)+':00') : '';
        const date = event.target.dataset.date+hour;
        const id = event.target.dataset.id;
        if (event.target.classList.contains('calendar-date')) {
          this.modalView.open(date, this.defaultRefs);
        }
        if (event.target.classList.contains('event-item')) {
          const event = this.eventManager.getEvent(date.split('T')[0], id);
          this.modalView.edit(event, this.defaultRefs);
        }
      } else {
        this.modalView.showEditableModal();
      }
    });

    if (this.editable) {
      document.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('event-item') || e.target.classList.contains('has-event')) {
          e.dataTransfer.setData('text/plain', JSON.stringify(e.target.dataset));
        }
      });
    
      document.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (e.target.classList.contains('calendar-date')) {
          e.target.style.border = '2px dashed #000';
        }
      });
    
      document.addEventListener('dragleave', (e) => {
        if (e.target.classList.contains('calendar-date')) {
          e.target.style.border = '';
        }
      });
    
      document.addEventListener('drop', async (e) => {
        e.preventDefault();
        if (e.target.classList.contains('calendar-date')) {
          const {date, id} = JSON.parse(e.dataTransfer.getData('text/plain'));
          const newDate = e.target.dataset.date;
          if (id) {
            if (e.target.dataset.hour) {
              const hour = e.target.dataset.hour;
              this.trigger('moveupdatehour', { date, id, newDate, hour });
            } else {
              this.trigger('move', { date, id, newDate });
            }
          } else {
            this.trigger('moves', { date, newDate });
          }
          e.target.style.border = '';
        }
      });
    }
  }
  
  handleSingleClick(date) {
    this.currentDate = date;
    this.updateCurrentDateInfo();
    if (this.viewManager.currentView === 'year') {
      this.viewManager.changeView('month');
    } else if (this.viewManager.currentView === 'month') {
      this.viewManager.changeView('week');
    } else if (this.viewManager.currentView === 'week') {
      this.viewManager.changeView('day');
    }
  }

  getDaysInMonth(month, year) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }

  getWeekDates() {
    const startDate = new Date(this.currentDate);
    startDate.setDate(this.currentDate.getDate() - this.currentDate.getDay());
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(new Date(startDate).toISOString().split('T')[0]);
      startDate.setDate(startDate.getDate() + 1);
    }
    return dates;
  }

  getWeekRange(lang, date) {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    const endOfWeek = new Date(date);
    endOfWeek.setDate(date.getDate() + (6 - date.getDay()));
    
    // Format dates according to the current language
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const startOfWeekFormatted = startOfWeek.toLocaleDateString(lang, options);
    const endOfWeekFormatted = endOfWeek.toLocaleDateString(lang, options);
    
    return `${startOfWeekFormatted} - ${endOfWeekFormatted}`;
  }

  getlistDateBetweenTwoDate(startDate, filterDay, endDate) {
    const dates = [];
    const dayOfWeek = this.langManager.getWeekDays();
  
    let currentDate = new Date(startDate);
    const end = new Date(endDate);
  
    while (currentDate <= end) {
      const currentDay = dayOfWeek[currentDate.getDay()];
      if (filterDay.includes(currentDay)) {
        dates.push({date: currentDate.toISOString().split('T')[0]});
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return dates;
  }

  splitIntoWeeks(month, year) {
    const daysInMonth = this.getDaysInMonth(month, year);
    const weeks = [];
    let currentWeek = [];
  
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      if (isNaN(date.getTime())) {
        console.error(`Invalid date: ${date}`);
        continue;
      }
      currentWeek.push(date);
      if (date.getDay() === 6 || i === daysInMonth) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
  
    return weeks;
  }

  getStartOfWeek(date) {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    return startOfWeek;
  }

  on(event, handler) {
    document.addEventListener(event, (e) => handler(e.detail));
  }

  trigger(event, detail) {
    const eventObj = new CustomEvent(event, { detail });
    document.dispatchEvent(eventObj);
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1) 
  }

}