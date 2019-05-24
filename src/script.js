"use strict";

const btnNext = document.querySelector('#next'),
	btnStart = document.querySelector('#start'),
	btnRank = document.querySelector('#rank'),
	btnGiveUp = document.querySelector('#giveUp'),
	btnShowAnswers = document.querySelector('#showAnswers'),
	btnFinish = document.querySelector('#finish'),
	btnSave = document.querySelector('#save'),
	selectQuiz = document.querySelector('#selectQuiz'),
	quiz = document.querySelector('#quiz'),
	pagination = document.querySelector('#pagination'),
	winPoints = document.querySelector('#points'),
	star = document.querySelector('#star'),
	showAnswers = document.querySelector('#answers'),
	quisSave = document.querySelector('#quizSave'),
	hitsSave = document.querySelector('#hitsSave'),
	timeSave = document.querySelector('#timeSave'),
	textName = document.querySelector('#name'),
	modal5 = document.querySelector('#modal5'),
	switcherTheme = document.querySelector('#darktheme'),
	quizTitle = document.querySelector('#quizTitle'),
	root = document.querySelector(':root'),
	metaThemeColor = document.querySelector('meta[name=theme-color]'),
	metaMSThemeColor = document.querySelector('meta[name=msapplication-navbutton-color]'),
	icon = document.querySelector('link[rel=icon]'),
	options = document.querySelector('#options')

let points = 0,
	currentQuestion = 0,
	matches = [],
	selectedType = -1,
	time = 0,
	timeInterval,
	radioButtons = '',
	types

for (let i = 0; i < names.length; i++) {
	radioButtons +=
		`<p>
			<label>
				<input class="with-gap" name="selectQuiz" type="radio" data-text="${names[i]}" ${i == 0 ? 'checked' : ''} />
				<span>${names[i]}</span>
			</label>
		</p>`
}

options.innerHTML = radioButtons

types = document.querySelectorAll('[name=selectQuiz]')

function darkTheme() {
	localStorage.setItem('darktheme', 'true')
	metaThemeColor.setAttribute('content', '#2962ff')
	metaMSThemeColor.setAttribute('content', '#2962ff')
	icon.setAttribute('href', 'images/logo_dark.png')
	document.body.setAttribute('data-theme', 'dark')
}

function lightTheme() {
	localStorage.removeItem('darktheme')
	metaThemeColor.setAttribute('content', '#009688')
	metaMSThemeColor.setAttribute('content', '#009688')
	icon.setAttribute('href', 'images/logo_light.png')
	document.body.setAttribute('data-theme', 'light')
}

if (localStorage.getItem('darktheme')) {
	darkTheme()
	switcherTheme.checked = true
}

function render() {
	let html = `<p id="time" style="margin:5px 0 0 0">${timeProgress(time)}<i class="material-icons right" style="top:-2px;margin-left:5px">access_time</i></p><h6>${currentQuestion + 1}. ${questions[selectedType][currentQuestion]}</h6>`

	const answersQuestion = [answers[selectedType][currentQuestion], ...fakeAnswers[selectedType][currentQuestion]],
		answersRandom = []

	for (let i = 0; i < answersQuestion.length; i++) {
		let rndNumber = parseInt(Math.random() * answersQuestion.length)

		while (answersRandom.indexOf(rndNumber) !== -1)
			rndNumber = parseInt(Math.random() * answersQuestion.length)

		answersRandom[i] = rndNumber

		const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'W', 'Y', 'Z']
		html +=
			`<p>
				<label>
					<input class="with-gap" name="question${currentQuestion}" data-text="${answersQuestion[rndNumber]}" type="radio" />
					<span>${alphabet[i]}) ${answersQuestion[rndNumber]}</span>
				</label>
			</p>`
	}

	createPagination()
	quiz.innerHTML = html
}

function createPagination() {
	let htmlPagination = '<li class="disabled"><a><i class="material-icons">chevron_left</i></a></li>'

	for (let i = 0; i < questions[selectedType].length; i++)
		htmlPagination += `<li class="${matches[i] === undefined ? '' : 'waves-effect waves-light'} ${currentQuestion === i ? 'active bgcolor3 c-df no-border waves-effect waves-light' : `${matches[i] === undefined ? 'disabled' : matches[i] === 1 ? `active green c-df no-border ${i === questions[selectedType].length - 1 ? '' : 'brw'}` : `active red c-df no-border ${i === questions[selectedType].length - 1 ? '' : 'brw'}`}`}"><a>${i + 1}</a></li>`

	htmlPagination += '<li class="disabled"><a><i class="material-icons">chevron_right</i></a></li>'

	pagination.innerHTML = htmlPagination
	pagination.scrollLeft = pagination.querySelectorAll('li')[currentQuestion < parseInt(questions[selectedType].length / 2 + 1) ? 0 : parseInt(questions[selectedType].length / 2) + 1].offsetLeft
}

