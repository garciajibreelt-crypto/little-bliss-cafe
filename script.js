const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const money = (n) => '₱' + Number(n || 0).toLocaleString('en-PH');
const STORE = { users: 'littleBlissUsers', orders: 'littleBlissOrders', products: 'littleBlissProducts', cart: 'littleBlissCart', session: 'littleBlissSession' };


const starterProducts = [
  ['Snacks','Solo Cheese Burger',80],['Snacks','Flavored Fries',100],['Snacks','Burger and Fries',120],['Snacks','Chick N Fries',150],['Snacks','Nachos',170],
  ['Pasta','Alfredo',170],['Pasta','Spicy Peanut Noodles',180],['Pasta','Stir Fry Chicken Udon',195],['Pasta','Shrimp Aglio Olio',220],
  ['Silog Meals','Spam Silog',149],['Silog Meals','Cornbeef Silog',159],['Silog Meals','Hungarian Silog',159],
  ['Espresso Drinks','Americano',90,105],['Espresso Drinks','Latté',95,110],['Espresso Drinks','Vanilla Latte',105,120],['Espresso Drinks','Spanish Latté',120,140],['Espresso Drinks','Dark Mocha',125,145],['Espresso Drinks','Salted Caramel',125,145],['Espresso Drinks','White Mocha',130,150],['Espresso Drinks','Caramel Macchiato',130,150],['Espresso Drinks','Sea Salt Latté',135,155],['Espresso Drinks','Cacao Latté',135,155],['Espresso Drinks','Biscoff Latté',140,160],['Espresso Drinks','Tiramisu Latte',150,170],['Espresso Drinks','Toasted Coconut Latte',150,170],
  ['Rice Meals','Chicken Ala King',169],['Rice Meals','Pork Tonkatsu',179],['Rice Meals','Buffalo Wings',179],['Rice Meals','Garlic Parmesan wings',179],['Rice Meals','Pork Sisig',189],
  ['Waffles','Classic',105],['Waffles','Hershey Oreo',130],['Waffles','Biscoff Crunch',140],['Waffles','Banana Caramel',140],
  ['Bliss Specials','Pumpkin Spice Latte',140,160],['Bliss Specials','Peppermint Mocha',140,160],['Bliss Specials','Cinnamon Salted Latte',145,165],['Bliss Specials','Brown Sugar Shaken Espresso',145,165],['Bliss Specials','Banana Oat Latte',150,170],['Bliss Specials','Barista Pink Drink',150,170],
  ['Non-Coffee Drinks','Choco Milk',110,130],['Non-Coffee Drinks','Oreo Milk',110,130],['Non-Coffee Drinks','Strawberry Milk',120,140],['Non-Coffee Drinks','Milo Dinosaur',120,140],['Non-Coffee Drinks','Cocoa cold foam',130,150],['Non-Coffee Drinks','Ube Coconut Cloud',130,150],
  ['Matcha Series','Matcha Latte',135,155],['Matcha Series','Matcha Sea Salt',140,160],['Matcha Series','Dirty Matcha',140,160],['Matcha Series','Matcha Berry',150,170],['Matcha Series','Matcha Mango',150,170],['Matcha Series','Matcha Biscoff',150,170],['Matcha Series','Matcha Oat Cereal',170,200],['Matcha Series','Matcha Coconut Cloud',170,200],
  ['Iced Shaken Tea','Strawberry Hibiscus Tea',95,115],['Iced Shaken Tea','Mango Peach Tea',95,115],['Iced Shaken Tea','Lemon Honey Tea',95,115]
].map((p,i)=>({id:i+1,category:p[0],name:p[1],price:p[2],price16:p[3]===undefined?null:p[2],price22:p[3]===undefined?null:p[3],image:'',description:''}));

