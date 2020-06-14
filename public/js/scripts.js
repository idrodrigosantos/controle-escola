// Seleciona a página atual
const currentPage = location.pathname;
// Seleciona os itens do menu
const menuItems = document.querySelectorAll('header nav a');

for (item of menuItems) {
    if (currentPage.includes(item.getAttribute('href'))) {
        item.classList.add('active');
    }
}