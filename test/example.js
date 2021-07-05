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
    <div>
      <input placeholder="input your name" type="text" t-model="name" />
      <input placeholder="input your age" type="number" t-model="age" />
      <button onclick="wow()">hello</button>
    </div>
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

function wow() {
  application.states.age = 28
  console.log(application.states.age)
}

renderer.render(application)