function normalizeProduct(p){
  if(Array.isArray(p.variants)&&p.variants.length) return {...p, variants:p.variants.map(v=>({label:String(v.label||v.size||'Regular'),price:Number(v.price)||0}))};
  if(p.price16!==null&&p.price16!==undefined) return {...p,variants:[{label:'16oz',price:Number(p.price16)},{label:'22oz',price:Number(p.price22)||0}]};
  return {...p,variants:[{label:'Regular',price:Number(p.price)||0}]};
}
let products = (JSON.parse(localStorage.getItem(STORE.products) || 'null') || starterProducts).map(normalizeProduct);
let cart = JSON.parse(localStorage.getItem(STORE.cart) || '[]');
let currentUser = JSON.parse(sessionStorage.getItem(STORE.session) || 'null');
let loginMode = 'customer';
const getUsers = () => JSON.parse(localStorage.getItem(STORE.users) || '[]');
const getOrders = () => JSON.parse(localStorage.getItem(STORE.orders) || '[]');
const save = () => { localStorage.setItem(STORE.products,JSON.stringify(products)); localStorage.setItem(STORE.cart,JSON.stringify(cart)); };
const safe = (s) => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2300)}
function openOverlay(id){$('#'+id).classList.add('visible')}
function closeOverlay(id){$('#'+id).classList.remove('visible')}
$$('[data-close]').forEach(b=>b.addEventListener('click',()=>closeOverlay(b.dataset.close)));
$$('.overlay').forEach(o=>o.addEventListener('click',e=>{if(e.target===o)o.classList.remove('visible')}));
$('#year').textContent=new Date().getFullYear();
$('#mobileMenu').onclick=()=>$('#mainNav').classList.toggle('show');
$$('#mainNav a').forEach(a=>a.onclick=()=>$('#mainNav').classList.remove('show'));

const categoryDescriptions={
  'Espresso Drinks':'Classic espresso favorites, served hot or iced.',
  'Bliss Specials':'Little Bliss signature drinks to brighten your day.',
  'Non-Coffee Drinks':'Creamy and refreshing drinks without coffee.',
  'Matcha Series':'Smooth matcha favorites with delicious twists.',
  'Iced Shaken Tea':'Refreshing tea blends for a lighter sip.',
  'Snacks':'Quick bites and savory favorites.',
  'Pasta':'Comforting pasta dishes made for every craving.',
  'Silog Meals':'Filipino-style all-day breakfast favorites.',
  'Rice Meals':'Satisfying meals for a hearty appetite.',
  'Waffles':'Sweet waffles for your little treat.',
  'Cakes & Pastries':'Baked treats made with love.'
};
const categoryIcons={'Espresso Drinks':'☕','Bliss Specials':'🥤','Non-Coffee Drinks':'🥛','Matcha Series':'🍵','Iced Shaken Tea':'🧋','Snacks':'🍟','Pasta':'🍝','Silog Meals':'🍳','Rice Meals':'🍚','Waffles':'🧇','Cakes & Pastries':'🍰'};
let selectedCategory=null;
function categories(){return [...new Set(products.map(p=>p.category))]}
function renderCategories(){
  const wrap=$('#categoryTabs');
  wrap.innerHTML='';
  if(selectedCategory){
    wrap.innerHTML=`<button class="category-tab active" id="backToCategories">← All categories</button><span class="selected-category-label">${safe(selectedCategory)}</span>`;
    $('#backToCategories').onclick=()=>{selectedCategory=null;renderCategories();renderMenu()};
    return;
  }
  wrap.innerHTML=`<div class="category-card-grid">${categories().map(c=>`<button class="category-card" data-category="${safe(c)}"><span class="category-icon">${categoryIcons[c]||'✦'}</span><span class="category-card-name">${safe(c)}</span><small>${safe(categoryDescriptions[c]||'Explore our '+c.toLowerCase()+'.')}</small><span class="category-explore">Explore category ↗</span></button>`).join('')}</div>`;
  $$('[data-category]').forEach(b=>b.onclick=()=>{selectedCategory=b.dataset.category;renderCategories();renderMenu()});
}
function variantsFor(p){
  if(Array.isArray(p.variants)&&p.variants.length)return p.variants;
  return p.price16!==null&&p.price16!==undefined?[{label:'16oz',price:p.price16},{label:'22oz',price:p.price22}]:[{label:'Regular',price:p.price}];
}
function productPrice(p){const vs=variantsFor(p);return vs.length>1?`${vs.map(v=>`${safe(v.label)} ${money(v.price)}`).join(' · ')}`:money(vs[0].price)}
function renderMenu(){
  const q=$('#menuSearch').value.trim().toLowerCase();
  const list=products.filter(p=>(!selectedCategory||p.category===selectedCategory)&&`${p.name} ${p.category}`.toLowerCase().includes(q));
  if(!selectedCategory){
    if(q){
      const matches=categories().filter(c=>list.some(p=>p.category===c));
      $('#menuResults').innerHTML=matches.map(c=>`<section class="menu-category"><div class="category-heading"><div><span class="eyebrow">LITTLE BLISS MENU</span><h3>${safe(c)}</h3></div><button class="small-button" data-open-category="${safe(c)}">View category ↗</button></div><div class="product-grid">${list.filter(p=>p.category===c).map(p=>productCard(p)).join('')}</div></section>`).join('')||'<p class="no-results">No menu items found. Try another search.</p>';
      $$('[data-open-category]').forEach(b=>b.onclick=()=>{selectedCategory=b.dataset.openCategory;$('#menuSearch').value='';renderCategories();renderMenu()});
      bindAddButtons();
    }else $('#menuResults').innerHTML='<div class="category-prompt"><span class="eyebrow">WHAT ARE YOU CRAVING?</span><h3>Choose a category to explore.</h3><p>Tap any category above to see its menu and available sizes.</p></div>';
    return;
  }
  const items=list;
  const heading=`<div class="category-heading"><div><span class="eyebrow">LITTLE BLISS MENU</span><h3>${safe(selectedCategory)}</h3><p class="category-description">${safe(categoryDescriptions[selectedCategory]||'Explore our '+selectedCategory.toLowerCase()+'.')}</p></div><span class="item-count">${items.length} ${items.length===1?'item':'items'}</span></div>`;
  $('#menuResults').innerHTML=heading+(items.length?`<div class="product-grid">${items.map(p=>productCard(p)).join('')}</div>`:'<p class="no-results">No menu items found. Try another search.</p>');
  bindAddButtons();
}
function bindAddButtons(){
  $$('[data-add]').forEach(b=>b.onclick=()=>{const card=b.closest('.product-card');const size=card.querySelector('[data-variant]')?.value||'Regular';addToCart(Number(b.dataset.add),size)});
}
function productCard(p){
  const vs=variantsFor(p);const hasChoices=vs.length>1;
  return `<article class="product-card"><div class="product-photo">${p.image?`<img src="${p.image}" alt="${safe(p.name)}">`:`<div class="photo-placeholder"><span>PRODUCT PHOTO</span><small>Little Bliss</small></div>`}</div><div class="product-details"><span class="product-category">${safe(p.category)}</span><h4>${safe(p.name)}</h4>${p.description?`<p class="product-description">${safe(p.description)}</p>`:''}<div class="variant-options">${hasChoices?`<label class="variant-label">Choose size / type<select data-variant="${p.id}">${vs.map(v=>`<option value="${safe(v.label)}">${safe(v.label)} — ${money(v.price)}</option>`).join('')}</select></label>`:`<span class="single-price">${money(vs[0].price)} <small>${safe(vs[0].label)}</small></span>`}</div><div class="product-bottom"><b>${hasChoices?'Select an option':money(vs[0].price)}</b><button class="add-button" data-add="${p.id}">Add +</button></div></div></article>`;
}
$('#menuSearch').addEventListener('input',renderMenu);

