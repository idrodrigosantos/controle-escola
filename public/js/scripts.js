// Seleciona a página atual
const currentPage = location.pathname;
// Seleciona os itens do menu
const menuItems = document.querySelectorAll('header nav a');

for (item of menuItems) {
    if (currentPage.includes(item.getAttribute('href'))) {
        item.classList.add('active');
    }
}

// Paginação
function paginate(selectedPage, totalPages) {
    let pages = [], oldPage;

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        const firstAndLastPage = currentPage == 1 || currentPage == 2 || currentPage == (totalPages - 1) || currentPage == totalPages;
        const pagesBeforeSelectedPages = currentPage >= selectedPage - 1;
        const pagesAfterSelectedPages = currentPage <= selectedPage + 1;

        if (firstAndLastPage || pagesBeforeSelectedPages && pagesAfterSelectedPages) {
            if (oldPage && currentPage - oldPage > 2) {
                pages.push('...');
            }

            if (oldPage && currentPage - oldPage == 2) {
                pages.push(oldPage + 1);
            }

            pages.push(currentPage);

            oldPage = currentPage;
        }
    }

    return pages;
}

function createPagination(pagination) {
    const filter = pagination.dataset.filter;
    // + transforma a string em número
    const page = +pagination.dataset.page;
    const total = +pagination.dataset.total;
    const pages = paginate(page, total);

    let elements = '';

    for (let page of pages) {
        if (String(page).includes('...')) {
            elements += `<span>${page}</span>`;
        } else {
            if (filter) {
                elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`;
            } else {
                elements += `<a href="?page=${page}">${page}</a>`;
            }
        }
    }

    pagination.innerHTML = elements;
}

const pagination = document.querySelector('.pagination');

if (pagination) {
    createPagination(pagination);
}