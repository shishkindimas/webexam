const apiUrl = 'http://cat-facts-api.std-900.ist.mospolytech.ru/api/courses?api_key=442cd8c8-1438-49a9-8bc6-387908ee7714'; // Замените на ваш URL API
let currentPage = 1;
const recordsPerPage = 5; // Для заявок
let applications = [];

// Функция для загрузки заявок
async function loadApplications() {
    const response = await fetch(`${apiUrl}/applications?page=${currentPage}&limit=${recordsPerPage}`);
    applications = await response.json();
    displayApplications(applications);
}

// Функция для отображения заявок
function displayApplications(applications) {
    const appList = document.getElementById('applicationList');
    appList.innerHTML = ''; // Очищаем список
    applications.forEach(app => {
        const listItem = document.createElement('li');
        listItem.textContent = app.title; // Замените на нужное поле
        appList.appendChild(listItem);
    });
    setupPagination();
}

// Функция для настройки пагинации
function setupPagination() {
    const totalPages = Math.ceil(applications.length / recordsPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = ''; // Очищаем пагинацию

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.onclick = () => {
            currentPage = i;
            loadApplications();
        };
        pagination.appendChild(pageButton);
    }
}

// Вызов функции при загрузке страницы
loadApplications();
document.getElementById('createApplicationBtn').onclick = function() {
    document.getElementById('applicationModalTitle').textContent = 'Оформление заявки';
    document.getElementById('applicationForm').reset();
    $('#applicationModal').modal('show');
};

document.getElementById('submitApplicationBtn').onclick = async function() {
    const formData = new FormData(document.getElementById('applicationForm'));
    
    const response = await fetch(`${apiUrl}/applications`, {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const result = await response.json();
    if (response.ok) {
        alert('Заявка успешно создана!');
        loadApplications();
        $('#applicationModal').modal('hide');
    } else {
        alert('Ошибка: ' + result.message);
    }
};
function editApplication(application) {
    document.getElementById('applicationModalTitle').textContent = 'Редактирование заявки';
    document.getElementById('applicationForm').title.value = application.title; // Замените на нужное поле
    $('#applicationModal').modal('show');
}

document.getElementById('saveApplicationBtn').onclick = async function() {
    const formData = new FormData(document.getElementById('applicationForm'));
    const applicationId = "";
    const response = await fetch(`${apiUrl}/applications/${applicationId}`, {
        method: 'PUT',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const result = await response.json();
    if (response.ok) {
        alert('Заявка успешно обновлена!');
        loadApplications();
        $('#applicationModal').modal('hide');
    } else {
        alert('Ошибка: ' + result.message);
    }
};
function confirmDeleteApplication(applicationId) {

    const confirmation = confirm('Вы уверены, что хотите удалить заявку?');
    if (confirmation) {
        deleteApplication(applicationId);
    }
}

async function deleteApplication(applicationId) {
    const response = await fetch(`${apiUrl}/applications/${applicationId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        alert('Заявка успешно удалена!');
        loadApplications();
    } else {
        alert('Ошибка при удалении заявки.');
    }
}