function timeProgress(time) {
	const hour = parseInt(time / 3600)
	time -= hour * 3600

	const minutes = parseInt(time / 60)
	time -= minutes * 60

	if (hour >= 1) {
		M.Modal.getInstance(document.querySelector('#modal6')).open()
		stop()
		return
	}

	return `${minutes}m ${time}s`
}

function reTimeProgress(time = String) {
	const str = time.split(' ')

	return parseInt(str[0].replace('m', '')) * 60 + parseInt(str[1].replace('s', ''))
}

function start() {
	selectQuiz.classList.add('hide')
	btnStart.classList.add('hide')
	btnRank.classList.add('hide')
	quiz.classList.remove('hide')
	btnNext.classList.remove('hide')
	btnGiveUp.classList.remove('hide')
	pagination.classList.remove('hide')

	types.forEach((item, index) => {
		if (item.checked) {
			selectedType = index
			document.title = `Quiz - ${item.getAttribute('data-text')}`
		}
	})

	render()
	timeInterval = setInterval(() => {
		document.querySelector('#time').innerHTML = `${timeProgress(++time)}<i class="material-icons right" style="top:-2px;margin-left:5px">access_time</i>`
	}, 1000)
}

function stop() {
	selectQuiz.classList.remove('hide')
	btnStart.classList.remove('hide')
	btnRank.classList.remove('hide')
	quiz.classList.add('hide')
	btnNext.classList.add('hide')
	btnGiveUp.classList.add('hide')
	btnShowAnswers.classList.add('hide')
	btnFinish.classList.add('hide')
	pagination.classList.add('hide')
	btnSave.classList.add('hide')
	document.title = 'Quizzes - Início'

	points = 0
	currentQuestion = 0
	selectedType = -1
	matches = []
	clearInterval(timeInterval)
	time = 0
}

function next() {
	const currentAnswers = document.querySelectorAll(`[name=question${currentQuestion}]`)

	let sumWithoutResponse = 0

	currentAnswers.forEach(item => {
		if (!item.checked) sumWithoutResponse++
	})

	if (sumWithoutResponse === currentAnswers.length)
		M.toast({
			html: 'Você deve selecionar uma resposta!',
			classes: 'red accent-4',
			displayLength: 2050
		})
	else {
		currentAnswers.forEach(item => {
			if (item.checked && item.getAttribute('data-text') === answers[selectedType][currentQuestion]) {
				matches.push(1)
				points += 1
			}
		})

		if (matches[currentQuestion] === undefined) matches.push(0)

		currentQuestion += 1

		if (currentQuestion === answers[selectedType].length) {
			clearInterval(timeInterval)
			currentAnswers.forEach(answer => {
				answer.disabled = true
			})

			btnNext.classList.add('hide')
			btnGiveUp.classList.add('hide')
			btnShowAnswers.classList.remove('hide')
			btnSave.classList.remove('hide')
			btnFinish.classList.remove('hide')

			btnShowAnswers.onclick = () => {
				let html = '<h4><i class="material-icons" style="top:2px">question_answer</i> Respostas</h4>'
				for (let i = 0; i < answers[selectedType].length; i++)
					html +=
					`<p style="margin:0">${i + 1}. ${questions[selectedType][i]}</p>
					<p style="margin:0 0 10px 0">R: ${answers[selectedType][i]} <i class="material-icons ${matches[i] === 0 ? 'red-text' : 'green-text'}" style="top:${matches[i] === 0 ? '7' : '5'}px;margin:-7px 0 0 0">${matches[i] === 0 ? 'clear' : 'done'}</i></p>`

				showAnswers.innerHTML = html
			}

			quisSave.innerHTML = types[selectedType].getAttribute('data-text')
			timeSave.innerHTML = timeProgress(time)
			const pointsPercentage = points / answers[selectedType].length * 100
			hitsSave.innerHTML = `${points} de ${questions[selectedType].length} (<span class="${pointsPercentage < 50 ? 'red-text' : 'green-text'}">${pointsPercentage.toFixed(1)}%</span>)`
			winPoints.innerHTML = `${points} de ${questions[selectedType].length} e obteve um desempenho de <span class="${pointsPercentage < 50 ? 'red-text' : 'green-text'}">${pointsPercentage.toFixed(1)}%</span>`

			star.className = `material-icons ${pointsPercentage < 50 ? 'red-text' : 'green-text'}`
			M.Modal.getInstance(document.querySelector('#modal2')).open()
			createPagination()
		} else render()
	}
}

function arraySort(array) {
	const newArray = []
	let bestArray = -1,
		indexBestArray = -1,
		bestTime = 3600

	while (array.length > 0) {
		for (let i = 0; i < array.length; i++)
			if (array[i][2] > bestArray) {
				indexBestArray = i
				bestTime = reTimeProgress(array[i][4])
				bestArray = array[i][2]
			} else if (array[i][2] === bestArray && reTimeProgress(array[i][4]) < bestTime) {
			indexBestArray = i
			bestTime = reTimeProgress(array[i][4])
		}

		bestArray = -1
		bestTime = 3600

		newArray.push(array[indexBestArray])
		array.splice(indexBestArray, 1)
	}

	return newArray
}

