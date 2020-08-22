const usersLink = 'https://randomuser.me/api/?results=12&nat=us,au,ca,nz&inc=name,location,email,dob,cell,picture,nat&noinfo';

let usersData = [];

const body = document.querySelector('body');
const directory = document.getElementById('directory');
const searchField = document.getElementById('search');
const overlay = document.getElementById('overlay');
const modalContent = document.querySelector('.modal-content');
const closeBtn = document.querySelector('.close');
const previousBtn = document.querySelector('.previous');
const nextBtn = document.querySelector('.next');

async function fetchData(url) {
	const response = await fetch(url);
	const data = await response.json();
	return data.results;
}

function generateEmployeeCard(data) {
	usersData = data;

	data.forEach((employee, index) => {
		const imgSource = employee.picture.large;
		const nameFormat = `${employee.name.first} ${employee.name.last}`;
		const emailFormat = employee.email;
		const locationFormat = `${employee.location.city}, ${employee.location.country}`;

		const employeeCard = `
			<img src="${imgSource}"alt="Employee picture" class="employee-avatar" />
			<div class="employee-info">
				<h2 class="employee-name">${nameFormat}</h2>
				<p class="employee-email">${emailFormat}</p>
				<p class="employee-location">${locationFormat}</p>
			</div>
			`;

		let employeeContainer = document.createElement('div');
		employeeContainer.classList.add('employee-container');
		directory.appendChild(employeeContainer);
		employeeContainer.innerHTML = employeeCard;
		employeeContainer.setAttribute('data-index', index);
	});
}

function displayModal(data, index) {
	const imgSource = data.picture.large;
	const nameFormat = `${data.name.first} ${data.name.last}`;
	const emailFormat = data.email;
	const locationFormat = `${data.location.city}, ${data.location.country}`;
	const phoneFormat = data.cell;
	const addressFormat = `${data.location.street.number} ${data.location.street.name}, ${data.location.city}, ${data.location.state} ${data.location.postcode}`;
	const dobFormat = new Date(data.dob.date).toLocaleDateString('en-US');

	const employeeModal = `
	<div class="modal-info">
		<img src="${imgSource}" class="employee-avatar" />
		<h2 class="employee-name">${nameFormat}</h2>
		<p class="employee-email">${emailFormat}</p>
		<p class="employee-location">${locationFormat}</p>
	</div>
	<div class="modal-details">
		<p class="employee-phone">${phoneFormat}</p>
		<p class="employee-address">${addressFormat}</p>
		<p class="employee-birthday">Birthday: ${dobFormat}</p>
	</div>
`;

	modalContent.innerHTML = employeeModal;
	modalContent.setAttribute('data-index', index);
}

function closeModal() {
	overlay.style.display = 'none';
	body.classList.remove('scroll-lock');
}

function searchFilter() {
	// convert HTML collections to arrays
	let employeeNames = Array.from(document.getElementsByClassName('employee-name'));
	let employeeContainers = Array.from(document.getElementsByClassName('employee-container'));

	let searchInput = searchField.value.toLowerCase();
	employeeNames.forEach((name) => {
		let nameContent = name.textContent.toLowerCase();
		let card = name.parentNode.parentNode;
		if (nameContent.includes(searchInput)) {
			card.style.display = ``;
		} else {
			card.style.display = `none`;
		}
	});
	// display error message if no employee matches name search
	if (employeeContainers.every((container) => container.style.display === 'none')) {
		let message = document.createElement('p');
		message.textContent = `No employee found.`;
		directory.appendChild(message);
	}
}

function resetBtn() {
	previousBtn.style.display = '';
	nextBtn.style.display = '';
	if (parseInt(modalContent.dataset.index) === 0) {
		previousBtn.style.display = 'none';
		nextBtn.style.display = '';
	} else if (parseInt(modalContent.dataset.index) === usersData.length - 1) {
		nextBtn.style.display = 'none';
		previousBtn.style.display = '';
	}
}

fetchData(usersLink)
	.then(generateEmployeeCard)
	.catch((err) => console.error(err));

searchField.addEventListener('keyup', searchFilter);

// clear error message if there is employee matches name search
searchField.addEventListener('input', () => {
	if (directory.lastElementChild.tagName == 'P') {
		directory.removeChild(directory.lastElementChild);
	}
});

// display modal when click on employee card
directory.addEventListener('click', (e) => {
	if (e.target !== directory) {
		body.classList.add('scroll-lock');
		overlay.style.display = 'flex';
		const employeeIndex = e.target.closest('.employee-container').getAttribute('data-index');
		displayModal(usersData[employeeIndex], employeeIndex);
		resetBtn();
	}
});

overlay.addEventListener('click', (e) => {
	if (e.target === overlay) {
		closeModal();
	}
});

closeBtn.addEventListener('click', (e) => {
	closeModal();
});

previousBtn.addEventListener('click', (e) => {
	let index = parseInt(modalContent.dataset.index) - 1;
	displayModal(usersData[index], index);
	resetBtn();
});

nextBtn.addEventListener('click', (e) => {
	let index = parseInt(modalContent.dataset.index) + 1;
	displayModal(usersData[index], index);
	resetBtn();
});
