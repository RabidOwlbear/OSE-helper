// import { XpAwardSheet } from "./xp-award.mjs";
// import { CoinAwardSheet } from "./coin-award.mjs";
export class OSRHPartySheet extends FormApplication {
  constructor(){
    super();
  }
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: 'Party Sheet',
      classes: ['osrh', 'application', 'party-sheet'],
      top: 120,
      left: 60,
      width: 300,
      height: 400,
      dragDrop: [
        {
          dragSelector: '.item',
          dropSelector: '.items'
        }
      ],
      template: `modules/osr-helper/templates/party-sheet/party-sheet.hbs`
    });
  }
  async _onDrop(event){
    const data = TextEditor.getDragEventData(event);
    if(data.type != 'Actor' || !data.uuid){
      return;
    }
    const actor = await fromUuid(data.uuid);
    if(OSRH.systemData.partySheet){
      if(!actor.flags?.[game.system.id]?.party?.active){
        await actor.setFlag(game.system.id, 'party', {active: true});
        // this.close()
        this.render();
      }
    }else{
      if(!actor.flags?.['osr-helper']?.party?.active){
        await actor.setFlag('osr-helper', 'party', {active: true});
        // this.close()
        this.render();
      }
    }
    
    return true
  }
  _onDragStart(event){
    try {
      const data = event.target.dataset
            const dragData = {
        uuid: data.uuid,
        type: 'Actor'
      }
      event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
    } catch{
      return false
    }
      return true
  }
  getData() {
    const context = super.getData()
    const party = OSRH.util.getPartyActors().party//game.actors.filter(a=>a.flags?.['osr-helper']?.party?.active);
    context.party = []
    party.map(p=>{
      context.party.push({
        uuid: p.uuid,
        img: p.img,
        name: p.name,
        hp: OSRH.util.getNestedValue(p, OSRH.systemData.paths.hp.val),
        hpMax: OSRH.util.getNestedValue(p, OSRH.systemData.paths.hp.max),
        ac: OSRH.util.getNestedValue(p, OSRH.systemData.paths.ac)
      })
    })
    return context
  }
  activateListeners(html) {
    const deleteBtns = html.find('.delete-btn');
    const portraits = html.find('.portrait');
    const xpBtn = html.find('.xp-btn')[0];
    const coinBtn = html.find('.coin-btn')[0];
    // delete event listener
    deleteBtns.map(b=>{
      deleteBtns[b].addEventListener('click', async (e)=>{
        e.preventDefault();
        let uuid = e.target.closest('.item').dataset.uuid;
        await this._unsetPartyFlag(uuid);
        // this.render(true)
      })
      // open xp award

    })
    // xpBtn.addEventListener('click', (e)=>{
    //   e.preventDefault();
    //   const openSheet = document.querySelector('.xp-award');
    //   if(!openSheet){
    //             new XpAwardSheet({x:e.x, y:e.y - 350}).render(true);
    //   } 
      
    // })
    // // open coin award sheet
    // coinBtn.addEventListener('click', (e)=>{
    //   e.preventDefault();
    //   const openSheet = document.querySelector('.coin-award');
    //   if(!openSheet){
    //             new CoinAwardSheet({x:e.x, y:e.y - 350}).render(true);
    //   } 
      
    // })
    // open sheet listener
    portraits.map(async p=>{
      portraits[p].addEventListener('click',async  e=>{
        e.preventDefault();
        const actor = await fromUuid(e.target.closest('.party-actor').dataset.uuid);
        actor.sheet.render(true)
      })
    });
  }

  async _setPartyFlag(uuid){
    const actor = await fromUuid(uuid);
    actor.setFlag('osr-helper', 'party', {active: true});
  }
  async _unsetPartyFlag(uuid){
    const actor = await fromUuid(uuid);
    await actor.unsetFlag('osr-helper', 'party')
    this.render()

  }
}