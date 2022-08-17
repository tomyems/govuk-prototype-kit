/* eslint-env jest */

const assert = require('assert')
const fs = require('fs')
const path = require('path')

const request = require('supertest')
const sass = require('sass')

const { mkPrototype, mkdtempSync } = require('../util')
const tmpDir = path.join(mkdtempSync(), 'sanity-checks')
let app

const utils = require('../../lib/utils')
const { generateAssetsSync } = require('../../lib/build/tasks')

function readFile (pathFromRoot) {
  return fs.readFileSync(path.join(__dirname, '../../' + pathFromRoot), 'utf8')
}

/**
 * Basic sanity checks on the dev server
 */
describe('The Prototype Kit', () => {
  beforeAll(async () => {
    process.env.IS_INTEGRATION_TEST = 'true'
    await mkPrototype(tmpDir, { allowTracking: false })
    app = require(path.join(tmpDir, 'node_modules', 'govuk-prototype-kit', 'server.js'))
    jest.spyOn(sass, 'compile').mockImplementation((css, options) => ({ css }))
    generateAssetsSync()
  })

  it('should generate assets into the /public folder', () => {
    assert.doesNotThrow(async function () {
      await utils.waitUntilFileExists(path.resolve(__dirname, '../../public/stylesheets/application.css'), 5000)
    })
  })

  describe('index page', () => {
    it('should send a well formed response', async () => {
      const response = await request(app).get('/')
      expect(response.statusCode).toBe(200)
    })

    it('should return html file', async () => {
      const response = await request(app).get('/')
      expect(response.type).toBe('text/html')
    })
  })

  describe('extensions', () => {
    it('should allow known assets to be loaded from node_modules', (done) => {
      request(app)
        .get('/extension-assets/govuk-frontend/govuk/all.js')
        .expect('Content-Type', /application\/javascript; charset=UTF-8/)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            done(err)
          } else {
            assert.strictEqual('' + res.text, readFile('node_modules/govuk-frontend/govuk/all.js'))
            done()
          }
        })
    })

    it('should allow known assets to be loaded from node_modules', (done) => {
      request(app)
        .get('/govuk/assets/images/favicon.ico')
        .expect('Content-Type', /image\/x-icon/)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            done(err)
          } else {
            assert.strictEqual('' + res.body, readFile('node_modules/govuk-frontend/govuk/assets/images/favicon.ico'))
            done()
          }
        })
    })

    it('should not expose everything', function (done) {
      const consoleErrorMock = jest.spyOn(global.console, 'error').mockImplementation()

      request(app)
        .get('/govuk/assets/common.js')
        .expect(404)
        .end(function (err, res) {
          consoleErrorMock.mockRestore()
          if (err) {
            done(err)
          } else {
            done()
          }
        })
    })

    describe('misconfigured prototype kit - while upgrading kit developer did not copy over changes in /app folder', () => {
      it('should still allow known assets to be loaded from node_modules', (done) => {
        request(app)
          .get('/node_modules/govuk-frontend/govuk/all.js')
          .expect('Content-Type', /application\/javascript; charset=UTF-8/)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              done(err)
            } else {
              assert.strictEqual('' + res.text, readFile('node_modules/govuk-frontend/govuk/all.js'))
              done()
            }
          })
      })
    })
  })
})
