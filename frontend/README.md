Frontend
========

The GUI needs to show the elements output by the server in a tabular form. The GUI needs to colorize the cells red if the number is below a GUI settable value or green if it is higher than the set value.

The Web GUI needs to show only the last 500 elements at the same time. Elements more than 100 can be paginated or managed in any other fashion. The GUI needs to support an update frequency of at least 100 milliseconds, with 50 elements per update.

As an extended feature, the GUI should be able to control the frequency that the backend sends updates at. This will override any setting that is configured in the backend server configuration file.
