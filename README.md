# Sport Events Platform - frontend 

This is a frontend interface and part of a full-stack application ([backend](https://github.com/lukamilo99/sport-connecting-people)), designed to help users to find sports activities across different cities. It enables users to discover, create, and join sports events across various cities. 

## Framework and libraries

- **Vue.js Composition API**: The backbone of the application, offering a modular approach to reactive functionalities.
- **Axios**: Facilitated communication with the backend API.
- **Vue Router**: Managed seamless navigation between application sections.
- **Vuex**: Centralized storage for user data and system notifications.
- **Leaflet**: Integrated for interactive map displays and location-based functionalities.

## Features

1. **User Interface**:
   - A simple and intuitive design for effortless user navigation and interaction.
   - Interactive elements such as maps and address autocompletion.
   
2. **User Authentication**:
   - Offered both manual and OAuth2 Google login options.
   - Retained user sessions for a personalized experience.
   
3. **Error Handling**:
   - Application-wide notification component to provide feedback to users.
   - Input data validation on the frontend.
   
4. **Performance Optimizations**:
   - Practices like lazy loading were implemented to keep the app fast and responsive.

## Installation Guide

```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
