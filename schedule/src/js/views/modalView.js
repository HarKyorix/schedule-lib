export class ModalView {
  constructor(containerId, calendar) {
    this.container = document.getElementById(containerId);
    this.langManager = calendar.langManager;
    this.calendar = calendar;
    if (calendar.editable) {
      this.createModal();
      this.deleteConfirmationModal();
    } else {
      this.editableModal()
    }
    this.eventData = {};
    this.chevron = false;
    this.action = '';
  }


  createModal() {
    const modalHtml = `
      <div id="event-modal" class="modal">
        <div class="modal-content">
          <span class="close">&times;</span>
          <h4 id="title-modal" data-translate="ADD_EVENT"></h4>
          
          <form class="col-12" id="event-form">

            <div class="col-12 row nowrap mb-3">
              <div class="col-2">
                <label for="event-color" class="form-label" data-translate="EVENT_COLOR"></label>
                <input type="color" id="event-color" value="#153e43" class="form-control">
              </div>

              <div class="col ms-3">
                <label for="event-ref" class="form-label" data-translate="EVENT_REF"></label>
                <select id="event-ref" class="form-control" required></select>
              </div>
            </div>

            <div class="col-12 mb-3">
              <label for="event-title" class="form-label" data-translate="EVENT_TITLE"></label>
              <input type="text" id="event-title" class="form-control" required>
            </div>

            <div class="col-12 mb-3">
              <label for="event-description" class="form-label" data-translate="EVENT_DESCRIPTION"></label>
              <textarea id="event-description" class="form-control"></textarea>
            </div>

            <div class="col-12 row nowrap mb-3">
              <div class="col-6">
                <label for="event-start-hour" class="form-label" data-translate="START_HOUR"></label>
                <input type="time" id="event-start-hour" class="form-control" required>
              </div>
              
              <div class="col-6 ms-3">
                <label for="event-end-hour" class="form-label" data-translate="END_HOUR"></label>
                <input type="time" id="event-end-hour" class="form-control" required>
              </div>
            </div>

            <div class="col-12 mb-3">
              <button type="button" id="recurrence" class="float-end me-3 mb-3"></button>
              <div id="recurrenceEvents" class="col-12"></div>
            </div>
            
            <div class="row">
              <button id="cancel" type="button" class="btn btn-secondary" data-translate="CANCEL"></button>
              <button type="submit" class="btn btn-light" data-translate="SAVE"></button>
            </div>

          </form>
        </div>
      </div>
    `;
    this.container.insertAdjacentHTML('beforeend', modalHtml);
    this.initElements();
    this.initEventListeners();
  }
  
  initElements() {
    this.modalElement = this.container.querySelector('#event-modal');
    this.title = this.container.querySelector('#title-modal');
    this.cancel = this.modalElement.querySelector('#cancel');
    this.closeButton = this.modalElement.querySelector('.close');
    this.recurrence = this.modalElement.querySelector('#recurrence');
    this.recurrenceEvents = this.modalElement.querySelector('#recurrenceEvents');
    this.form = this.modalElement.querySelector('#event-form');
  }

  initEventListeners() {
    this.closeButton.addEventListener('click', () => this.close());
    this.cancel.addEventListener('click', () => this.close());
    this.recurrence.addEventListener('click', () => this.recurrenceEvent(!this.chevron));

    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.handleSubmit(); 
    });
  }

  selectRefs(defaultRefs) {  
    const elementHtml = this.modalElement.querySelector('#event-ref');

    elementHtml.innerHTML = `
      <option value="" disabled selected>${this.langManager.translate('SELECT_OPTION')}</option>
      ${ defaultRefs.map(item => (`
        <option value='${JSON.stringify({id_ref: item.id_ref, type_ref: item.type_ref})}'>
          ${item.type_ref} - ${item.name}
        </option>
      `)) }
    `;
  }

  checkboxEventDays(dayOfWeek) {  
    return dayOfWeek.map(day => `
      <label class="form-check-label me-2">
        <input type="checkbox" class="form-check-input" value="${day}"> 
        ${this.langManager.translate(day)}
      </label>
    `).join('');
  }

  recurrenceEvent(state) {
    let date = '';
    if (this.form.querySelector('#event-date')) {
      date = this.form.querySelector('#event-date').value;
    }

    let limit = '';
    if (this.form.querySelector('#event-limit')) {
      limit = this.form.querySelector('#event-limit').value;
    }

    if(state == true && this.eventData.recurrency_code == null) {
      this.recurrenceEvents.innerHTML = `
        <div class="col-12 row nowrap mb-3 clearfix">
          <div class="col-6">
            <label for="event-date" class="form-label">${this.langManager.translate('DATE')}</label>
            <input type="date" id="event-date" value="${date}" class="form-control" required>
          </div>
          <div class="col-6 ms-3">
            <label for="event-limit" class="form-label">${this.langManager.translate('LIMIT_UNTIL')}</label>
            <input type="date" id="event-limit" value="${limit}" class="form-control" required>
          </div>
        </div>
        <div class="col-12 mb-3">
          <label class="form-label">${this.langManager.translate('DAYS_OF_WEEK')}</label>
          <div id="event-days">
            ${ this.checkboxEventDays(this.langManager.getWeekDays()) }
          </div>
        </div>
      `;
      this.recurrenceEvents.querySelectorAll('.form-check-label').forEach(day => {
        day.onclick = () => {
          const input = day.querySelector('.form-check-input').checked;
          if (input) {
            day.className = 'form-check-label me-2 selected';
          } else {
            day.className = 'form-check-label me-2';
          }
        };
      });
    } else {
      this.recurrenceEvents.innerHTML = `
        <div class="col-6 mb-3">
          <label for="event-date" class="form-label">${this.langManager.translate('DATE')}</label>
          <input type="date" id="event-date" value="${date}" class="form-control" ${state ? 'disabled' : ''} required>
        </div>
      `;
    }

    this.recurrence.innerHTML =`
      <span data-translate="RECURRENCE">${this.langManager.translate('RECURRENCE')}</span>
      ${
        this.eventData.recurrency_code == null ? 
          (state ? 
          `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-compact-up" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894z"/>
          </svg>`
          :
          `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-compact-down" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67"/>
          </svg>`
        )
      :
      `<input type="checkbox" ${state ? 'checked' : ''} id="recurrency_code">`
      }
    `;

    this.chevron = state;

  }
  open(date, defaultRefs) {
    this.action = 'create';
    this._prepareModal('ADD_EVENT', date, defaultRefs);
  }

  edit(event, defaultRefs) {
    this.action = 'update';
    this._prepareModal('UPDATE_EVENT', event.date, defaultRefs, event);
  }

  _prepareModal(action, date, defaultRefs, event = {}) {
    this.selectRefs(defaultRefs);
    this.langManager.translateElements(); // Traduire les éléments au moment de l'initialisation
    this.modalElement.style.display = 'block';
    this.title.innerHTML = this.langManager.translate(action);
    this.form.reset();

    const { 
      id = null, 
      color = '#153e43', 
      recurrency_code = null, 
      title = '', 
      description = '', 
      start_hour = '00:00', 
      end_hour = '01:00' 
    } = event;

    this.eventData = { id, last_date: event.date || null, recurrency_code };

    this.recurrenceEvent(false);

    this.form.querySelector('#event-color').value = color;
    this.form.querySelector('#event-date').value = date.split('T')[0];
    this.form.querySelector('#event-ref').value = event.id_ref ? JSON.stringify({ id_ref: event.id_ref, type_ref: event.type_ref }) : '';
    this.form.querySelector('#event-title').value = title;
    this.form.querySelector('#event-description').value = description;
    this.form.querySelector('#event-start-hour').value = date.split('T')[1] || start_hour;
    this.form.querySelector('#event-end-hour').value = date.split('T')[1] || end_hour;
  }

  close() {
      this.eventData = {};
      this.form.reset();
      this.modalElement.style.display = 'none';
  }

  handleSubmit() {
    const ref = JSON.parse(this.form.querySelector('#event-ref').value);

    const updatedEventData = {
      ...this.eventData,
      ...ref,
      title: this.form.querySelector('#event-title').value,
      description: this.form.querySelector('#event-description').value,
      color: this.form.querySelector('#event-color').value,
      start_hour: this.form.querySelector('#event-start-hour').value,
      end_hour: this.form.querySelector('#event-end-hour').value,
      date: this.form.querySelector('#event-date').value,
    };

    this.eventData = updatedEventData;

    switch (this.action) {
      case 'create':
        this.create();
        this.close();
        break;
      case 'update':
        this.update();
        this.close();
        break;
    
      default:
        break;
    }

  }
  create() {
    const days = Array.from(this.form.querySelectorAll('#event-days .form-check-input'))
        .filter(input => input.checked)
        .map(input => input.value);

    const limit = this.form.querySelector('#event-limit')?.value || null;
    if (days.length > 0 && limit) {
      delete this.eventData.id;
      this.eventData.recurrency_code = this.generateRandomCode();
      const dates = this.calendar.getlistDateBetweenTwoDate(this.eventData.date, days, limit);
      this.calendar.trigger('adds', dates.map(item => ({ ...this.eventData, ...item })));
    } else {
      delete this.eventData.id;
      this.calendar.trigger('add', this.eventData);
    }
  }
  update() {
    let last_date = (this.eventData.last_date && new Date(this.eventData.last_date).getTime() !== new Date(this.eventData.date).getTime()) ? this.eventData.last_date : null;
    delete this.eventData.last_date
    
    if(this.form.querySelector('#recurrency_code') && this.form.querySelector('#recurrency_code').checked){
      delete this.eventData.id;
      delete this.eventData.date;
      this.calendar.trigger('updaterecurrency', this.eventData);
    } else if (last_date) {
      this.calendar.trigger('moveupdate', { date: last_date, event: this.eventData });
    } else {
      this.calendar.trigger('update', this.eventData);
    }
  }
 
  deleteConfirmationModal() {
    const modalHtml = `
      <div id="deleteModal" class="modal"> 
        <div class="modal-content"> 
          <span class="close">&times;</span> 
        
          <div class="">
            <p class="mb-3" data-translate="DELETE_CONFIRMATION"></p> 
            <button type="button" id="deleteRecurrence" class="mb-3"></button>
          </div> 
          
          <div class="row">
            <button id="cancelDelete" class="btn btn-secondary" data-translate="CANCEL"></button>
            <button id="confirmDelete" class="btn btn-danger" data-translate="DELETE"></button> 
          </div> 
        </div> 
      </div>
    `;
    this.container.insertAdjacentHTML('beforeend', modalHtml);
  }

  showDeleteConfirmationModal(date, event) {
    const deleteModal = document.getElementById('deleteModal');
    deleteModal.style.display = 'block';
    const deleteRecurrence = document.getElementById('deleteRecurrence');
    if (event.recurrency_code != null) {
      deleteRecurrence.style.display = 'block';
      deleteRecurrence.innerHTML =`
        <label>
          <span data-translate="RECURRENCE">${this.langManager.translate('RECURRENCE')}</span>
          <input type="checkbox" id="">
        </label>
      `;
    
    } else {
      deleteRecurrence.style.display = 'none';
    }
    
    this.langManager.translateElements();
    
    // Add event listeners for confirm and cancel buttons
    document.getElementById('confirmDelete').addEventListener('click', () => {
      if (deleteRecurrence.querySelector('input') && deleteRecurrence.querySelector('input').checked) {
        this.calendar.trigger('removerecurrence', event);
      } else {
        this.calendar.trigger('remove', { date, event });
      }
      
      deleteModal.style.display = 'none';
    });
  
    document.getElementById('cancelDelete').addEventListener('click', () => {
      deleteModal.style.display = 'none';
    });
  
    // Add event listener to the modal close button
    deleteModal.querySelector('#deleteModal .close').addEventListener('click', () => {
      deleteModal.style.display = 'none';
    });
  }

  editableModal() {
    const modalHtml = `
      <div id="editableModal" class="modal"> 
        <div class="modal-content"> 
          <span class="close">&times;</span> 
          <p class="mb-3" data-translate="EDIT_CONFIRMATION"></p> 
          <div class="row">
            <button id="cancelEdit" class="btn btn-secondary" data-translate="CANCEL"></button> 
            <button id="confirmEdit" class="btn btn-primary" data-translate="VALIDATE"></button> 
          </div> 
        </div> 
      </div>
    `;
    this.container.insertAdjacentHTML('beforeend', modalHtml);
  }

  showEditableModal() {
    const editableModal = document.getElementById('editableModal');
    this.langManager.translateElements();
    editableModal.style.display = 'block';
  
    // Add event listeners for confirm and cancel buttons
    document.getElementById('confirmEdit').addEventListener('click', () => {
      editableModal.style.display = 'none';
    });
  
    document.getElementById('cancelEdit').addEventListener('click', () => {
      editableModal.style.display = 'none';
    });
  
    // Add event listener to the modal close button
    editableModal.querySelector('#editableModal .close').addEventListener('click', () => {
      editableModal.style.display = 'none';
    });
  }

  generateRandomCode() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}