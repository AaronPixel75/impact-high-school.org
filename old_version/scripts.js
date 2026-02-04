
const b=document.querySelector('.hamburger');
const n=document.querySelector('.main-nav');
if(b){b.addEventListener('click',()=>{
 const o=n.classList.toggle('active');
 b.setAttribute('aria-expanded',o);
});}
