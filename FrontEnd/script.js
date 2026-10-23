// const api = await fetch("http://localhost:5678/api/works")
const gallery = document.querySelector(".gallery");
// async function displayBackend() {
//     try {  
// const works = await getWorks()
// displayWorks(works)
// } catch (error) {
//     console.error("Erreur lors de la recupération ", error);
// }
// }
// displayBackend()
async function getWorks() {
    try {
        const api = await fetch("http://localhost:5678/api/works")
        const works = await api.json()
        console.table(works)
        displayWorks(works)
        return works;
    } catch (error) {
        console.error("Erreur lors de la recupération ", error);
    }
}
async function getCategories() {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        const categories = await response.json();
        return categories;
    } catch (error) {
        console.error("Erreur logique :", error);
    }
}
const div = document.querySelector('.filter')

function displayWorks(projets) {
    document.querySelector(".gallery").innerHTML = "";
    projets.forEach(work => {
        const figure = document.createElement('figure')
        const img = document.createElement('img')
        const figcaption = document.createElement('figcaption')
        img.src = work.imageUrl
        figcaption.innerText = work.title
        figure.appendChild(img)
        figure.appendChild(figcaption)
        document.querySelector(".gallery").appendChild(figure)
    })
}

function activeFilter(clicked) {
    const filters = document.querySelectorAll('.filter_li')
    filters.forEach((button) => {
        if (clicked === button) {
            button.classList.add('filter-active')
        } else {
            button.classList.remove('filter-active')
        }
    })
}
async function displayCategories() {
    try {
        const categories = await getCategories();
        console.table(categories)
        const tous = document.createElement('button');
        tous.innerText = 'Tous';
        tous.classList.add('filter_li', 'filter-active');
        div.appendChild(tous);
        tous.addEventListener('click', async () => {
            const works = await getWorks();
            displayWorks(works);
            activeFilter(tous)
        });
        //Création et gestion des boutons de catégories
        categories.forEach(categorie => {
            const button = document.createElement('button');
            button.innerText = categorie.name;
            button.classList.add('filter_li');
            div.appendChild(button);
            button.addEventListener('click', async () => {
                const works = await getWorks();
                const projetFiltre = works.filter(work => work.categoryId === categorie.id);
                displayWorks(projetFiltre);
                activeFilter(button)
            });
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
    }
}
displayCategories()
const bar = document.getElementById('edit-bar')
const button = document.getElementById('edit-btn')
const logout = document.getElementById('logout')
const filtersContainer = document.querySelector('.filter')
if (window.localStorage.getItem("token") != null) {
    document.body.style.paddingTop = "50px";
    bar.style.display = "flex";
    button.style.display = "flex";
    filtersContainer.style.display = "none";
    logout.innerText = "logout";
    logout.addEventListener("click", function(event) {
        event.preventDefault();
        window.localStorage.removeItem("token");
        window.location.reload();
    })
}
const modalBackgrounds = document.querySelector('.modal-background');
const modalCorss = document.querySelector('.modal-cross');
button.addEventListener('click', () => {
    displayModalWorks();
    modalBackgrounds.style.display = 'flex';
});
// on ferme le modal au clic sur croix
modalCorss.addEventListener('click', () => {
    modalBackgrounds.style.display = 'none'
})
const formCross = document.querySelector('.form-cross');
// On demande au JS de vérifier que la croix existe bien avant d'écouter le clic
if (formCross) {
    formCross.addEventListener('click', () => {
        modalBackgrounds.style.display = 'none';
    });
} else {
    console.warn("La croix .form-cross n'a pas été trouvée dans le HTML");
}
// on ferme si on clique à l'extérieur 
modalBackgrounds.addEventListener('click', (event) => {
    if (event.target === modalBackgrounds) {
        modalBackgrounds.style.display = 'none';
    }
});
const modalImgContainer = document.querySelector('.modal-img');
async function displayModalWorks() {
    try {
        modalImgContainer.innerHTML = "";
        const works = await getWorks()
        works.forEach(work => {
            const figure = document.createElement('figure');
            const img = document.createElement('img');
            img.src = work.imageUrl;
            img.alt = work.title
            img.classList.add('project-img');
            const trashIcon = document.createElement('img')
            trashIcon.src = "./assets/icons/trash.png";
            trashIcon.alt = "Supprimer";
            trashIcon.classList.add('trash-btn');
            trashIcon.dataset.id = work.id
            figure.appendChild(img);
            figure.appendChild(trashIcon);
            modalImgContainer.appendChild(figure)
            trashIcon.addEventListener('click', async (event) => {
                event.preventDefault();
                const projectId = trashIcon.dataset.id; //  on recup l'id mit de coté
                const token = window.localStorage.getItem("token") // on recup clé de admin
                try {
                    const response = await fetch(`http://localhost:5678/api/works/${projectId}`, {
                        method: 'DELETE',
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        figure.remove();
                        console.log("Projet supprimé");
                        getWorks()
                    } else {
                        console.log("Supression")
                    }
                } catch (error) {
                    console.log("Erreur de connexion à l'API  :", error);
                }
            });
        });
    } catch (error) {
        console.error("Erreur avec la galerie de la modale :", error)
    }
}
const btnAddPhoto = document.querySelector('.add-img')
const galleryView = document.querySelector('.modal')
const formView = document.querySelector('.modal-form')
const left = document.querySelector('.form-left')
btnAddPhoto.addEventListener('click', () => {
    galleryView.style.display = 'none';
    formView.style.display = 'block';
});
const titleInput = document.getElementById('title');
const categorySelect = document.getElementById('categorie');
const imageInput = document.getElementById('image-upload');
const validerBtn = document.querySelector('.valider');
if (titleInput && categorySelect && imageInput && validerBtn) {
    function checkForm() {
        if (titleInput.value !== "" && categorySelect.value !== "" && imageInput.files.length > 0) {
            validerBtn.style.backgroundColor = '#1D6154';
            validerBtn.style.color = 'white';
            validerBtn.disabled = false; // Active le bouton
            validerBtn.style.cursor = 'pointer';
        } else {
            validerBtn.style.backgroundColor = '#A7A7A7'
            validerBtn.disabled = true; // Désactive totalement le clic
            validerBtn.style.cursor = 'not-allowed';
        }
    }
    titleInput.addEventListener('input', checkForm);
    categorySelect.addEventListener('change', checkForm);
    imageInput.addEventListener('change', checkForm);
    checkForm()
} else {
    console.error("Bug de ciblage persistant : vérifier les ID HTML.");
}
left.addEventListener('click', () => {
    formView.style.display = 'none';
    galleryView.style.display = 'block'
})
const imageUpload = document.getElementById('image-upload');
const blockAddImg = document.querySelector('.block-add-img');
imageUpload.addEventListener('change', () => {
    const file = imageUpload.files[0];
    if (file.size > 4 * 1024 * 1024) {
        alert("L'image est trop grande (4mo maximum");
        imageUpload.value = ''; // réinitialisation du champ
        return // on stop 
    }
    const imageUrl = URL.createObjectURL(file); // url temp pr l'aperçu
    // ensuite on vide le contenu de lu block
    blockAddImg.innerHTML = '';
    // on met l'image dynamisquement
    const previewImg = document.createElement('img')
    previewImg.src = imageUrl;
    previewImg.style.width = '100%'
    previewImg.style.height = '100%'
    previewImg.style.objectFit = 'cover'
    previewImg.style.borderRadius = '3px'
    blockAddImg.appendChild(previewImg);
})
async function loadFormCategories() {
    try {
        const categories = await getCategories();
        const selectCategorie = document.getElementById('categorie');
        // option vide par defaut
        selectCategorie.innerHTML = '<option value="" disabled selected></option>';
        //création vrai option depûios api 
        categories.forEach(categorie => {
            const option = document.createElement('option');
            option.value = categorie.id;
            option.innerText = categorie.name;
            selectCategorie.appendChild(option);
        });
    } catch (error) {
        console.error("Erreur lors du changement des catégories :", error)
    }
}
loadFormCategories();
const formVerif = document.querySelector('#add-work-form')
formVerif.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target)
    const token = window.localStorage.getItem("token");
    try {
        const response = await fetch(`http://localhost:5678/api/works`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });
        if (response.ok) {
            event.target.reset()
            blockAddImg.innerHTML = `  <img src="./assets/icons/picture-svgrepo-com 1.png" alt="">

			<label for="image-upload" class="add-img-btn">+ Ajouter photo</label>
        
          <p>jpg, png : 4mo max</p>`;
            modalBackgrounds.style.display = 'none'
            validerBtn.style.backgroundColor = "#A7A7A7"
            getWorks()
        } else {
            console.log("Erreur dans le processus d'ajout")
        }
    } catch (error) {
        console.error("Erreur de connexion à l'API :", error);
    }
})
getWorks()