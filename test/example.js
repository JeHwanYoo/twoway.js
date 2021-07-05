const { Renderer, Component } = Twoway

const Counter = new Component(
  `
    <div>count {{ $count }}</div>
  `,
)

const application = new Component(
  `
    <counter count="{{ count }}"></counter>
    <div>
      <button @click="minusCount">minus count</button>
      <button @click="plusCount">plus count</button>
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
        state.count++
      },
      minusCount(state) {
        state.count--
      },
    },
  },
)

new Renderer(application)
