const urlAPI = "https://jsonplaceholder.typicode.com";

let postsGlobal = [];
let usersGlobal = [];

async function buscarRota(url) {
    const res = await fetch(url);

    if (res.ok) {
        return await res.json();
    }
}

async function buscarPostUsers() {

    usersGlobal = await buscarRota(urlAPI + "/users");
    postsGlobal = await buscarRota(urlAPI + "/posts");

    renderizarPosts();
}

function renderizarPosts() {

    const elemento = document.getElementById("elemento");

    elemento.innerHTML = "";

    for (let i = 0; i < postsGlobal.length; i++) {

        const post = postsGlobal[i];

        const userCarac = usersGlobal.find(
            u => u.id === post.userId
        );

        const userName = userCarac.username;

        elemento.innerHTML +=
            "<div class='card'>" +
                "<h2>" + post.title + "</h2>" +
                "<h3>" + userName + "</h3>" +
                "<div>" + post.body + "</div>" +
                "<br>" +
                "<button onclick='editarPost(" + post.id + ")'>" +
                    "Editar" +
                "</button>" +
                "<button onclick='excluirPost(" + post.id + ")'>" +
                    "Excluir" +
                "</button>" +
            "</div>";
    }
}

function excluirPost(id) {

    postsGlobal = postsGlobal.filter(
        post => post.id !== id
    );

    renderizarPosts();
}

function editarPost(id) {

    const post = postsGlobal.find(
        p => p.id === id
    );

    const novoTitulo = prompt(
        "Novo título:",
        post.title
    );

    const novoUsername = prompt(
        "Novo nome de usuário:",
        post.username
    );

    const novoConteudo = prompt(
        "Novo conteúdo:",
        post.body
    );

    if (
        novoTitulo !== null &&
        novoUsername !== null &&
        novoConteudo !== null
    ) {

        post.title = novoTitulo;
        post.username = novoUsername;
        post.body = novoConteudo;

        renderizarPosts();
    }
}

buscarPostUsers();