function addToCart(id,size){
  const p=products.find(x=>x.id===id);if(!p)return;
  const variant=variantsFor(p).find(v=>v.label===size)||variantsFor(p)[0];
  const found=cart.find(x=>x.id===id&&x.size===variant.label);
  if(found)found.qty++;else cart.push({id,size:variant.label,unitPrice:Number(variant.price),qty:1});
  save();renderCartCount();toast('Added to your bag!');
}
function cartPrice(item){const p=products.find(x=>x.id===item.id);if(!p)return 0;const v=variantsFor(p).find(x=>x.label===item.size);return Number(item.unitPrice??v?.price??p.price??0)}
function renderCartCount(){$('#cartCount').textContent=cart.reduce((s,x)=>s+x.qty,0)}
function renderCart(){const wrap=$('#cartLines');if(!cart.length){wrap.innerHTML='<p class="empty-message">Your bag is empty. Browse the menu to add something delicious.</p>';$('#cartTotal').textContent=money(0);return}wrap.innerHTML=cart.map((item,i)=>{const p=products.find(x=>x.id===item.id);if(!p)return '';return `<div class="cart-row"><div><b>${safe(p.name)}</b><small>${item.size||p.category} · ${money(cartPrice(item))} each</small></div><div class="quantity"><button data-qty="${i}" data-step="-1">−</button>${item.qty}<button data-qty="${i}" data-step="1">+</button></div><button class="remove-item" data-remove="${i}">Remove</button></div>`}).join('');$('#cartTotal').textContent=money(cart.reduce((s,x)=>s+cartPrice(x)*x.qty,0));$$('[data-qty]').forEach(b=>b.onclick=()=>{const i=+b.dataset.qty;cart[i].qty+=+b.dataset.step;if(cart[i].qty<1)cart.splice(i,1);save();renderCart();renderCartCount()});$$('[data-remove]').forEach(b=>b.onclick=()=>{cart.splice(+b.dataset.remove,1);save();renderCart();renderCartCount()})}
$('#openCart').onclick=()=>{renderCart();openOverlay('cartOverlay')};

