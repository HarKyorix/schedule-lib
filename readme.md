Here's the README in the requested format:

---

# Schedule-Lib

## Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Features](#features)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Event Handling](#event-handling)
7. [Customization](#customization)
8. [Contributing](#contributing)
9. [License](#license)

## Overview

`Schedule-Lib` is a highly customizable JavaScript library designed to create interactive calendar applications. It allows users to view and manage events through various views (Year, Month, Week, Day) and provides features for event creation, duplication, movement, and recurrence. The library is built to be modular, making it easy to extend or modify specific components such as views, event handling, and language support.

## Project Structure

```plaintext
schedule-lib/
├── schedule/
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
│   │   ├── js/
│   │   │   ├── managers/
│   │   │   │   ├── eventManager.js
│   │   │   │   ├── index.js
│   │   │   │   └── langManager.js
│   │   │   ├── views/
│   │   │   │   ├── checkboxView.js
│   │   │   │   ├── dayView.js
│   │   │   │   ├── eventView.js
│   │   │   │   ├── index.js
│   │   │   │   ├── modalView.js
│   │   │   │   ├── monthView.js
│   │   │   │   ├── weekView.js
│   │   │   │   └── yearView.js
│   │   │   ├── events.js
│   │   │   └── index.js
│   │   └── index.html
│   └── readme.md
```

### CSS Directory (`schedule/src/css/`)

- **checkbox.css**: Styles specific to the checkbox elements used in the `CheckboxView`.
- **day.css**: Styles for the Day view of the schedule.
- **event.css**: Styles for individual events within the schedule.
- **index.css**: General styles applied throughout the entire schedule application.
- **modal.css**: Styles for the modal windows used within the application.
- **month.css**: Styles specific to the Month view.
- **schedule.css**: General styles related to the entire schedule layout.
- **week.css**: Styles specific to the Week view.
- **year.css**: Styles specific to the Year view.

### JavaScript Directory (`schedule/src/js/`)

#### Managers (`schedule/src/js/managers/`)

- **eventManager.js**: Manages all event-related operations including adding, updating, removing, and managing recurring events.
- **index.js**: Entry point for initializing managers and other global configurations.
- **langManager.js**: Handles language-specific operations such as translations and localizations within the schedule application.

#### Views (`schedule/src/js/views/`)

- **checkboxView.js**: Renders checkboxes for installations and zones within an accordion structure, allowing users to filter or interact with these elements.
- **dayView.js**: Manages and renders the Day view of the schedule, showing events and details specific to a single day.
- **eventView.js**: Handles the display of individual events within various views.
- **index.js**: Entry point for view-related operations, potentially aggregating and managing all views.
- **modalView.js**: Handles the modal windows used to add, edit, or view event details.
- **monthView.js**: Manages and renders the Month view, displaying events distributed across days in a grid format.
- **weekView.js**: Manages and renders the Week view, breaking down events by hours and days for a detailed weekly overview.
- **yearView.js**: Manages and renders the Year view, providing an overview of events across months within the year.

#### Other Files

- **events.js**: Contains predefined events and checkboxes data used within the schedule. This file can be customized to fit specific needs.
- **index.js**: The main entry point for the schedule application, initializing the `Schedule` class and managing the application lifecycle.
- **index.html**: The HTML file that includes the main structure of the page where the schedule is displayed.

## Features

- **Multiple Views**: Navigate between Year, Month, Week, and Day views.
- **Event Management**: Create, update, duplicate, and move events within the calendar.
- **Recurring Events**: Manage events that repeat over time with different recurrency codes.
- **Language Support**: Easily switch between different languages using the `langManager`.
- **Customizable UI**: Tailor the look and feel of the calendar using CSS styles.

## Installation

To use `Schedule-Lib` in your project:

1. Clone the repository:
    ```bash
    git clone https://github.com/your-repo/schedule-lib.git
    ```
2. Navigate to the project directory:
    ```bash
    cd schedule-lib/schedule/src
    ```
3. Open `index.html` in your preferred browser.

No additional installation is required for the basic setup.

## Usage

1. **Initialize the Schedule**:
    In your HTML file, include the following structure:

    ```html
    <div id="schedule"></div>
    ```

2. **Setup Options**:
    In your JavaScript file, configure your options:

    ```javascript
    const options = {
      containerId: 'schedule',
      editable: true,
      defaultView: 'month',
      defaultLang: 'fr',
      events: events, // Import or define your events here
      checkboxes: checkboxes, // Import or define your checkbox data here
    };
    ```

3. **Initialize the Schedule**:
    ```javascript
    import { Schedule } from "./schedule/src/js/index.js";

    document.addEventListener('DOMContentLoaded', () => {
      const schedule = new Schedule(options);
      // Additional event listeners or customization can go here.
    });
    ```

## Event Handling

`Schedule-Lib` provides various event handlers that allow you to interact with the calendar:

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

Modify the styles in the `schedule/src/css/` directory to change the appearance of your calendar. Each view and component has its own dedicated stylesheet.

### JavaScript

Extend or modify the existing views and managers by editing or adding new files in the `schedule/src/js/` directory.

### Language

Use the `langManager.js` to add support for additional languages or customize existing translations.

## Contributing

Contributions are welcome! If you'd like to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

This README should give a clear and concise overview of the project, its structure, and how to get started with it.