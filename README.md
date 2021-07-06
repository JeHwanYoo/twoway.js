## What's this?

The purpose of this project is to imitate progressive frameworks such as vue.js.

This project is still in alpha stage. It's probably not a practical framework, but you'll find some great ideas here :)

## Main Concept

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

t-attribute is a two-way.js grammar. (ex, t-click, t-model)

Usually, other frameworks seem to be called directives.

```javascript
const Counter = new Component(
  `
    <div>count {{ $count }}</div>
  `,
)

const application = new Component(
  `
    <counter count="{{ count }}"></counter>
    <div>
      <button t-click="minusCount">minus count</button>
      <button t-click="plusCount">plus count</button>
    </div>
  `,
  {
    components: {
      Counter,
    },
    state: {
      count: 0,
    },
    methods: {
      plusCount(state) {
        state.age++
      },
      minusCount(state) {
        state.age--
      },
    },
  },
)
```

> Question) Is the update by the button one-way binding?
>
> Yes. This is because data updates are actually done in the ViewModel.

### two-way binding

This is the way to update the ViewModel from the View. Of course, props cannot be used.

```javascript

```

## Test

Although it has not been officially distributed yet, you can clone this project and test it by running `npm run dev`. See `test/example.js`.

## Known Issues

There is no implemented event other than the onclick event. (`@click`)

It has not been tested whether the two-way binding works correctly for various input types.

Exception handling is still inexperienced.

In 0.0.1beta, we try to fix problems.
