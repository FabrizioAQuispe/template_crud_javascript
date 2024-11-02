const API_URL = 'https://jsonplaceholder.typicode.com/posts';
const tbody = document.getElementById('tbody');
const form = document.getElementById('form');
const popup = document.getElementById('popup');
const modal = document.getElementById('modal');
const closes = document.getElementById('close');


// Listar los registros en la tabla
document.addEventListener('DOMContentLoaded', () => {
    getPosts();
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await addPost();
})

closes.addEventListener('click', () => {
    modal.classList.remove('show');
});

const getPosts = async () => {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        data.forEach(post => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${post.userId}</td>
                <td>${post.id}</td>
                <td>${post.title}</td>
                <td>${post.body}</td>
                <td>
                    <button class="btn-popup edit" data-id="${post.id}" onclick="loadPostForEditing(${post.id})">Edit</button>
                    <button class="" data-id="${post.id}" onclick="deletePost(${post.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        attachButtonListeners();
    } catch (error) {
        console.error('ERROR SERVER RESPONSE: ' + error);
    }
}

const loadPostForEditing = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const post = await response.json();
        
        // Rellena los campos del formulario con los datos del post
        document.getElementById('userIds').value = post.userId;
        document.getElementById('ids').value = post.id; // Asegúrate de que este campo no sea editado
        document.getElementById('titles').value = post.title;
        document.getElementById('bodys').value = post.body;

        modal.classList.add('show'); // Muestra el modal
    } catch (error) {
        console.error('ERROR AL CARGAR POST: ' + error);
    }
}



const attachButtonListeners = () => {
    tbody.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit')) {
            const postId = e.target.getAttribute('data-id');
            editPost(postId); // Aquí llamas a la función editPost
        } else if (e.target.classList.contains('delete')) {
            const postId = e.target.getAttribute('data-id');
            deletePost(postId); // Aquí llamas a la función deletePost
        }
    });
}

tbody.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-popup')) {
        modal.classList.add('show'); // Muestra el modal al hacer clic en el botón
    }
});

closes.addEventListener('click', () => {
    modal.classList.remove('show');
});

const addPost = async () => {
    try {
        const userId = document.getElementById('userId').value;
        const title = document.getElementById('title').value;
        const body = document.getElementById('body').value;
    
        const response = await fetch(API_URL, {
            body: JSON.stringify({
                "userId": userId,
                "id": id,
                "title": title,
                "body": body
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        });

        const result = await response.json();
        console.log(result);
        getPosts(); // Actualiza la lista después de agregar
    } catch (error) {
        console.error('ERROR SERVER RESPONSE: ' + error);
    }
}

const editPost = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            body: JSON.stringify({
                // Aquí agregas los datos que deseas actualizar
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT'
        });

        const result = await response.json();
        console.log(result);
        getPosts(); // Actualiza la lista después de editar
    } catch (error) {
        console.error('ERROR SERVER RESPONSE: ' + error);
    }
}

// Aquí deberías implementar la función deletePost
const deletePost = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        console.log(id)

        if(!response.ok){
            alert('Error al eliminar el post');
        }else{
            alert('Se Elimino Correctamente');
        }
        getPosts(); // Actualiza la lista después de eliminar
    } catch (error) {
        console.error('ERROR SERVER RESPONSE: ' + error);
    }
}
