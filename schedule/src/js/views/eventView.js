export class EventView {
  constructor(calendar) {
    this.eventManager = calendar.eventManager;
    this.langManager = calendar.langManager;
    this.editable = calendar.editable;
    this.calendar = calendar;
    
    this.eventView = document.getElementById('event-view');
    this.eventView.style.display = 'none';
  }

  detailEvent(date, id) {
    const event = this.eventManager.getEvent(date, id);    
    
    if (event) {
      this.showEventDetail(event);
      if (this.editable) {
        this.initEventListeners(date, event);
      }
    }
  }

  renderEvents(allEvents) {
    this.eventView.className = 'col-4 p-2';
    this.eventView.style.display = 'block'; // Afficher la div de détail de l'événement
    this.eventView.style.backgroundColor = "";
    this.eventView.innerHTML = `
      <h4 data-translate="EVENTS"></h4>      
      <button type="button" class="btn btn-light mb-3" id="btn-add" data-translate="ADD_EVENT">${this.langManager.translate('ADD_EVENT')}</button>
      <input 
        class="search form-control" 
        id="search" 
        type="search" 
        placeholder="${this.langManager.translate('SEARCH_PLACEHOLDER')}" 
        autocomplete="off"
      >
      <span class="close">&times;</span>
    `;

    if (typeof allEvents === 'object') {
      if (Object.keys(allEvents).length === 0) {
        this.eventView.innerHTML += `<p data-translate="NO_EVENTS">${this.langManager.translate('NO_EVENTS')}</p>`;
      } else {
        const dateContainer = document.createElement('div');
        dateContainer.className = 'date-container';
        if (this.calendar.viewManager.currentView == 'day') {
          const calendarDate = document.createElement('div');
          calendarDate.className = 'calendar-date';
          calendarDate.dataset.date = this.calendar.currentDate;
          allEvents.forEach(event => {
            const eventElement = this.createEventElement(this.calendar.currentDate, event);
            calendarDate.appendChild(eventElement);
          });
          dateContainer.appendChild(calendarDate);
          this.eventView.appendChild(dateContainer);
        } else {
          Object.keys(allEvents).forEach(date => {
            const events = allEvents[date];
            const calendarDate = document.createElement('div');
            calendarDate.className = 'calendar-date';
            calendarDate.dataset.date = date;

            const eventDateHeader = document.createElement('div');
            eventDateHeader.className = 'event-date-header';
            eventDateHeader.dataset.date = date;
            eventDateHeader.textContent = new Date(date).toLocaleDateString(this.langManager.lang, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
            calendarDate.appendChild(eventDateHeader);

            events.forEach(event => {
              const eventElement = this.createEventElement(date, event);
              calendarDate.appendChild(eventElement);
            });
            dateContainer.appendChild(calendarDate);
          });
          this.eventView.appendChild(dateContainer);
        }
      }
    } else {
      console.log('not an object');
    }
    this.initCloseListener();
    this.initAddListener();
    this.langManager.translateElements(); // Traduire les éléments après avoir rendu le contenu
    const eventItems = this.eventView.querySelectorAll('#event-view .event-item')
    this.eventView.querySelector('#search').addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      eventItems.forEach((item) => {
        const title = item.querySelector('.event-title').textContent.toLowerCase();
        const matches = title.includes(query);
        item.style.display = matches ? 'block' : 'none';
      });
    });
  }

  initAddListener() {
    const addBtn = this.eventView.querySelector('#btn-add');
    if (addBtn) {
      addBtn.addEventListener('click', () => 
        this.calendar.modalView.open(this.eventManager.formatDate(this.calendar.currentDate), this.calendar.defaultRefs));
    }
  }
  showEventDetail(event) {
    this.eventView.className = 'col-4 p-2';
    this.eventView.style.display = 'block';
    this.eventView.style.backgroundColor = event.color;
    this.eventView.style.color = '#fff';
    this.eventView.innerHTML = `
      <span class="close">&times;</span>
      <button type="button" class="btn btn-light" id="btn-back" data-translate="BACK">${this.langManager.translate('BACK')}</button>

      <h4>${event.title}</h4>
      <p><strong>${this.calendar.capitalize(event?.type_ref)}</strong>: ${this.calendar.defaultRefs.find(el => el.id_ref == event?.id_ref)?.name}</p>
      <p><strong data-translate="DESCRIPTION">${this.langManager.translate('DESCRIPTION')}</strong> ${event.description}</p>
      <p><strong data-translate="DATE">${this.langManager.translate('DATE')}</strong> ${new Date(event.date).toLocaleDateString(this.langManager.lang, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
      <p>
        <strong data-translate="START">${this.langManager.translate('START')}</strong> ${event.start_hour}
        <strong data-translate="END">${this.langManager.translate('END')}</strong> ${event.end_hour}
      </p>
      <p><strong data-translate="RECURRENCE">${this.langManager.translate('RECURRENCE')}</strong>: ${event.recurrency_code}</p>
    `;
    if (this.editable) {
      this.eventView.innerHTML += `
        <button type="button" class="btn btn-danger" id="btn-delete" data-translate="DELETE">${this.langManager.translate('DELETE')}</button>
        <button type="button" class="btn btn-light" id="btn-update" data-translate="EDIT">${this.langManager.translate('EDIT')}</button>
        <button type="button" class="btn btn-light" id="btn-duplicate" data-translate="DUPLICATE">${this.langManager.translate('DUPLICATE')}</button>
      `;
    }
    this.initCloseListener();
    this.initBackListener()
    this.langManager.translateElements(); // Traduire les éléments après avoir rendu le contenu
  }

  createEventElement(date, event) {
    const eventElement = document.createElement('div');
    eventElement.className = 'event-item';
    eventElement.setAttribute('draggable', 'true');
    eventElement.style.backgroundColor = event.color;
    eventElement.dataset.date = date;
    eventElement.dataset.id = event.id;

    eventElement.innerHTML = `
      <div class="event-time">${event.start_hour} – ${event.end_hour}</div>
      <div class="event-title">${event.title}</div>
      <div class="event-description">${event.description}</div>
    `;
    
    // Attach event listeners after creating the element
    eventElement.querySelector('.event-time').addEventListener('click', () => this.detailEvent(date, event.id));
    eventElement.querySelector('.event-title').addEventListener('click', () => this.detailEvent(date, event.id));
    eventElement.querySelector('.event-description').addEventListener('click', () => this.detailEvent(date, event.id));
    return eventElement;
  }
  
  initCloseListener() {
    const closeBtn = this.eventView.querySelector('.close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.eventView.style.display = 'none');
    }
  }

  initBackListener() {
    const backBtn = this.eventView.querySelector('#btn-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => this.calendar.eventsView());
    }
  }

  initEventListeners(date, event) {
    this.eventView.querySelector('#btn-update').addEventListener('click', () => {
      this.calendar.modalView.edit(event, this.calendar.defaultRefs);
    });

    this.eventView.querySelector('#btn-duplicate').addEventListener('click', () => {
      this.calendar.trigger('duplicate', { date, event });
    });

    this.eventView.querySelector('#btn-delete').addEventListener('click', () => {
      this.calendar.modalView.showDeleteConfirmationModal(date, event);
    });
  }
}