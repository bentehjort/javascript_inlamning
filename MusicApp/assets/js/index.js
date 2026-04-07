'use strict';
import bandpageNewService from './bandpageNewService.js';
const url = "https://music.api.public.seido.se/api";

const _service = new bandpageNewService(url);

const genreMap = {
    0: "Rock",
    1: "Blues",
    2: "Jazz",
    3: "Metal"
};
const viewHome = document.querySelector("#view-home");
const viewBands = document.querySelector("#view-bands");
const viewAddBand = document.querySelector("#view-add-band");
const viewBandDetails = document.querySelector("#view-band-details");

const searchNumberInfo = document.querySelector("#search-number-info");

const btnHome = document.querySelector("#nav-home");
const btnBands= document.querySelector("#nav-bands");
const btnAddBand = document.querySelector("#nav-addBand");
//hämtar pagination-controls
const btnPrev = document.querySelector("#btn-prev");
const btnNext = document.querySelector("#btn-next");
const pageInfo = document.querySelector("#page-info");
let currentPage = 0;
let searchFilter = "";

const container = document.querySelector("#table-container");
//hjälpmetod för att visa vyer
function ShowView (viewToShow) {
    viewHome.classList.add("hidden");
    viewBands.classList.add("hidden");
    viewAddBand.classList.add("hidden");
    viewBandDetails.classList.add("hidden");

    viewToShow.classList.remove("hidden");
}
btnHome.addEventListener("click", ()=>{
    ShowView(viewHome);
})
btnAddBand.addEventListener("click", ()=> {
    ShowView(viewAddBand);
})
btnBands.addEventListener("click", async () => {
    ShowView(viewBands);
    
    currentPage=0;
    searchFilter="";
    document.querySelector("#search-input").value = "";

    await buildTable();
})
//BANDSIDAN
btnPrev.addEventListener("click", async ()=>{
    if(currentPage>0){
        currentPage--;
        await buildTable();
    }
})
btnNext.addEventListener("click", async()=>{
    currentPage++;
    await buildTable();
})
async function buildTable(){
    container.innerHTML = "";
    const data = await _service.readMusicGroupsAsync(currentPage, false, searchFilter, 10);
    
    const table = document.createElement('table');
    
    
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['Bandname', 'Genre', 'Active since', 'Albums', ''];

    headers.forEach(text=> {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    data.pageItems.forEach(band=> {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.textContent = band.name;
        const genreCell= document.createElement('td');
        genreCell.textContent = genreMap[band.genre] || "Unknown genre";
        const yearCell = document.createElement('td');
        yearCell.textContent = band.establishedYear;
        const albumCell = document.createElement('td');
        albumCell.textContent = band.albums ? band.albums.length : 0;
        const btnCell = document.createElement('td');
        const detailsBtn = document.createElement('button');
        detailsBtn.textContent = "View details";
        detailsBtn.classList.add('details-button');
        detailsBtn.addEventListener("click", ()=> {
            console.log("Här syns detaljer för " + band.name);
            buildDetailsView(band);
        });
        btnCell.appendChild(detailsBtn);
        row.appendChild(nameCell);
        row.appendChild(genreCell);
        row.appendChild(yearCell);
        row.appendChild(albumCell);
        row.appendChild(btnCell);
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    container.appendChild(table);
    pageInfo.textContent = `Page: ${currentPage + 1}`;
    searchNumberInfo.textContent = `Total amount of bands found: ${data.dbItemsCount}`;
}
//SÖKFUNKTION
const btnSearch = document.querySelector("#search-button");
const searchInput = document.querySelector("#search-input");
btnSearch.addEventListener("click", async()=>{
    searchFilter = searchInput.value;
    currentPage = 0;
    await buildTable()
});

//DETALJSIDAN
function buildDetailsView(band){
    document.querySelector("#details-title").textContent=band.name;
    const genreText = document.querySelector("#details-genre");
    genreText.textContent = `Genre: ${genreMap[band.genre]}`;
    const yearText = document.querySelector("#details-year");
    yearText.textContent = `Established: ${band.establishedYear}`;

    const artistListElement = document.querySelector("#details-artistList");
    const albumListElement = document.querySelector("#details-albumList");
    artistListElement.innerHTML = "";
    albumListElement.innerHTML = "";
    if(band.artists && band.artists.length > 0){
        band.artists.forEach(artist => {
            const li = document.createElement("li");
            li.textContent = `${artist.firstName} ${artist.lastName}`;
            artistListElement.appendChild(li);
        });
    } else {
        artistListElement.innerHTML="No artists registrered";
    }
    if(band.albums && band.albums.length > 0){
        band.albums.forEach(album=> {
            const li = document.createElement("li");
            li.textContent = `${album.name}`;
            albumListElement.appendChild(li);
        })
    }
    else {albumListElement.innerHTML = "No albums registrered";}
    ShowView(viewBandDetails);
}
//BANDFORMULÄR
const form = document.querySelector("#addBandForm");
form.addEventListener("submit", async event=> {
    event.preventDefault();
    if(!form.checkValidity()){
        event.stopPropagation();
    }
    else{
        const bandName = document.querySelector('#addBandForm #bandName').value;
        const genres = Number(document.querySelector('#addBandForm #genres').value);
        const year = Number(document.querySelector('#addBandForm #yearsActive').value);

        let newItem = {
            
            "name": bandName,
            "establishedYear": year,
            "genre": genres,
            "albums": [],
            "artists": []
        };
        try{
            const data = await _service.createMusicGroupAsync(newItem);
        console.log("Server: ", data);
        if(!data?.item) throw new Error("Failed to add band.No data returned from server");

        form.reset();
        form.classList.remove('was-validated');
        alert("Your band was successfully added");

        buildDetailsView(data.item);
        }
        catch(error){
            console.error("Could not save band: ", error);
            alert("Something went wrong, check console for more info");
        }
        
        
    }
    form.classList.add('was-validated');
})
