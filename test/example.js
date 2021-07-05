const { Renderer, Component } = Twoway

const renderer = new Renderer('app')

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
    model: {
      name: 'James',
      age: 26,
    },
  },
)

renderer.render(application)
