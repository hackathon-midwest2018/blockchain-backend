let wsController = require('./ws')

function mount(app) {
  wsController(app)

  return app
}

module.exports = mount
