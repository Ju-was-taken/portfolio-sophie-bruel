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




