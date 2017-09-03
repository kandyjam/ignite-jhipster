const test = require('ava')
const execa = require('execa')
const jetpack = require('fs-jetpack')

const IGNITE = 'ignite'
const APP = 'IntegrationTestJWT'

test.before(async t => {
  jetpack.remove(APP)
  await execa('npm', ['link'])
  console.log('Generating JWT app...')
  await execa(IGNITE, ['new', APP, '--jwt', '--skip-git', '--boilerplate', `${__dirname}/..`])
  process.chdir(APP)
  await execa('npm', ['link', 'ignite-jhipster'])
  console.log('App generation complete!')
})

test('lints a fresh app', async t => {
  console.log('Linting fresh app')
  const lint = await execa('npm', ['-s', 'run', 'lint'])
  t.is(lint.stderr, '')
})

test('generates an entity', async t => {
  console.log('Generating entity Foo')
  await execa(IGNITE, ['g', 'entity', 'Foo', '--jh-dir=../test'])
  console.log('Generated entity Foo')
  // t.is(jetpack.exists('App/Components/Test.js'), 'file')
  // t.is(jetpack.exists('App/Components/Styles/TestStyle.js'), 'file')
  const lint = await execa('npm', ['-s', 'run', 'lint'])
  t.is(lint.stderr, '')
})

test.after.always('clean up all generated items', t => {
  process.chdir('../')
  jetpack.remove(APP)
})