function save() {
	if (textName.value.trim() !== '' && textName.value.length > 2) {
		const allSaved = localStorage.getItem('registeredItems')

		if (allSaved === null)
			localStorage.setItem('registeredItems', `{"items":[["${types[selectedType].getAttribute('data-text')}","${textName.value}",${points}, ${questions[selectedType].length},"${timeProgress(time)}"]]}`)
		else {
			let newArray = JSON.parse(allSaved).items

			newArray.push([types[selectedType].getAttribute('data-text'), textName.value, points, questions[selectedType].length, timeProgress(time)])

			newArray = arraySort(newArray)

			localStorage.setItem('registeredItems', `{"items":${JSON.stringify(newArray)}}`)
		}

		M.Modal.getInstance(modal5).close()
		btnSave.classList.add('hide')
		textName.value = ''
		textName.select()
	} else {
		M.toast({
			html: 'Por favor, escolha um nome válido!',
			classes: 'red accent-4',
			displayLength: 2050
		})
		textName.select()
	}
}

function renderSavedItems() {
	if (M.Tabs.getInstance(document.querySelector('#tabs')) !== undefined)
		M.Tabs.getInstance(document.querySelector('#tabs')).destroy()

	let html = '',
		htmlParent = '',
		htmlItem, newItems
	const items = localStorage.getItem('registeredItems'),
		defaultHtmlItem = '<table class="responsive-table"><thead><tr><th>Nome</th><th>Acertos</th><th>Tempo</th></tr></thead><tbody>'

	if (items !== null)
		newItems = JSON.parse(items).items

	for (let i = 0; i < types.length; i++) {
		html += `<li class="tab tabs-fixed-width tab-demo"><a href="#quiz${i}">${types[i].getAttribute('data-text')}</a></li>`

		htmlItem = defaultHtmlItem

		if (items !== null)
			for (let j = 0; j < newItems.length; j++)
				if (types[i].getAttribute('data-text') === newItems[j][0]) {
					htmlItem +=
						`<tr>
							<td>${newItems[j][1]}</td>
							<td>${newItems[j][2]}/${newItems[j][3]}</td>
							<td>${newItems[j][4]}</td>
						</tr>`

					newItems.splice(j, 1)
					j--
				}

		htmlItem += '</tbody></table>'

		htmlParent += `<div id="quiz${i}">${htmlItem}</div>`
		htmlItem = defaultHtmlItem
	}

	document.querySelector('#tabs').innerHTML = html

	document.querySelector('#tabItems').innerHTML = htmlParent

	M.Tabs.init(document.querySelectorAll('.tabs'))
}

function clearSavedItems() {
	localStorage.removeItem('registeredItems')
	renderSavedItems()
}

window.addEventListener('DOMContentLoaded', function () {
	M.Sidenav.init(document.querySelectorAll('.sidenav'))
	M.Modal.init(document.querySelectorAll('.modal'))
	M.FloatingActionButton.init(document.querySelectorAll('.fixed-action-btn'), {
		hoverEnabled: false
	})

	if (localStorage.getItem('firstVisit') === null) {
		localStorage.setItem('firstVisit', 'false')
		M.TapTarget.init(document.querySelectorAll('.tap-target'), {
			onClose: () => {
				M.FloatingActionButton.getInstance(document.querySelector('.fixed-action-btn')).open()
			}
		})
		setTimeout(() => {
			M.TapTarget.getInstance(document.querySelector('.tap-target')).open()
			M.TapTarget.getInstance(document.querySelector('.tap-target'))._calculatePositioning()
		}, 100)
	}

	renderSavedItems()
	btnRank.onclick = () => {
		let tabs
		types.forEach((item, index) => {
			if (item.checked) {
				tabs = document.querySelectorAll('.tab')[index]
				tabs.querySelector('a').click()
			}
		})

		setTimeout(() => {
			M.Tabs.getInstance(document.querySelector('#tabs')).updateTabIndicator()
			document.querySelector('#tabs').scrollLeft = tabs.offsetLeft
		}, 300)
	}

	btnSave.onclick = () => {
		setTimeout(() => {
			textName.select()
		}, 50)
	}
})

modal5.onkeydown = e => {
	if (e.which === 13) {
		save()
		renderSavedItems()
	}
}

window.onload = () => {
	btnStart.onclick = start
	btnNext.onclick = next
	btnFinish.onclick = stop

	document.querySelector('#preloader').remove()
	document.querySelector('#nav').classList.remove('hide')
	document.querySelector('#container').classList.remove('hide')
}
