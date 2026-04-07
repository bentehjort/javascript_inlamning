'use strict';
function musicService (url){
    this.url = url;
    this._myFetch = async function (url, method = null, body = null) {
      try {
    
        method ??= 'GET';
        let res = await fetch(url, {
          method: method,
          headers: { 'content-type': 'application/json' },
          body: body ? JSON.stringify(body) : null
        });
    
        if (res.ok) {
    
          console.log(`\n${method} Request successful @ ${url}`);

          const contentType = res.headers.get("content-type");
    
          //get the data from server
          if(contentType && contentType.includes("application/json")){
            let data = await res.json();
          return data;
          }
          
        }
        else {
    
          //typcially you would log an error instead
          //console.log(`Failed to recieved data from server: ${res.status}`);
          //alert(`Failed to recieved data from server: ${res.status}`);
          return "Success- no data returned";
        }
      }
      catch (err) {
    
        //typcially you would log an error instead
        console.log(`Failed to recieved data from server: ${err.message}`);
        alert(`Failed to recieved data from server: ${err.message}`);
      }
    }
    this._readItemsAsync = async function (reqUrl, pageNr, flat, filter, pageSize)
    {
      reqUrl += `?flat=${flat}&pageNr=${pageNr}&pageSize=${pageSize}`;
      if (filter != null)
      {
        reqUrl += `&filter=${filter}`
      }
      let data = await this._myFetch(reqUrl);
      return data;
    }
    
    this._readItemAsync = async function (reqUrl, id, flat)
    {
      reqUrl += `?flat=${flat}&id=${id}`;
      let data = await this._myFetch(reqUrl);
      return data;
    }

    this._readItemDtoAsync = async function (reqUrl, id, flat)
    {
      reqUrl += `?id=${id}`;
      let data = await this._myFetch(reqUrl);
      return data;
    }

    this._updateItemAsync = async function (reqUrl, id, newItem)
    {
      reqUrl += `/${id}`;
      let data = await this._myFetch(reqUrl, 'PUT', newItem);
      return data;
    }

    this._createItemAsync = async function (reqUrl, newItem)
    {
      let data = await this._myFetch(reqUrl, 'POST', newItem);
      return data;
    }

    this._deleteItemAsync = async function (reqUrl, id)
    {
      reqUrl += `/${id}`;
      let data = await this._myFetch(reqUrl, 'DELETE');
      return data;
    }

    this._createItemAsync = async function (reqUrl, newItem)
    {
      let data = await this._myFetch(reqUrl, 'POST', newItem);
      return data;
    }
    //#endregion

    this.readInfoAsync = async function readInfoAsync() 
    {
      return await this._myFetch(`${this.url}/Guest/Info`);
    }
 //using traditional function syntax (like in C#)
    this.readMusicGroupsAsync = async function (pageNr, flat=false, filter=null, pageSize=10) 
    {
      return await this._readItemsAsync(`${this.url}/MusicGroups/Read`, pageNr, flat, filter, pageSize);
    }
    
    //using JavaScrip's ability to asign a function to a variable or property (like c# delegate)
    this.readMusicGroupAsync = async (id, flat=true) => this._readItemAsync(`${this.url}/MusicGroups/ReadItem`, id, flat);
    
    this.readMusicGroupDtoAsync = async (id) => this._readItemDtoAsync(`${this.url}/MusicGroups/ReadItemDto`, id);
   
    this.updateMusicGroupAsync = async (id, newItem) => this._updateItemAsync(`${this.url}/MusicGroups/UpdateItem`, id, newItem);
  
    this.createMusicGroupAsync = async (newItem) => this._createItemAsync(`${this.url}/MusicGroups/CreateItem`, newItem);
 
    this.deleteMusicGroupAsync = async (id) => this._deleteItemAsync(`${this.url}/MusicGroups/DeleteItem`, id);
    //#endregion

    //#region CRUD Album
    this.readAlbumsAsync = async (pageNr, flat=false, filter=null, pageSize=10) => this._readItemsAsync(`${this.url}/Albums/Read`, pageNr, flat, filter, pageSize);
    
    this.readAlbumAsync  = async (id, flat=true) => this._readItemAsync(`${this.url}/Albums/ReadItem`, id, flat);

    this.readAlbumDtoAsync = async (id) => this._readItemDtoAsync(`${this.url}/Albums/ReadItemDto`, id);

    this.updateAlbumAsync = async (id, newItem) => this._updateItemAsync(`${this.url}/Albums/UpdateItem`, id, newItem);

    this.createAlbumAsync = async (newItem) => this._createItemAsync(`${this.url}/Albums/CreateItem`, newItem);

    this.deleteAlbumAsync = async (id) => this._deleteItemAsync(`${this.url}/Albums/DeleteItem`, id);
    //#endregion
    
    //#region CRUD Artist
    this.readArtistsAsync = async (pageNr, flat=false, filter=null, pageSize=10) => this._readItemsAsync(`${this.url}/Artists/Read`, pageNr, flat, filter, pageSize);
    
    this.readArtistAsync = async (id, flat=true) => this._readItemAsync(`${this.url}/Artists/ReadItem`, id, flat);

    this.readArtistDtoAsync = async (id, flat=true) => this._readItemDtoAsync(`${this.url}/Artists/ReadItemDto`, id);
    
    this.updateArtistAsync = async (id, newItem) => this._updateItemAsync(`${this.url}/Artists/UpdateItem`, id, newItem);

    this.createArtistAsync = async (newItem) => this._createItemAsync(`${this.url}/Artists/CreateItem`, newItem);

    this.deleteArtistAsync = async (id) => this._deleteItemAsync(`${this.url}/Artists/DeleteItem`, id);
    //#endregion
}

export default musicService;

