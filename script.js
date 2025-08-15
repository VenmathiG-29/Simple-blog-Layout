// Back-to-top button
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.style.display = window.scrollY > 300 ? 'inline-block' : 'none';
});
backToTop.addEventListener('click', () => { window.scrollTo({top:0, behavior:'smooth'}); });

// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', () => { document.body.classList.toggle('dark-mode'); });

// Blog variables
const blogContainer = document.getElementById('blogContainer');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const postsPerLoad = 3;
let postsData = [];
let currentIndex = 0;

// Fetch posts from JSON/API
async function fetchPosts(){
  try{
    const res = await fetch('posts.json'); // Replace with API URL
    postsData = await res.json();
    renderPosts();
  } catch(err){ console.error(err); }
}

// Render posts
function renderPosts(){
  const fragment = document.createDocumentFragment();
  for(let i=currentIndex;i<currentIndex+postsPerLoad && i<postsData.length;i++){
    const post=postsData[i];
    const col=document.createElement('div');
    col.className='col-md-6 col-lg-4 blog-card-item show';
    col.dataset.category=post.category;
    col.innerHTML=`<div class="card h-100 shadow-sm border-0 blog-card">
      <img data-src="${post.img}" class="card-img-top lazy" alt="${post.title}">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${post.title}</h5>
        <p class="card-text flex-grow-1">${post.desc}</p>
        <a href="#" class="btn btn-outline-primary mt-2 align-self-start">Read More</a>
      </div>
    </div>`;
    fragment.appendChild(col);
  }
  blogContainer.appendChild(fragment);
  lazyLoadImages();
  currentIndex+=postsPerLoad;
  if(currentIndex>=postsData.length) loadMoreBtn.style.display='none';
}

// Lazy-load images
function lazyLoadImages(){
  const lazyImages=document.querySelectorAll('.lazy');
  const observer=new IntersectionObserver((entries, observer)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.src=entry.target.dataset.src;
        observer.unobserve(entry.target);
      }
    });
  });
  lazyImages.forEach(img=>observer.observe(img));
}

// Search filter
const searchInput=document.getElementById('searchInput');
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  document.querySelectorAll('.blog-card-item').forEach(card=>{
    const title = card.querySelector('.card-title').textContent.toLowerCase();
    card.style.display = title.includes(query) ? 'block' : 'none';
  });
});

// Category filter
document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const category = btn.dataset.category;
    document.querySelectorAll('.blog-card-item').forEach(card=>{
      card.style.display = category==='all'||card.dataset.category===category ? 'block' : 'none';
    });
  });
});

// Load more posts
loadMoreBtn.addEventListener('click', renderPosts);

// Initial fetch
fetchPosts();
