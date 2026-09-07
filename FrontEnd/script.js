// const api = await fetch("http://localhost:5678/api/works")

const gallery = document.querySelector(".gallery");

async function afficherBackend() {
    try {  
    const api = await fetch("http://localhost:5678/api/works")
    const works = await api.json()


    works.forEach(work => {
        const figure = document.createElement('figure')
        const img = document.createElement('img')
        const figcaption = document.createElement('figcaption')




        img.src = work.imageUrl
        img.alt = work.title
        figcaption.innerText = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
} catch (error) {
    console.error("Erreur lors de la recupération ", error);
}
}
afficherBackend()



const div = document.querySelector('.filter')

async function afficherFiltre () {
    try {

        const response = await fetch("http://localhost:5678/api/categories")
        const categories = await response.json()



        const tous = document.createElement('button');
        tous.innerText = 'Tous'
        tous.classList.add('filter_li')
        tous.classList.add('btn-tous')


        div.appendChild(tous)



        tous.addEventListener('click', () => {
            console.log("Tu as cliqué sur le bouton Tous !");
        })

        categories.forEach( categorie  => {
            const button = document.createElement('button')
            button.innerText = categorie.name
           button.classList.add('filter_li')
            div.appendChild(button)
        

            button.addEventListener('click', async () => {
                document.querySelector(".gallery").innerHTML = "";

                const responseWorks = await fetch("http://localhost:5678/api/works");
                const works = await responseWorks.json();

                const projetFiltre = works.filter(work => work.categoryId === categorie.id)


                console.log(projetFiltre)


                projetFiltre.forEach( work => {



                            const figure = document.createElement('figure')
                            const img = document.createElement('img')
                            const figcaption = document.createElement('figcaption')


                            img.src = work.imageUrl
                            figcaption.innerText = work.title


                            figure.appendChild(img)
                            figure.appendChild(figcaption)

                            document.querySelector(".gallery").appendChild(figure)




                })







                const boutonTous = document.querySelector('.btn-tous')


                boutonTous.addEventListener('click', async () => {



                                    const responseWorks = await fetch("http://localhost:5678/api/works");
                                    const works = await responseWorks.json();








                document.querySelector(".gallery").innerHTML="";

                        works.forEach( work => {

                            

                            const figure = document.createElement('figure')
                            const img = document.createElement('img')
                            const figcaption = document.createElement('figcaption')


                            img.src = work.imageUrl
                            figcaption.innerText = work.title


                            figure.appendChild(img)
                            figure.appendChild(figcaption)

                            document.querySelector(".gallery").appendChild(figure)




                })

                })
            })

        })







    } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
    }
}



afficherFiltre()




const bar = document.getElementById('edit-bar') 
const button = document.getElementById('edit-btn')
const logout = document.getElementById('logout')
const filtersContainer = document.querySelector('.filter')



if (window.localStorage.getItem("token") != null) {
    document.body.style.paddingTop = "50px"; 
    bar.style.display = "flex";
    button.style.display = "flex";
    filtersContainer.style.display = "none";
    logout.innerText = "Logout";



    logout.addEventListener("click", function(event) {
    event.preventDefault();

    window.localStorage.removeItem("token");

    window.location.reload();
})
}



const modalBackgrounds = document.querySelector('.modal-background');
const modalCorss = document.querySelector('.modal-cross');

button.addEventListener('click', () => {
    afficherGalerieModal();
    modalBackgrounds.style.display = 'flex';
});

// on ferme le modal au clic sur croix

modalCorss.addEventListener('click', () => {
    modalBackgrounds.style.display = 'none'
})


// on ferme si on clique à l'extérieur 

modalBackgrounds.addEventListener('click', (event) => {
    if (event.target === modalBackgrounds) {
        modalBackgrounds.style.display = 'none';
    }
});





const modalImgContainer = document.querySelector('.modal-img');

async function afficherGalerieModal() {
    try {
        modalImgContainer.innerHTML = "";

        const response = await fetch ("http://localhost:5678/api/works");
        const works = await response.json();



        works.forEach(work => {
            const figure = document.createElement('figure');
            const img = document.createElement('img');
            img.src = work.imageUrl;
            img.alt = work.title
            img.classList.add('project-img');


            const trashIcon  = document.createElement('img')
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
        } );

        if (response.ok) {
            figure.remove();
            console.log("Projet supprimé");
        } else {
            console.log("Supression")
        }
    } catch (error) {
        console.log("Erreur de connexion à l'API  :", error);
    }
});

figure.appendChild(img);
figure.appendChild(trashIcon);
modalImgContainer.appendChild(figure);



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




async function chargerCategoriesFormulaire() {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        const categories = await response.json(); 

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
chargerCategoriesFormulaire();




const formVerif = document.querySelector('#add-work-form')



formVerif.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target)


const token = window.localStorage.getItem("token");


try {

const response = await fetch(`http://localhost:5678/api/works`,  {
    method: 'POST',
    headers: {
        "Authorization": `Bearer ${token}`
    },
    body: formData
});


if (response.ok) {
    event.target.reset()
    blockAddImg.innerHTML = '';
    modalBackgrounds.style.display = 'none'

    document.querySelector('.gallery').innerHTML = '';
    afficherBackend();
} else {
    console.log("Erreur dans le processus d'ajout")
}} catch (error) {
    console.error("Erreur de connexion à l'API :", error);
}})