function setLoginMode(mode){loginMode=mode;const copy={customer:['Welcome back.','Log in to keep track of your orders.','Log in'],register:['Create your account.','Join Little Bliss and keep your order details together.','Create account'],admin:['Administrator access.','This area is for the café administrator.','Admin log in']};$('#loginTitle').textContent=copy[mode][0];$('#loginDescription').textContent=copy[mode][1];$('#loginSubmit').textContent=copy[mode][2];$('#customerNameWrap').hidden=mode!=='register';$('#customerNameWrap input').required=mode==='register';$('#loginMessage').textContent='';$$('[data-mode]').forEach(b=>b.classList.toggle('selected',b.dataset.mode===mode));}
$('#openLogin').onclick=()=>{if(currentUser){openAccount();return}setLoginMode('customer');openOverlay('loginOverlay')};
$$('[data-mode]').forEach(b=>b.onclick=()=>setLoginMode(b.dataset.mode));
$('#loginForm').onsubmit=e=>{e.preventDefault();const fd=new FormData(e.currentTarget);const email=String(fd.get('email')).trim().toLowerCase();const password=String(fd.get('password'));
  if(loginMode==='admin'){
    
    if(email==='admin@littlebliss.local'&&password==='LittleBlissAdmin123'){currentUser={name:'Administrator',email,role:'admin'};sessionStorage.setItem(STORE.session,JSON.stringify(currentUser));closeOverlay('loginOverlay');updateHeader();openAccount()}else $('#loginMessage').textContent='Incorrect administrator email or password.';
  }else if(loginMode==='register'){
    const name=String(fd.get('name')).trim();const users=getUsers();if(users.some(u=>u.email===email)){$('#loginMessage').textContent='An account with this email already exists.';return}users.push({name,email,password});localStorage.setItem(STORE.users,JSON.stringify(users));currentUser={name,email,role:'customer'};sessionStorage.setItem(STORE.session,JSON.stringify(currentUser));closeOverlay('loginOverlay');e.currentTarget.reset();updateHeader();toast('Account created. Welcome!');
  }else{const user=getUsers().find(u=>u.email===email&&u.password===password);if(!user){$('#loginMessage').textContent='Email or password is incorrect. Create an account if you are new.';return}currentUser={name:user.name,email:user.email,role:'customer'};sessionStorage.setItem(STORE.session,JSON.stringify(currentUser));closeOverlay('loginOverlay');e.currentTarget.reset();updateHeader();toast('Welcome back, '+user.name+'!')}
};
function updateHeader(){$('#openLogin').textContent=currentUser?(currentUser.role==='admin'?'Admin panel':'My account'):'Log in'}
function openAccount(){if(!currentUser){setLoginMode('customer');openOverlay('loginOverlay');return}openOverlay('accountOverlay');if(currentUser.role==='admin')renderAdmin();else renderCustomer()}
function signOut(){currentUser=null;sessionStorage.removeItem(STORE.session);closeOverlay('accountOverlay');updateHeader();toast('You are logged out.')}
function renderCustomer(){const orders=getOrders().filter(o=>o.email===currentUser.email);$('#accountTitle').textContent='Hello, '+currentUser.name+'.';$('#accountContent').innerHTML=`<div class="account-top"><div><b>${safe(currentUser.name)}</b><small>${safe(currentUser.email)}</small></div><button class="small-button" id="signOut">Log out</button></div><h3 class="account-subtitle">My orders</h3>${orders.length?orders.map(o=>`<div class="order-entry"><b>Order #${o.id}</b><span class="order-status">${safe(o.status)}</span><p>${new Date(o.created).toLocaleString()} · ${money(o.total)}</p><small>${o.items.map(i=>safe(i.name)+(i.size?' ('+safe(i.size)+')':'')+' × '+i.qty).join(', ')}</small></div>`).join(''):'<p class="empty-message">You have no orders yet. Explore the menu to find a favorite.</p>'}`;$('#signOut').onclick=signOut}
function renderAdmin(){const orders=getOrders();const users=getUsers();$('#accountTitle').textContent='Administrator dashboard.';$('#accountContent').innerHTML=`<div class="admin-top"><div><b>Welcome, Administrator</b><small>Manage the menu and view demo orders.</small></div><button class="small-button" id="signOut">Log out</button></div><div class="admin-stats"><div><small>Menu items</small><b>${products.length}</b></div><div><small>Customer accounts</small><b>${users.length}</b></div><div><small>Total orders</small><b>${orders.length}</b></div><div><small>Demo sales</small><b>${money(orders.reduce((s,o)=>s+o.total,0))}</b></div></div><div class="admin-tabs"><button class="active" data-admin-tab="products">Menu products</button><button data-admin-tab="orders">Orders</button><button data-admin-tab="customers">Customers</button></div><div id="adminPanel"></div>`;$('#signOut').onclick=signOut;$$('[data-admin-tab]').forEach(b=>b.onclick=()=>{$$('[data-admin-tab]').forEach(x=>x.classList.toggle('active',x===b));renderAdminPanel(b.dataset.adminTab)});renderAdminPanel('products')}
function renderAdminPanel(tab){
 const panel=$('#adminPanel');
 if(tab==='products'){
  panel.innerHTML=`<div class="admin-panel-heading"><h3>Manage menu</h3><button class="small-button" id="addProduct">+ Add product</button></div>
  <form class="product-editor" id="productEditor" hidden>
   <input type="hidden" name="id">
   <label>Product name<input name="name" required></label>
   <label>Category<input name="category" list="categoryOptions" required><datalist id="categoryOptions">${categories().map(c=>`<option value="${safe(c)}">`).join('')}</datalist></label>
   <label>Description (optional)<textarea name="description" rows="2"></textarea></label>
   <div class="variant-editor-head"><b>Size / Type and Price</b><small>Add as many options as this product needs.</small></div>
   <div id="variantEditorRows"></div>
   <button type="button" class="small-button" id="addVariantRow">+ Add size / type</button>
   <label>Product photo<input name="image" type="file" accept="image/*"></label>
   <div class="editor-actions"><button class="button" type="submit">Save product</button><button class="small-button" type="button" id="cancelProduct">Cancel</button></div>
   <p class="form-message" id="editorMessage"></p>
  </form>
  <div class="admin-product-list">${products.map(p=>`<div class="admin-product-row"><span>${safe(p.name)} <small>${safe(p.category)}</small></span><b>${productPrice(p)}</b><button class="small-button" data-edit="${p.id}">Edit</button><button class="small-button danger" data-delete="${p.id}">Delete</button></div>`).join('')}</div>`;
  $('#addProduct').onclick=()=>showProductEditor();
  $('#addVariantRow').onclick=()=>addVariantEditorRow();
  $('#cancelProduct').onclick=()=>{$('#productEditor').hidden=true};
  $('#productEditor').onsubmit=saveProduct;
  $$('[data-delete]').forEach(b=>b.onclick=()=>{if(confirm('Delete this menu item?')){products=products.filter(p=>p.id!==+b.dataset.delete);save();renderCategories();renderMenu();renderAdminPanel('products')}});
  $$('[data-edit]').forEach(b=>b.onclick=()=>showProductEditor(+b.dataset.edit));
 }
 if(tab==='orders'){
  const orders=getOrders();
  panel.innerHTML=`<h3>Customer orders</h3>${orders.length?orders.map(o=>`<div class="admin-order"><div><b>Order #${o.id} · ${safe(o.name)}</b><small>${safe(o.email)} · ${new Date(o.created).toLocaleString()}</small></div><b>${money(o.total)}</b><p>${o.items.map(i=>safe(i.name)+(i.size?' ('+safe(i.size)+')':'')+' × '+i.qty).join(', ')}</p><label>Status <select data-order-status="${o.id}">${['Pending','Confirmed','Preparing','Ready for pickup','Completed','Cancelled'].map(s=>`<option ${s===o.status?'selected':''}>${s}</option>`).join('')}</select></label></div>`).join(''):'<p class="empty-message">No orders have been placed in this browser yet.</p>'}`;
  $$('[data-order-status]').forEach(sel=>sel.onchange=()=>{const list=getOrders();const order=list.find(o=>o.id===+sel.dataset.orderStatus);if(order){order.status=sel.value;localStorage.setItem(STORE.orders,JSON.stringify(list));toast('Order status updated.')}});
 }
 if(tab==='customers'){const users=getUsers();panel.innerHTML=`<h3>Customer accounts</h3>${users.length?users.map(u=>`<div class="customer-row"><b>${safe(u.name)}</b><span>${safe(u.email)}</span></div>`).join(''):'<p class="empty-message">No customer accounts yet.</p>'}`}
}
function addVariantEditorRow(label='',price=''){
 const wrap=$('#variantEditorRows');const row=document.createElement('div');row.className='variant-editor-row';
 row.innerHTML=`<label>Size / type<input class="variant-name" placeholder="e.g. 12oz, 16oz, Hot, Regular" value="${safe(label)}" required></label><label>Price (₱)<input class="variant-price" type="number" min="0" step="0.01" value="${safe(price)}" required></label><button type="button" class="small-button danger remove-variant" aria-label="Remove option">×</button>`;
 row.querySelector('.remove-variant').onclick=()=>{if(wrap.children.length>1)row.remove();else toast('A product needs at least one price option.')};
 wrap.appendChild(row);
}
function showProductEditor(id=null){
 const form=$('#productEditor');form.reset();form.hidden=false;$('#variantEditorRows').innerHTML='';
 const p=id?products.find(x=>x.id===id):null;
 form.elements.id.value=p?p.id:'';
 form.elements.name.value=p?.name||'';
 form.elements.category.value=p?.category||'';
 form.elements.description.value=p?.description||'';
 (p?variantsFor(p):[{label:'Regular',price:''}]).forEach(v=>addVariantEditorRow(v.label,v.price));
 form.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function saveProduct(e){
 e.preventDefault();const form=e.currentTarget;const fd=new FormData(form);const id=Number(fd.get('id'))||Date.now();
 const variants=[...$('#variantEditorRows').querySelectorAll('.variant-editor-row')].map(row=>({label:row.querySelector('.variant-name').value.trim(),price:Number(row.querySelector('.variant-price').value)}));
 if(!variants.length||variants.some(v=>!v.label||!Number.isFinite(v.price)||v.price<0)){toast('Please add a valid size/type and price.');return}
 const existing=products.find(p=>p.id===id);const file=fd.get('image');
 const product={id,name:String(fd.get('name')).trim(),category:String(fd.get('category')).trim(),description:String(fd.get('description')||'').trim(),variants,image:existing?.image||''};
 const finish=()=>{if(existing)products=products.map(p=>p.id===id?product:p);else products.push(product);save();selectedCategory=null;renderCategories();renderMenu();renderAdminPanel('products');toast(existing?'Menu item updated.':'Menu item saved.')};
 if(file&&file.size){const reader=new FileReader();reader.onload=()=>{product.image=reader.result;finish()};reader.readAsDataURL(file)}else finish();
}
$('#checkoutForm').onsubmit=e=>{e.preventDefault();if(!cart.length){$('#checkoutMessage').textContent='Your bag is empty.';return}if(!currentUser){closeOverlay('cartOverlay');setLoginMode('customer');openOverlay('loginOverlay');$('#loginMessage').textContent='Please log in before placing an order.';return}const fd=new FormData(e.currentTarget);const order={id:Date.now(),name:currentUser.name,email:currentUser.email,phone:fd.get('phone'),address:fd.get('address'),notes:fd.get('notes'),items:cart.map(x=>{const p=products.find(y=>y.id===x.id);return {name:p?.name||'Menu item',size:x.size,qty:x.qty}}),total:cart.reduce((s,x)=>s+cartPrice(x)*x.qty,0),status:'Pending',created:new Date().toISOString()};const orders=getOrders();orders.unshift(order);localStorage.setItem(STORE.orders,JSON.stringify(orders));cart=[];save();renderCartCount();e.currentTarget.reset();closeOverlay('cartOverlay');toast('Demo order saved!');};
$('#openLogin').addEventListener('click',()=>{if(currentUser)openAccount()});
renderCategories();renderMenu();renderCartCount();updateHeader();
