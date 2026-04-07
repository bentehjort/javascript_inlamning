'use strict';
import bandpageNewService from './bandpageNewService.js';
const url = "https://music.api.public.seido.se/api";

async function buildTable(){
    const _service = new bandpageNewService(url);
    const container = document.querySelector("#table-container");
    const data = await _service.readMusicGroupsAsync(0, false, "", 20);
    
    const table = document.createElement('table');
    
    
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['Bandname', 'Genre', 'Active since', 'Albums'];

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
        genreCell.textContent = band.genre;
        const yearCell = document.createElement('td');
        yearCell.textContent = band.establishedYear;
        const albumCell = document.createElement('td');
        albumCell.textContent = band.albums ? band.albums.length : 0;
        row.appendChild(nameCell);
        row.appendChild(genreCell);
        row.appendChild(yearCell);
        row.appendChild(albumCell);
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    container.appendChild(table);
}
buildTable();