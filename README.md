## Main Concept

The purpose of this project is to imitate progressive frameworks such as vue.js.

This project is still in alpha stage. It's probably not a practical framework, but you'll find some great ideas here :)

### Interpolation and ViewModel

Perhaps the surprising part of the progressive framework is the interpolation.

Interpolation usually uses braces called mustaches.

For interpolation, we used a popular library called handlebars.

View components are designed as mvvm and have ViewModels.

```javascript
const application = new Component(
  // View Part
  `
    <div>name: {{ name }}</div>
    <div>age: {{ age }}</div>
  `,
  // ViewModel Part
  {
    components: {
      Person,
    },
    states: {
      name: 'James',
      age: 26,
    },
  },
)
```

The ViewModel communicates with the View, notifying the View of data changes.

We define this as data binding.

Normally, the ViewModel notifies the View of changes, but it's also possible for the View to notify the ViewModel of changes.

We call this two-way binding. That's why we named this project Twoway.

### Props and Child Component

Props is a one-way data binding. The parent component passes it to the child component.

Props uses a '$' symbol to distinguish them from common models.

```javascript
const Person = new Component(
  `
    <div>name: {{ $name }}</div>
    <div>age: {{ $age }}</div>
  `,
)

const application = new Component(
  `
    <person name="{{ name }}" age="{{ age }}"></person>
  `,
  {
    components: {
      Person,
    },
    states: {
      name: 'James',
      age: 26,
    },
  },
)
```

### two-way binding

This is the way to update the ViewModel from the View. Of course, props cannot be used.

```javascript

```
