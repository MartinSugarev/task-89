import EventEmitter from "eventemitter3";
import image from "../images/planet.svg";

export default class Application extends EventEmitter {
  static get events() {
    return {
      READY: "ready",
    };
  }

  constructor() {
    super();

    const box = document.createElement("div");
    box.classList.add("box");
    document.body.querySelector(".main").appendChild(box);

    this.emit(Application.events.READY);
  }

  _render({ name, terrain, population }) {
    return `
<article class="media">
  <div class="media-left">
    <figure class="image is-64x64">
      <img src="${image}" alt="planet">
    </figure>
  </div>
  <div class="media-content">
    <div class="content">
    <h4>${name}</h4>
      <p>
        <span class="tag">${terrain}</span> <span class="tag">${population}</span>
        <br>
      </p>
    </div>
  </div>
</article>
    `;
  }
  
  async _load(){
    let url = 'https://swapi.boom.dev/api/planets'
    let allRequests = []
    
    while(url){
      const planetPromise = await fetch(url)
      const data = await planetPromise.json() 
      allRequests = [...allRequests, ...data.results]
      url = data.next
    }

   return allRequests 


  }
  _create(){
    const allData  = this._load()
    const allInfo = allData.map(planet => {
      return this._render({
        name: planet.name,
        terrain: planet.terrain,
        population: planet.population
      })
  })
  
  document.querySelector(".box").innerHTML = allInfo
  }
  _startLoading(){}
  _stopLoading(){
    if(document.querySelector(".box").innerHTML !== ''){
      document.querySelector("progress").style.display = "none"
    }
  }

}


// The project must run when started via npm run start
// The first request must not have a page query parameter.
// There must be a property named _loading defined in Application.js which is a < progress > element
// There must be a method named _load defined in Application.js
// There must be a method named _create defined in Application.js
// There must be a method named _startLoading defined in Application.js
// There must be a method named _stopLoading defined in Application.js
// Fetch must be used inside of the _load method
// Await must be used inside of the _load method
// The _load method must be async
// All planets must be visualized as boxes on the page
// The loading bar must be visible while making the requests
// The loading bar must hide when the requests are completed
// The first request URL must be /planets instead of /planets?page=1
