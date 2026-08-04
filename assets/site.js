/* shared: reveals, marquee, chat */
const _obs = new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');_obs.unobserve(e.target)}})},{threshold:.14});
document.querySelectorAll('.reveal').forEach(el=>_obs.observe(el));
const _pt=document.getElementById('pTrack'); if(_pt && !_pt.dataset.dup){_pt.dataset.dup=1;_pt.innerHTML+=_pt.innerHTML}
/* ------- chat (fully scripted) ------- */
let chatOpened=false, autoOpened=false;
const T={
  greet:"Hello! Welcome to Iterum. Are you an operator or investor looking at our solutions, or a resident with an appliance issue?",
  opts:[["Book a demo","demo"],["I'm a resident with an issue","resident"],["What is Iterum IQ?","iq"]],
  demo:"Great. So the right person runs your demo, roughly how many units are in your portfolio?",
  demoOpts:[["Under 500","slot"],["500 to 2,000","slot"],["Over 2,000","slot"]],
  slot:"Perfect. There's space on Thursday morning or Friday afternoon for a 30 minute walkthrough of the platform and service model. Which suits?",
  slotOpts:[["Thursday morning","booked"],["Friday afternoon","booked"]],
  booked:"Booked. You'll get a calendar invite and a short agenda by email. The team will come prepared with examples relevant to your portfolio size. Anything else?",
  resident:"Sorry you're having trouble, let's get it sorted. What kind of appliance is it?",
  resOpts:[["Washing machine","tri"],["Fridge freezer","tri"],["Oven or hob","tri"]],
  tri:"Thanks. Could you send a photo of the fault or any error code on the display? That helps us arrive with the right part first time.",
  triOpts:[["Photo sent","eng"]],
  eng:"Received. Based on that, this needs an engineer visit. Tomorrow morning or afternoon?",
  engOpts:[["Morning","done"],["Afternoon","done"]],
  done:"Booked, and your property manager has been notified. You'll get a confirmation here with the arrival window. Anything else tonight?",
  iq:"Iterum IQ is our appliance data engine: every repair, replacement, budget and carbon figure tracked per unit and reported per portfolio. The best way to see it is a 30 minute demo. Want to grab a slot?",
  iqOpts:[["Yes, book a demo","demo"],["Not right now","bye"]],
  end:[["That's everything, thanks!","bye"]],
  bye:"Anytime. We're here whenever you need us."
};
function toggleChat(){
  const p=document.getElementById('chatPanel');
  p.classList.toggle('open');
  if(p.classList.contains('open')&&!chatOpened){chatOpened=true;botSay(T.greet,T.opts)}
}
function openChat(){const p=document.getElementById('chatPanel');if(!p.classList.contains('open'))toggleChat()}
function el(c,h){const d=document.createElement('div');d.className=c;d.innerHTML=h;return d}
function sb(){const b=document.getElementById('chatBody');b.scrollTop=b.scrollHeight}
function clearChoices(){document.querySelectorAll('#chatBody .choices').forEach(c=>c.remove())}
function userSay(t){clearChoices();document.getElementById('chatBody').appendChild(el('cmsg user',t));sb()}
function botSay(text,choices){
  const body=document.getElementById('chatBody');
  const ty=el('typing','<i></i><i></i><i></i>');body.appendChild(ty);sb();
  setTimeout(()=>{ty.remove();body.appendChild(el('cmsg bot',text));
    if(choices&&choices.length){const c=document.createElement('div');c.className='choices';
      choices.forEach(([label,key])=>{const btn=document.createElement('button');btn.textContent=label;
        btn.onclick=()=>{userSay(label);setTimeout(()=>route(key),320)};c.appendChild(btn)});
      body.appendChild(c)}
    sb()},950)
}
function route(k){
  ({demo:()=>botSay(T.demo,T.demoOpts),slot:()=>botSay(T.slot,T.slotOpts),booked:()=>botSay(T.booked,T.end),
    resident:()=>botSay(T.resident,T.resOpts),tri:()=>botSay(T.tri,T.triOpts),eng:()=>botSay(T.eng,T.engOpts),
    done:()=>botSay(T.done,T.end),iq:()=>botSay(T.iq,T.iqOpts),bye:()=>botSay(T.bye)})[k]();
}
/* gentle auto-open once; desktop only */
setTimeout(()=>{if(!chatOpened&&!autoOpened&&window.innerWidth>760){autoOpened=true;openChat()}},7000);
