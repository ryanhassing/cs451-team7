# Install Spectron
$ npm install --save-dev spectron

// A simple test to verify a visible window is opened with a title
var Application = require('spectron').Application
var assert = require('assert')

var app = new Application({
  path: '../app'
})
describe('Test suit',function(){
  this.timeout(10000000)
  beforeEach(function () {
        this.app = new Application({
            path: '../app/release/team-7-checkers*/team-7-checkers.exe'
        })

        return this.app.start()
  })
  afterEach(function(){
    if (this.app && this.app.isRunning()) {
            return this.app.stop()
        }
  })
  it('open a window', () => {
    this.app.client.getWindowCount().then(count) =>
    assert.equal(count,1)
  })

  it('start game',() =>{
    this.app.client.click('#join')
    this.app.client.getWindowCount().then(count) =>
    assert.equal(count,2)
  })

  it('getConnection',() =>{
    this.app.client.click('#single-player')
    this.app.client.getcurrentWindow(window)
    assert.equal(window.getTitle(),"game")
  }
})
