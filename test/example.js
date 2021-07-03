const { Renderer, Model, Component } = Twoway

const renderer = new Renderer('app')

const Person = new Component(
  `
    <div>name: {{ $name }}</div>
    <div>age: {{ $age }}</div>
  `,
  {
    name: 'NameBox',
    props: ['name', 'age'],
  },
)

const application = new Component(
  `
   {{{component Person name age}}}
  `,
  {
    name: 'appLayout',
    components: {
      Person,
    },
    model: new Model({
      name: 'James',
      age: 26,
    }),
  },
)

renderer.renders(application)
