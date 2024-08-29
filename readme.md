Based on the new folder structure, here is an updated version of the README:

---

# Schedule-Lib
[this demo](https://harkyorix.github.io/schedule-lib/schedule/exemple/).
## Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Features](#features)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Event Handling](#event-handling)
7. [Customization](#customization)
8. [Example](#example)
9. [Contributing](#contributing)
10. [License](#license)

## Overview

`Schedule-Lib` is a versatile JavaScript library that allows for the creation and management of interactive calendar applications. It offers multiple views such as Year, Month, Week, and Day, and enables the creation, updating, and movement of events with support for recurring events. The library is built with a modular structure, allowing for extensive customization and easy integration into various projects.

## Project Structure

```plaintext
schedule-lib/
├── schedule/
│   ├── exemple/
│   │   ├── events.js
│   │   └── index.html
│   ├── src/
│   │   ├── css/
│   │   │   ├── checkbox.css
│   │   │   ├── day.css
│   │   │   ├── event.css
│   │   │   ├── index.css
│   │   │   ├── modal.css
│   │   │   ├── month.css
│   │   │   ├── schedule.css
│   │   │   ├── week.css
│   │   │   └── year.css
│   │   └── js/
│   │       ├── managers/
│   │       │   ├── eventManager.js
│   │       │   ├── index.js
│   │       │   └── langManager.js
│   │       ├── views/
│   │       │   ├── checkboxView.js
│   │       │   ├── dayView.js
│   │       │   ├── eventView.js
│   │       │   ├── index.js
│   │       │   ├── modalView.js
│   │       │   ├── monthView.js
│   │       │   ├── weekView.js
│   │       │   └── yearView.js
│   │       └── index.js
│   └── readme.md
```

### CSS Directory (`schedule/src/css/`)

- **checkbox.css**: Styles for checkbox elements in the `CheckboxView`.
- **day.css**: Styles for the Day view.
- **event.css**: Styles for individual events.
- **index.css**: General styles for the schedule application.
- **modal.css**: Styles for modals.
- **month.css**: Styles for the Month view.
- **schedule.css**: Overall layout styles for the schedule.
- **week.css**: Styles for the Week view.
- **year.css**: Styles for the Year view.

### JavaScript Directory (`schedule/src/js/`)

#### Managers (`schedule/src/js/managers/`)

- **eventManager.js**: Manages event operations like adding, updating, removing, and managing recurring events.
- **index.js**: Entry point for managers and global configurations.
- **langManager.js**: Handles language-specific operations, translations, and localization.

#### Views (`schedule/src/js/views/`)

- **checkboxView.js**: Renders checkboxes for filtering and interacting with installations and zones.
- **dayView.js**: Manages and renders the Day view, displaying events and details for a single day.
- **eventView.js**: Handles the display and management of events.
- **index.js**: Entry point for views-related operations.
- **modalView.js**: Manages modals for adding, editing, or viewing event details.
- **monthView.js**: Manages and renders the Month view in a grid format.
- **weekView.js**: Manages and renders the Week view with a detailed breakdown of events by hours and days.
- **yearView.js**: Manages and renders the Year view, showing an overview of events across months.

#### Example Directory (`schedule/exemple/`)

- **events.js**: Contains predefined event data used in the example.
- **index.html**: An example HTML file showcasing the usage of `Schedule-Lib`.

## Features

- **Multiple Views**: Navigate between Year, Month, Week, and Day views.
- **Event Management**: Create, update, duplicate, and move events.
- **Recurring Events**: Manage events with recurrence patterns.
- **Language Support**: Easily switch between languages using `langManager`.
- **Customizable UI**: Tailor the look and feel of the calendar with CSS.

## Installation

To use `Schedule-Lib`:

1. Clone the repository:
    ```bash
    git clone https://github.com/your-repo/schedule-lib.git
    ```
2. Navigate to the project directory:
    ```bash
    cd schedule-lib/schedule/src
    ```
3. Open `index.html` in your preferred browser.

## Usage

1. **Initialize the Schedule**:
    ```html
    <div id="schedule"></div>
    ```

2. **Configure Options**:
    ```javascript
    const options = {
      containerId: 'schedule',
      editable: true,
      defaultView: 'month',
      defaultLang: 'fr',
      events: events, // Import or define your events
      checkboxes: checkboxes, // Import or define checkbox data
    };
    ```

3. **Initialize the Schedule**:
    ```javascript
    import { Schedule } from "./schedule/src/js/index.js";

    document.addEventListener('DOMContentLoaded', () => {
      const schedule = new Schedule(options);
    });
    ```

## Event Handling

- **add**: Triggered when an event is added.
- **duplicate**: Triggered when an event is duplicated.
- **update**: Triggered when an event is updated.
- **move**: Triggered when an event is moved to a different date.
- **remove**: Triggered when an event is removed.

Example:

```javascript
schedule.on('add', (eventData) => {
  schedule.eventManager.addEvent(eventData.date, {...eventData, id: events.length});
  schedule.updateView();
});
```

## Customization

### CSS

Modify styles in the `schedule/src/css/` directory to customize the calendar's appearance.

### JavaScript

Extend or modify views and managers by editing or adding new files in the `schedule/src/js/` directory.

### Language

Use `langManager.js` to add new languages or modify existing translations.

## Example

For a live example of `Schedule-Lib`, visit [this demo](https://harkyorix.github.io/schedule-lib/schedule/exemple/).

## Contributing

Contributions are welcome! Please fork the repository, create a new branch, commit your changes, and open a pull request.

## License

This project is licensed under the MIT License.

---

This README provides a comprehensive guide to getting started with `Schedule-Lib`, including details on installation, usage, customization, and contribution.