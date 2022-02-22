const DEFAULT_TOTAL_VOTERS = 450

const title = document.querySelector('.title')

const template = document.querySelector('#results-template')

const votersForm = document.querySelector('.voters-form')
const votersTopicInput = votersForm.querySelector('.voters-form__input')
const votersFormSubmit = votersForm.querySelector('.voters-form__submit')

const userForm = document.querySelector('.user-form')
const userTopicInput = userForm.querySelector('.user-form__input_type_topic')
const totalInput = userForm.querySelector('.user-form__input_type_voters')
const inFavorInput = userForm.querySelector('.user-form__input_type_in-favor')
const againstInput = userForm.querySelector('.user-form__input_type_against')
const haltedInput = userForm.querySelector('.user-form__input_type_halt')
const userFormSubmit = userForm.querySelector('.user-form__submit')

const option = document.querySelector('.option')

/* Results */

let totalVoters
let inFavorVoters
let againstVoters
let haltedVoters
let votedVoters
let absentVoters

/**/

function validateForm(formType) {
  if (formType === 'voters') {
    if (!votersForm.checkValidity()) {
      votersFormSubmit.disabled = true
    } else {
      votersFormSubmit.disabled = false
    }
  } else if (formType === 'user') {
    countVotes()

    if (!userForm.checkValidity() || votedVoters > totalVoters) {
      userFormSubmit.disabled = true
    } else {
      userFormSubmit.disabled = false
    }
  }
}

function generateVotes() {
  function getRandomVotes(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)

    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  totalVoters = DEFAULT_TOTAL_VOTERS

  let currentVoters = totalVoters

  inFavorVoters = getRandomVotes(0, currentVoters)

  currentVoters -= inFavorVoters

  againstVoters = getRandomVotes(0, currentVoters)

  currentVoters -= againstVoters

  haltedVoters = getRandomVotes(0, currentVoters)

  votedVoters = +inFavorVoters + +againstVoters + +haltedVoters
  absentVoters = totalVoters - votedVoters
}

function countVotes() {
  totalVoters = totalInput.value
  inFavorVoters = inFavorInput.value
  againstVoters = againstInput.value
  haltedVoters = haltedInput.value

  votedVoters = +inFavorVoters + +againstVoters + +haltedVoters
  absentVoters = totalVoters - votedVoters
}

function countPercents(group) {
  return ((group / totalVoters) * 100).toFixed(1)
}

function generateResult() {
  const resultElement = template.content.cloneNode(true)

  const timeNode = resultElement.querySelector('.result__text_type_time')
  const inFavorVotesNode = resultElement.querySelector('.result__in-favor')
  const inFavorPercentNode = resultElement.querySelector('.result__in-favor-prc')
  const againstVotesNode = resultElement.querySelector('.result__against')
  const againstPercentNode = resultElement.querySelector('.result__against-prc')
  const haltedVotesNode = resultElement.querySelector('.result__halt')
  const haltedPercentNode = resultElement.querySelector('.result__halt-prc')
  const votedNode = resultElement.querySelector('.result__voted')
  const votedPercentNode = resultElement.querySelector('.result__voted-prc')

  timeNode.textContent = new Date().toLocaleTimeString('ru', { hour12: false })

  inFavorVotesNode.textContent = inFavorVoters + ' ч.'
  inFavorPercentNode.textContent = countPercents(inFavorVoters) + '%'

  againstVotesNode.textContent = againstVoters + ' ч.'
  againstPercentNode.textContent = countPercents(againstVoters) + '%'

  haltedVotesNode.textContent = haltedVoters + ' ч.'
  haltedPercentNode.textContent = countPercents(haltedVoters) + '%'

  votedNode.textContent = votedVoters + ' ч.'
  votedPercentNode.textContent = countPercents(votedVoters) + '%'

  return resultElement
}

function appendResult(formType) {
  const resultElement = generateResult()

  title.parentNode.insertBefore(resultElement, title.nextSibling)

  const resultsTopicNode = document.createElement('h2')

  resultsTopicNode.textContent = formType === 'voters' ? votersTopicInput.value : userTopicInput.value
  resultsTopicNode.classList.add('result-topic')

  title.parentNode.insertBefore(resultsTopicNode, title.nextSibling)

  option.remove()
  votersForm.remove()
  userForm.remove()
}

function handleVotersTopicSubmit(evt) {
  evt.preventDefault()

  generateVotes()
  appendResult('voters')
}

function handleUserFormSubmit(evt) {
  evt.preventDefault()

  countVotes()
  appendResult('user')
}

votersForm.addEventListener('input', () => validateForm('voters'))
userForm.addEventListener('input', () => validateForm('user'))

votersForm.addEventListener('submit', handleVotersTopicSubmit)
userForm.addEventListener('submit', handleUserFormSubmit)

validateForm('voters')
validateForm('user')
