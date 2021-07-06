const { Renderer, Component } = Twoway

const counter = new Component(
  `
    <div>
      count {{ $count }}
    </div>
  `,
)

const application = new Component(
  `
    <div class="wrapper">
      <counter count="{{ count }}"></counter>
      <div class="button">
        <button t-click="minusCount">minus count</button>
        <button t-click="plusCount">plus count</button>
      </div>
      <br />
      <div class="text-display">
        <div> {{ text }} </div>
        <input type="text" t-model="text" />
      </div>
    </div>
  `,
  {
    components: {
      counter,
    },
    state: {
      count: 0,
      text: 'bind with input!',
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
