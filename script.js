// script.js - lógica comum do site
(function () {
  'use strict';

  // Dados dos "produtos" (serviços) - simples DB local
  const PRODUCTS = [
    {
      id: 1,
      title: 'Projeto de Paisagismo',
      price: 2400.00,
      short: 'Design completo, seleção de espécies e implantação.',
      long: 'Projeto completo com levantamento técnico, desenho, plantas e acompanhamento da implantação. Inclui lista de mudas e relatório de manutenção inicial.',
      img: 'img/jardim1.png'
    },
    {
      id: 2,
      title: 'Manutenção de Jardins (mensal)',
      price: 320.00,
      short: 'Poda, adubação e controle integrado.',
      long: 'Manutenção mensal com visitas, poda, adubação, limpeza e monitoramento de pragas. Pacotes trimestrais e anuais disponíveis.',
      img: 'img/jardim2.png'
    },
    {
      id: 3,
      title: 'Instalação de Irrigação',
      price: 1800.00,
      short: 'Sistema automático com programação e economia de água.',
      long: 'Projeto e instalação de sistema de irrigação automático; inclui programação e treinamento de uso. Garantia técnica conforme contrato.',
      img: 'img/jardim3.png'
    }
  ];

  // --- Helpers ---
  function q(sel, ctx=document) { return ctx.querySelector(sel); }
  function qAll(sel, ctx=document) { return Array.from(ctx.querySelectorAll(sel)); }
  function formatBRL(v) { return v.toLocaleString('pt-BR', { style:'currency', currency:'BRL' }); }
  function getQueryParams() {
    const params = {};
    location.search.replace(/^\?/,'').split('&').forEach(pair => {
      if(!pair) return;
      const [k,v] = pair.split('=').map(decodeURIComponent);
      params[k||''] = v||'';
    });
    return params;
  }



  // --- Render catálogo (servicos.html) ---
  function renderCatalog() {
    const catalog = q('#catalog');
    if (!catalog) return;
    catalog.innerHTML = '';
    PRODUCTS.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col-md-4';
      col.innerHTML = `
        <article class="card h-100">
          <img src="${p.img}" alt="${p.title}" class="card-img-top" style="height:180px;object-fit:cover;border-top-left-radius:12px;border-top-right-radius:12px;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${p.title}</h5>
            <p class="card-text text-muted">${p.short}</p>
            <div class="mt-auto d-flex justify-content-between align-items-center">
              <strong>${formatBRL(p.price)}</strong>
              <a href="detalhe.html?id=${p.id}" class="btn btn-outline-success">Ver detalhes</a>
            </div>
          </div>
        </article>
      `;
      catalog.appendChild(col);
    });
  }

  // --- Render detalhe (detalhe.html) ---
  function renderDetail() {
    const el = q('#productDetail');
    if (!el) return;
    const params = getQueryParams();
    const id = Number(params.id) || null;
    const product = PRODUCTS.find(x => x.id === id) || PRODUCTS[0];
    el.innerHTML = `
      <div class="col-md-6">
        <img src="${product.img}" alt="${product.title}" class="img-fluid rounded">
      </div>
      <div class="col-md-6">
        <h1>${product.title}</h1>
        <p class="text-muted">${product.long}</p>
        <p class="h4 text-success">${formatBRL(product.price)}</p>
        <div class="mt-4">
          <a href="checkout.html?id=${product.id}" class="btn btn-success btn-lg">Comprar</a>
          <a href="servicos.html" class="btn btn-outline-secondary ms-2">Voltar</a>
        </div>
      </div>
    `;
  }

  // --- Render checkout summary (checkout.html) ---
  function renderCheckoutSummary() {
    const el = q('#orderSummary');
    if (!el) return;
    const params = getQueryParams();
    const id = Number(params.id) || null;
    const product = PRODUCTS.find(x => x.id === id) || PRODUCTS[0];
    el.innerHTML = `
      <h5>Resumo do pedido</h5>
      <div class="d-flex gap-3 align-items-center">
        <img src="${product.img}" alt="${product.title}" style="width:96px;height:64px;object-fit:cover;border-radius:8px;">
        <div>
          <div class="fw-bold">${product.title}</div>
          <div class="text-muted small">${product.short}</div>
        </div>
        <div class="ms-auto fw-bold">${formatBRL(product.price)}</div>
      </div>
      <hr>
      <div class="text-muted small">Total</div>
      <div class="fs-5 fw-bold">${formatBRL(product.price)}</div>
    `;
  }

  // --- Checkout form submit (simulate purchase) ---
  function setupCheckoutForm() {
    const form = q('#checkoutForm');
    if (!form) return;

    // bootstrap style validation
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }

      const params = getQueryParams();
      const id = Number(params.id) || null;
      const product = PRODUCTS.find(x => x.id === id) || PRODUCTS[0];

      const order = {
        id: Date.now(),
        productId: product.id,
        productTitle: product.title,
        amount: product.price,
        customer: {
          name: form.name.value,
          email: form.email.value,
          address: form.address.value,
        },
        payment: form.payment.value,
        createdAt: new Date().toISOString()
      };

      // Simulate saving order (localStorage)
      const orders = JSON.parse(localStorage.getItem('verdeviva_orders') || '[]');
      orders.push(order);
      localStorage.setItem('verdeviva_orders', JSON.stringify(orders));

      // Show result
      const result = q('#result');
      result.innerHTML = `
        <div class="alert alert-success" role="alert">
          <strong>Pedido confirmado!</strong> Obrigado, ${order.customer.name}.<br>
          Pedido #: <strong>${order.id}</strong><br>
          Produto: ${order.productTitle} — ${formatBRL(order.amount)}<br>
          Enviamos um resumo para <em>${order.customer.email}</em> (simulado).
        </div>
      `;

      // Reset form
      form.reset();
      form.classList.remove('was-validated');
    }, false);
  }

  // --- Contact form (contato.html) ---
  function setupContactForm() {
    const form = q('#contactFormFull');
    if (!form) return;

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }

      const entry = {
        id: Date.now(),
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        service: form.service.value,
        message: form.message.value,
        createdAt: new Date().toISOString()
      };

      const entries = JSON.parse(localStorage.getItem('verdeviva_contacts') || '[]');
      entries.push(entry);
      localStorage.setItem('verdeviva_contacts', JSON.stringify(entries));

      q('#ct_result').innerHTML = `<div class="alert alert-success">Obrigado, ${entry.name}! Recebemos sua solicitação (simulado).</div>`;
      form.reset();
      form.classList.remove('was-validated');
    }, false);

    const clearBtn = q('#ct_clear');
    if (clearBtn) clearBtn.addEventListener('click', () => form.reset());
  }

  // --- Simple contact form for Home page (if present) ---
  function setupSmallContact() {
    const form = q('#contactForm'); // home small form id
    if (!form) return;
    form.addEventListener('submit', function(ev){
      ev.preventDefault();
      const quick = { id: Date.now(), name: form.name.value || '—', phone: form.phone.value || '—', service: form.service.value, msg: form.message.value || ''};
      const quicks = JSON.parse(localStorage.getItem('verdeviva_quick') || '[]');
      quicks.push(quick);
      localStorage.setItem('verdeviva_quick', JSON.stringify(quicks));
      alert(`Obrigado, ${quick.name}! Pedido de orçamento recebido (simulado).`);
      form.reset();
    });
    const clearBtn = q('#clearBtn');
    if (clearBtn) clearBtn.addEventListener('click', () => form.reset());
  }

  // --- Small utility to populate "Ver serviços" catalog and detail on DOM ready ---
  document.addEventListener('DOMContentLoaded', () => {
    renderCatalog();
    renderDetail();
    renderCheckoutSummary();
    setupCheckoutForm();
    setupContactForm();
    setupSmallContact();

    // Accessibility: ensure images have alt (set above) and that aria-live regions exist
    // (Already added where dynamic content renders)
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    
    // Procura por qualquer elemento com a classe .current-year OU os IDs antigos
    const yearElements = document.querySelectorAll('.current-year, [id^="year"]');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(el => el.textContent = currentYear);

    // Identifica a página atual e adiciona a classe 'active' no link correspondente
    const path = window.location.pathname;
    const page = path.split("/").pop() || 'index.html'; // Pega o nome do arquivo (ex: servicos.html)

    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
      // Remove active hardcoded do HTML para garantir que o JS controle
      link.classList.remove('active');
      
      const href = link.getAttribute('href');
      // Se o href do link for igual a página atual, ativa
      if (href === page || (page === 'index.html' && href === './')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });

    // INJEÇÃO DOS BOTÕES FLUTUANTES (WhatsApp e Topo)
    const floatContainer = document.createElement('div');
    
    // Usaremos SVG inline para não depender de FontAwesome externo
    const whatsappIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592z"/></svg>`;
    const arrowIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 0 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/></svg>`;

    floatContainer.innerHTML = `
      <button id="btnBackTop" class="btn-back-top" title="Voltar ao topo" aria-label="Voltar ao topo">
        ${arrowIcon}
      </button>

      <a href="https://wa.me/5511999999999?text=Olá!%20Gostaria%20de%20um%20orçamento%20VerdeViva." 
         class="btn-whatsapp-float" 
         target="_blank" 
         rel="noopener noreferrer"
         aria-label="Fale conosco no WhatsApp">
        ${whatsappIcon}
      </a>
    `;
    
    document.body.appendChild(floatContainer);

    // LÓGICA DE SCROLL (Mostrar/Ocultar botão topo)
    const btnTop = document.getElementById('btnBackTop');
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        btnTop.classList.add('show');
      } else {
        btnTop.classList.remove('show');
      }
    });

    btnTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

  });

  // Funções Utilitárias do Carrinho
  function getCart() {
    return JSON.parse(localStorage.getItem('verdeviva_cart') || '[]');
  }

  function saveCart(cart) {
    localStorage.setItem('verdeviva_cart', JSON.stringify(cart));
    updateCartCount();
  }

  function addToCart(productId) {
    const cart = getCart();
    cart.push(productId);
    saveCart(cart);
    
    // Efeito visual na bolinha
    const badge = document.querySelector('.cart-badge');
    if(badge) {
        badge.classList.add('bump');
        setTimeout(() => badge.classList.remove('bump'), 300);
    }
    
    alert('Serviço adicionado ao carrinho!');
  }

  function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1); // Remove o item pelo índice
    saveCart(cart);
    renderCheckoutSummary(); // Atualiza a tela de checkout
  }

  function updateCartCount() {
    const count = getCart().length;
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  // Botão de Carrinho no Menu
  function setupCartHeader() {
    const navbarNav = document.querySelector('.navbar-nav');
    if (!navbarNav) return;

    // Evita duplicar se já existir
    if (document.querySelector('.nav-cart-item')) return;

    const li = document.createElement('li');
    li.className = 'nav-item nav-cart-item';
    li.innerHTML = `
      <a class="nav-link" href="checkout.html" aria-label="Ver carrinho">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
          <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
        </svg>
        <span class="cart-badge" style="display:none">0</span>
      </a>
    `;
    navbarNav.appendChild(li);
    updateCartCount();
  }

  window.renderCatalog = function() { 
    const catalog = document.querySelector('#catalog');
    if (!catalog) return;
    catalog.innerHTML = '';
    
    PRODUCTS.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col-md-4';
      col.innerHTML = `
        <article class="card h-100">
          <img src="${p.img}" alt="${p.title}" class="card-img-top" style="height:180px;object-fit:cover;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${p.title}</h5>
            <p class="card-text text-muted">${p.short}</p>
            <div class="mt-auto d-flex justify-content-between align-items-center">
              <strong>${p.price.toLocaleString('pt-BR', { style:'currency', currency:'BRL' })}</strong>
              <div>
                <a href="detalhe.html?id=${p.id}" class="btn btn-sm btn-outline-secondary">Ver</a>
                <button onclick="addToCart(${p.id})" class="btn btn-sm btn-success">Adicionar</button>
              </div>
            </div>
          </div>
        </article>
      `;
      catalog.appendChild(col);
    });
  };

  // Atualizar Página de Detalhes
  window.renderDetail = function() {
    const el = document.querySelector('#productDetail');
    if (!el) return;
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get('id'));
    const product = PRODUCTS.find(x => x.id === id) || PRODUCTS[0];
    
    el.innerHTML = `
      <div class="col-md-6">
        <img src="${product.img}" alt="${product.title}" class="img-fluid rounded shadow-sm">
      </div>
      <div class="col-md-6">
        <h1>${product.title}</h1>
        <p class="text-muted">${product.long}</p>
        <p class="h4 text-success mb-4">${product.price.toLocaleString('pt-BR', { style:'currency', currency:'BRL' })}</p>
        <div class="d-grid gap-2 col-lg-6">
            <button onclick="addToCart(${product.id})" class="btn btn-success btn-lg">Adicionar ao Carrinho</button>
            <a href="servicos.html" class="btn btn-outline-secondary">Continuar comprando</a>
        </div>
      </div>
    `;
  };

  // Nova Lógica de Checkout (Múltiplos Itens)
  window.renderCheckoutSummary = function() {
    const el = document.querySelector('#orderSummary');
    if (!el) return;
    
    const cartIds = getCart();
    
    if (cartIds.length === 0) {
        el.innerHTML = `<div class="alert alert-warning">Seu carrinho está vazio. <a href="servicos.html">Voltar aos serviços</a></div>`;
        // Desabilita form
        const form = document.querySelector('#checkoutForm');
        if(form) form.style.display = 'none';
        return;
    }

    let total = 0;
    let html = `<h5>Seu Carrinho (${cartIds.length} itens)</h5><div class="checkout-item-list">`;
    
    cartIds.forEach((id, index) => {
        const product = PRODUCTS.find(p => p.id === Number(id));
        if(product) {
            total += product.price;
            html += `
                <div class="checkout-item">
                    <img src="${product.img}">
                    <div class="flex-grow-1">
                        <div class="small fw-bold">${product.title}</div>
                        <div class="text-muted small">${product.price.toLocaleString('pt-BR', { style:'currency', currency:'BRL' })}</div>
                    </div>
                    <button onclick="removeFromCart(${index})" class="btn-remove-item">Remover</button>
                </div>
            `;
        }
    });

    html += `</div>
      <div class="d-flex justify-content-between align-items-center mt-3">
        <span class="text-muted">Total Final</span>
        <span class="fs-4 fw-bold text-success">${total.toLocaleString('pt-BR', { style:'currency', currency:'BRL' })}</span>
      </div>`;
    
    el.innerHTML = html;
  };

  // Atualizar Submit do Formulário de Checkout
  window.setupCheckoutForm = function() {
    const form = document.querySelector('#checkoutForm');
    if (!form) return;

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }
      
      const cartIds = getCart();
      if(cartIds.length === 0) {
          alert("Carrinho vazio!");
          return;
      }

      // Calcula total e nomes para o registro
      let total = 0;
      const itemNames = [];
      cartIds.forEach(id => {
          const p = PRODUCTS.find(x => x.id === id);
          if(p) { total += p.price; itemNames.push(p.title); }
      });

      const order = {
        id: Date.now(),
        items: itemNames,
        amount: total,
        customer: {
          name: form.name.value,
          email: form.email.value,
          address: form.address.value,
        },
        payment: form.payment.value,
        createdAt: new Date().toISOString()
      };

      // Salva pedido
      const orders = JSON.parse(localStorage.getItem('verdeviva_orders') || '[]');
      orders.push(order);
      localStorage.setItem('verdeviva_orders', JSON.stringify(orders));

      // Limpa carrinho
      localStorage.removeItem('verdeviva_cart');
      updateCartCount();

      // Mostra resultado
      const result = document.querySelector('#result');
      // Oculta o formulário e o resumo
      form.parentElement.style.display = 'none';
      document.querySelector('#orderSummary').parentElement.style.display = 'none';
      document.querySelector('h1').textContent = 'Pedido Recebido!';

      result.innerHTML = `
        <div class="alert alert-success p-5 text-center" role="alert">
          <h2 class="alert-heading">Obrigado, ${order.customer.name}!</h2>
          <p>Seu pedido foi confirmado com sucesso.</p>
          <hr>
          <p class="mb-0">Itens: <strong>${itemNames.join(', ')}</strong></p>
          <p class="fs-4 mt-2">Total: ${total.toLocaleString('pt-BR', { style:'currency', currency:'BRL' })}</p>
          <br>
          <a href="index.html" class="btn btn-outline-success">Voltar ao Início</a>
        </div>
      `;
    }, false);
  };

  // Expor funções globais necessárias para os botões onclick no HTML gerado
  window.addToCart = addToCart;
  window.removeFromCart = removeFromCart;

  // Inicializa o Header do Carrinho ao carregar
  document.addEventListener('DOMContentLoaded', () => {
    setupCartHeader();
    // Recarrega as views com as novas funções
    if(document.querySelector('#catalog')) renderCatalog();
    if(document.querySelector('#productDetail')) renderDetail();
    if(document.querySelector('#orderSummary')) renderCheckoutSummary();
    if(document.querySelector('#checkoutForm')) setupCheckoutForm();
  });
})();
