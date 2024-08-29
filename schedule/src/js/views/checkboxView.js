export class CheckboxView {
  constructor(checkboxes, calendar) {
    this.eventManager = calendar.eventManager;
    this.langManager = calendar.langManager;
    this.calendar = calendar;
    
    this.checkboxView = document.getElementById('checkbox-view');

    if (checkboxes.list.length !== 0) {
      this.renderCheckbox(checkboxes);
    }
  }
  init(){
    this.checkboxView.querySelector('#all-checkbox').click();
  }

  renderCheckbox(checkbox) {
    this.checkboxView.className = 'col-4 p-2';
    this.checkboxView.style.display = 'block';
    this.checkboxView.innerHTML = `
      <label class="title" for="all-checkbox">
        <input type="checkbox" class="form-check-input" id="all-checkbox">
        <h4>${checkbox.name}</h4>
      </label>
    `;
    
    const accordion = document.createElement('div');
    accordion.className = 'accordion';
    accordion.id = 'elementsAccordion';

    checkbox.list.forEach((element, index) => {
      const elementId = `element_${index}`;
      const accordionItem = document.createElement('div');
      accordionItem.className = 'accordion-item';

      accordionItem.innerHTML = `
        <div class="accordion-header" id="heading_${elementId}">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_${elementId}" aria-expanded="false" aria-controls="collapse_${elementId}">
            <label class="form-check-label">
              <input type="checkbox" class="form-check-input me-2 element-checkbox" data-index="${index}" value='${JSON.stringify({id_ref: element.id, name: element.name, type_ref: element.type})}'>
              ${element.name}
            </label>
            <span>
              ${element?.items ? 
                `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-compact-down ms-auto toggle-icon toggle-down" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-compact-up ms-auto toggle-icon toggle-up d-none" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894z"/>
                </svg> ` : ''
              }
            </span>
          </button>
        </div>
        <div id="collapse_${elementId}" class="accordion-collapse collapse" aria-labelledby="heading_${elementId}" data-bs-parent="#elementsAccordion">
          ${this.renderItems(element.items, index)}
        </div>
      `;

      accordion.appendChild(accordionItem);
      this.langManager.translateElements(); 
    });

    this.checkboxView.appendChild(accordion);

    const allCheckbox = this.checkboxView.querySelector('#all-checkbox');
    const accordionButtons = this.checkboxView.querySelectorAll('.accordion-button');
    const elementCheckboxes = this.checkboxView.querySelectorAll('.element-checkbox');
    const itemCheckboxes = this.checkboxView.querySelectorAll('.item-checkbox');

    this.addToggleEventListeners(accordionButtons);
    this.addElementCheckboxEventListeners(allCheckbox, elementCheckboxes);
    this.addItemCheckboxEventListeners(allCheckbox, elementCheckboxes, itemCheckboxes);
    this.addAllCheckboxEventListener(allCheckbox, elementCheckboxes, itemCheckboxes);
  }

  renderItems(items, index) {
    if (items) {
      if (items.length == 0) {
        return `
          <div class="accordion-body">
            <p class="text-muted" data-translate="NO_ITEM">
              ${this.langManager.translate('NO_ITEM')}
            </p>
          </div>
        `;
      }
  
      return `
        <div class="accordion-body"> 
          ${items.map(item => `
            <p class="form-check">
              <label class="form-check-label">
                <input type="checkbox" class="form-check-input item-checkbox" data-element-index="${index}" value='${JSON.stringify({id_ref: item.id, name: item.name, type_ref: item.type})}'>
                ${item.name}
              </label>
            </p>
          `).join('')}
        </div>`;
    } else {
      return '';
    }
  }

  addToggleEventListeners(accordionButtons) {

    accordionButtons.forEach(button => {
      button.addEventListener('click', () => {
        const toggleDownIcon = button.querySelector('.toggle-down');
        const toggleUpIcon = button.querySelector('.toggle-up');
        const collapseElement = document.getElementById(button.getAttribute('data-bs-target')?.substring(1));
        
        toggleDownIcon?.classList.toggle('d-none');
        toggleUpIcon?.classList.toggle('d-none');
        
        if (collapseElement) {
          if (toggleUpIcon?.classList.contains('d-none')) {
            collapseElement.classList.remove('show');
          } else {
            collapseElement.classList.add('show');
          }
        }
      });
    });
  }

  addElementCheckboxEventListeners(allCheckbox, elementCheckboxes) {
    elementCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (event) => {
        const elementIndex = event.target.dataset.index;
        const isChecked = event.target.checked;

        const itemCheckboxes = this.checkboxView.querySelectorAll(`.item-checkbox[data-element-index="${elementIndex}"]`);
        itemCheckboxes.forEach(itemCheckbox => {
          itemCheckbox.checked = isChecked;
        });

        this.updateAllCheckboxState(allCheckbox, elementCheckboxes);
        this.updateCalendarEvents();
      });
    });
  }

  addItemCheckboxEventListeners(allCheckbox, elementCheckboxes, itemCheckboxes) {
    itemCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.updateAllCheckboxState(allCheckbox, elementCheckboxes);
        this.updateCalendarEvents();
      });
    });
  }

  addAllCheckboxEventListener(allCheckbox, elementCheckboxes, itemCheckboxes) {
    allCheckbox.addEventListener('change', (event) => {
      const isChecked = event.target.checked;

      elementCheckboxes.forEach(checkbox => checkbox.checked = isChecked);
      itemCheckboxes.forEach(checkbox => checkbox.checked = isChecked);

      this.updateCalendarEvents();
    });
  }

  updateAllCheckboxState(allCheckbox, elementCheckboxes) {
    const allChecked = Array.from(elementCheckboxes).every(checkbox => checkbox.checked);
    allCheckbox.checked = allChecked;
  }

  updateCalendarEvents() {    
    const elementCheckboxes = [...this.checkboxView.querySelectorAll('.element-checkbox:checked'), ...this.checkboxView.querySelectorAll('.item-checkbox:checked')];

    
    let selectedRefs = [];

    elementCheckboxes.forEach(checkbox => {
      selectedRefs.push(JSON.parse(checkbox.value));
    });

    this.calendar.defaultRefs = selectedRefs;

    this.calendar.updateView();
  }
}
