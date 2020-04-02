const pagesToPreload = ['home', 'about', 'portfolio', 'contact'];
const preloadedPages = {};

function showPage(name) {
    const main = document.getElementsByTagName('main')[0];
    if (name in preloadedPages) {
        main.innerHTML = preloadedPages[name];
        window.history.pushState(null, null, name);
    }
}

function loadNavigation() {
    const navigation = [...document.getElementsByTagName('a')].filter(element => element.hasAttribute('navigate'));
    navigation.forEach(element => element.onclick = () => showPage(element.getAttribute('navigate')));
}

window.addEventListener('load', () => {
    let requestPage = window.location.pathname.substr(1);
    loadNavigation();
    for (let page of pagesToPreload) {
        get(`/${page}.html`, (data) => {
            preloadedPages[page] = data;
            if (requestPage.toLowerCase() == page.toLowerCase()) showPage(page);
        });
    }
});