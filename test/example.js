const { Renderer, Component } = Twoway

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
    name: 'application',
    components: {
      Person,
    },
    model: {
      name: 'James',
      age: 26,
    },
  },
)

renderer.renders(application)
