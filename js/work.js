/* Catalogue state is validated, persisted in the URL and safe on file://. */
(() => {
  'use strict';
  const {$,$$,L,t,escape,buildCard,reveal}=NS;
  const state={filter:'all',q:'',sort:'new',view:'grid'};
  function restore(){
    const p=new URLSearchParams(location.search);
    state.filter=NS.categories.some(c=>c.id===p.get('filter'))?p.get('filter'):'all';
    state.q=p.get('q')||'';state.sort=['new','old','az'].includes(p.get('sort'))?p.get('sort'):'new';state.view=p.get('view')==='list'?'list':'grid';
  }
  function match(w,filter){return filter==='all'||w.category===filter||(w.categories||[]).includes(filter);}
  function filters(){
    $('#filters').innerHTML=NS.categories.map(c=>`<button class="filter" type="button" data-filter="${escape(c.id)}" aria-pressed="${c.id===state.filter}">${escape(L(c.label))}<b>${NS.work.filter(w=>match(w,c.id)).length}</b></button>`).join('');
    $$('.filter').forEach(b=>b.addEventListener('click',()=>{state.filter=b.dataset.filter;paint();}));
  }
  function select(){
    const q=state.q.trim().toLocaleLowerCase(NS.lang());
    const list=NS.work.filter(w=>match(w,state.filter)).filter(w=>{
      const hay=[w.title.en,w.title.ru,w.tagline.en,w.tagline.ru,NS.catLabel(w.category),...(w.tags||[])].join(' ').toLocaleLowerCase(NS.lang());return !q||hay.includes(q);
    });
    if(state.sort==='az')list.sort((a,b)=>L(a.title).localeCompare(L(b.title),NS.lang()));
    else list.sort((a,b)=>{const delta=String(a.date||a.year).localeCompare(String(b.date||b.year));return state.sort==='old'?delta:-delta;});
    return list;
  }
  function paint(){
    const list=select(),host=$('#grid');host.replaceChildren();host.classList.toggle('is-list',state.view==='list');
    list.forEach(w=>{const card=buildCard(w,{size:'std'});card.classList.add('reveal');host.append(card);});
    $$('.filter').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===state.filter)));
    $('#viewGrid').setAttribute('aria-pressed',String(state.view==='grid'));$('#viewList').setAttribute('aria-pressed',String(state.view==='list'));
    $('#q').value=state.q;$('#sort').value=state.sort;
    const n=list.length;const ru=n%10===1&&n%100!==11?'кейс':n%10>=2&&n%10<=4&&(n%100<12||n%100>14)?'кейса':'кейсов';
    $('#count').textContent=`${String(n).padStart(2,'0')} ${NS.lang()==='ru'?ru:n===1?'case':'cases'}`;
    $('#empty').hidden=n!==0;$('#clear').hidden=state.filter==='all'&&!state.q&&state.sort==='new';
    const url=new URL(location.href);url.search='';
    if(state.filter!=='all')url.searchParams.set('filter',state.filter);if(state.q)url.searchParams.set('q',state.q);if(state.sort!=='new')url.searchParams.set('sort',state.sort);if(state.view!=='grid')url.searchParams.set('view',state.view);
    try{history.replaceState(null,'',url.href);}catch(_){/* Some file:// hosts restrict history. The filters still work. */}
    reveal();
  }
  $('#q').addEventListener('input',e=>{state.q=e.target.value;paint();});
  $('#sort').addEventListener('change',e=>{state.sort=e.target.value;paint();});
  $('#viewGrid').addEventListener('click',()=>{state.view='grid';paint();});$('#viewList').addEventListener('click',()=>{state.view='list';paint();});
  function reset(){Object.assign(state,{filter:'all',q:'',sort:'new'});paint();$('#q').focus();}
  $('#clear').addEventListener('click',reset);$('#clear2').addEventListener('click',reset);
  document.addEventListener('northstar:lang',()=>{filters();paint();});
  addEventListener('popstate',()=>{restore();filters();paint();});
  restore();filters();paint();
})();
