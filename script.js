// ==================== 頁面切換功能 ====================
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });

  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
    targetPage.scrollTop = 0;
  }

  updateNavigation(pageId);
}

function updateNavigation(activePageId) {
  const navLinks = document.querySelectorAll('.nav-links a');
  const indicator = document.querySelector('.nav-indicator');

  navLinks.forEach(link => link.classList.remove('active'));
  const activeLink = document.querySelector(`[data-page="${activePageId}"]`);

  if (activeLink) {
    activeLink.classList.add('active');
    const linkRect = activeLink.getBoundingClientRect();
    const navRect = activeLink.parentElement.getBoundingClientRect();
    indicator.style.width = `${linkRect.width}px`;
    indicator.style.height = `${linkRect.height}px`;
    indicator.style.left = `${linkRect.left - navRect.left}px`;
    indicator.style.top = `${linkRect.top - navRect.top}px`;
  } else if (activePageId === 'home') {
    indicator.style.width = '0px';
  }
}

// ==================== 導航連結事件 ====================
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', function (e) {
    const pageId = this.getAttribute('data-page');
    if (!pageId) return;
    e.preventDefault();

    const currentPage = document.querySelector('.page.active');
    const targetPage = document.getElementById(pageId);
    if (currentPage === targetPage) return;

    if (pageId === 'about' && currentPage.id === 'home') {
      scrollToAbout();
      return;
    }

    fadeTransition(currentPage, targetPage);
    updateNavigation(pageId);
  });
});

function fadeTransition(fromPage, toPage) {
  if (!fromPage || !toPage) return;

  toPage.style.display = 'block';
  toPage.style.opacity = '0';
  toPage.classList.add('active');
  fromPage.style.transition = 'opacity 0.5s ease';
  toPage.style.transition = 'opacity 0.5s ease';
  fromPage.style.opacity = '1';
  toPage.style.opacity = '0';
  void toPage.offsetWidth;

  fromPage.style.opacity = '0';
  toPage.style.opacity = '1';

  setTimeout(() => {
    fromPage.classList.remove('active');
    fromPage.style.display = 'none';
    fromPage.style.transition = '';
    toPage.style.transition = '';

    if (toPage.id === 'about') {
      toPage.scrollTop = 0;
      initPhysicsWhenAboutActive();
    }
  }, 500);
}

// ==================== Logo 回首頁 ====================
document.querySelector('.logo').addEventListener('click', function (e) {
  e.preventDefault();
  const homePage = document.getElementById('home');
  const currentActivePage = document.querySelector('.page.active');
  if (currentActivePage === homePage) return;

  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('slide-up-out', 'slide-down-in', 'slide-up-in', 'slide-down-out');
  });

  homePage.style.display = 'block';
  homePage.style.zIndex = '10';
  homePage.style.transform = 'translateY(-100%)';
  homePage.style.opacity = '0';
  homePage.offsetHeight;

  currentActivePage.classList.add('slide-down-out');
  homePage.classList.add('slide-down-in');

  const indicator = document.querySelector('.nav-indicator');
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  indicator.style.width = '0px';

  setTimeout(() => {
    currentActivePage.classList.remove('slide-down-out', 'active');
    homePage.classList.remove('slide-down-in');
    currentActivePage.style.display = 'none';
    homePage.style.transform = '';
    homePage.style.opacity = '';
    homePage.style.zIndex = '';
    homePage.style.display = '';
    homePage.classList.add('active');
    homePage.scrollTop = 0;
  }, 700);
});

// ==================== 首頁滑動到 About ====================
function scrollToAbout() {
  const homePage = document.getElementById('home');
  const aboutPage = document.getElementById('about');

  homePage.classList.remove('slide-up-out', 'slide-down-in');
  aboutPage.classList.remove('slide-up-in', 'slide-down-out');

  aboutPage.style.display = 'block';
  aboutPage.style.transform = 'translateY(100%)';
  aboutPage.style.opacity = '0';
  aboutPage.scrollTop = 0;
  aboutPage.style.zIndex = '10';
  aboutPage.offsetHeight;

  homePage.classList.add('slide-up-out');
  aboutPage.classList.add('slide-up-in');

  const aboutLink = document.querySelector('[data-page="about"]');
  const indicator = document.querySelector('.nav-indicator');
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  if (aboutLink) {
    aboutLink.classList.add('active');
    const linkRect = aboutLink.getBoundingClientRect();
    const navRect = aboutLink.parentElement.getBoundingClientRect();
    indicator.style.width = `${linkRect.width}px`;
    indicator.style.height = `${linkRect.height}px`;
    indicator.style.left = `${linkRect.left - navRect.left}px`;
    indicator.style.top = `${linkRect.top - navRect.top}px`;
  }

  setTimeout(() => {
    homePage.classList.remove('slide-up-out', 'active');
    aboutPage.classList.remove('slide-up-in');
    homePage.style.display = 'none';
    aboutPage.style.transform = '';
    aboutPage.style.opacity = '';
    aboutPage.style.zIndex = '';
    aboutPage.classList.add('active');
    aboutPage.scrollTop = 0;
    initPhysicsWhenAboutActive();
  }, 700);
}

// ==================== Work 下拉 ====================
function toggleWorkDetails(headerElement) {
  const workItem = headerElement.closest('.work-item');
  const arrow = headerElement.querySelector('.dropdown-arrow');
  const details = workItem.querySelector('.work-details');
  details.classList.toggle('open');
  arrow.classList.toggle('open');
  document.querySelectorAll('.work-item').forEach(item => {
    if (item !== workItem) {
      item.querySelector('.work-details').classList.remove('open');
      item.querySelector('.dropdown-arrow').classList.remove('open');
    }
  });
}

// ==================== Projects 篩選 ====================
document.addEventListener('DOMContentLoaded', function () {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const projectCount = document.querySelector('.project-count');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const filterValue = this.getAttribute('data-filter');
      filterButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      let visible = 0;
      projectCards.forEach(card => {
        const cats = card.getAttribute('data-categories').split(' ');
        if (filterValue === 'all' || cats.includes(filterValue)) {
          card.classList.remove('hidden');
          visible++;
        } else card.classList.add('hidden');
      });
      projectCount.textContent = `共 ${visible} 件`;
    });
  });
});

// ==================== 物理標籤 ====================
let physicsEngine, physicsWorld, physicsCanvas, physicsMouseConstraint, physicsRender;
let physicsTags = [];

const physicsTagData = {
  tools: ['Figma', 'CSS', 'Notion', 'Framer', 'SPSS', 'HTML', 'Illustrator', 'Photoshop', 'RWD'],
  traits: ['Collaboration', 'Persona', 'Prototype', 'Wireframe', 'Observation', 'Empathy', 'Human-Centered Design', 'Quantitative', 'Qualitative', 'Communication', 'Curiosity'],
  methods: ['Usability Testing', 'Design Thinking', 'Empathy']
};

function initPhysicsTags() {
  if (typeof Matter === 'undefined') return;
  const physicsSection = document.querySelector('.physics-about-section');
  if (!physicsSection) return;

  // 清理舊實例
  if (physicsEngine) {
    Matter.Engine.clear(physicsEngine);
    Matter.World.clear(physicsWorld);
  }

  const { Engine, World, Bodies, Mouse, MouseConstraint, Events } = Matter;
  
  physicsEngine = Engine.create();
  physicsWorld = physicsEngine.world;
  physicsEngine.world.gravity.y = window.innerWidth <= 480 ? 1.4 : window.innerWidth <= 768 ? 1.1 : 0.8;

  physicsCanvas = document.getElementById('physics-canvas');
  const rect = physicsSection.getBoundingClientRect();
  physicsCanvas.width = rect.width;
  physicsCanvas.height = rect.height;

  // 創建邊界
  const thickness = 50;
  const boundaries = [
    Bodies.rectangle(rect.width / 2, rect.height + thickness / 2, rect.width, thickness, { isStatic: true, label: 'bottom' }),
    Bodies.rectangle(-thickness / 2, rect.height / 2, thickness, rect.height, { isStatic: true, label: 'left' }),
    Bodies.rectangle(rect.width + thickness / 2, rect.height / 2, thickness, rect.height, { isStatic: true, label: 'right' }),
    Bodies.rectangle(rect.width / 2, -thickness / 2, rect.width, thickness, { isStatic: true, label: 'top' })
  ];
  World.add(physicsWorld, boundaries);

  createPhysicsTags();

  // ✅ 關鍵：滑鼠綁定到容器而非 canvas
  const mouse = Mouse.create(physicsSection);
  mouse.pixelRatio = window.devicePixelRatio || 1;

  physicsMouseConstraint = MouseConstraint.create(physicsEngine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false }
    }
  });

  World.add(physicsWorld, physicsMouseConstraint);

  // 拖曳視覺效果
  let draggedTag = null;
  
  Events.on(physicsMouseConstraint, 'startdrag', (e) => {
    const tag = physicsTags.find(t => t.body === e.body);
    if (tag) {
      draggedTag = tag;
      tag.element.style.cursor = 'grabbing';
      tag.element.style.zIndex = '100';
    }
  });

  Events.on(physicsMouseConstraint, 'enddrag', () => {
    if (draggedTag) {
      draggedTag.element.style.cursor = 'grab';
      draggedTag.element.style.zIndex = '10';
      draggedTag = null;
    }
  });

  // 阻止頁面滾動
  physicsSection.addEventListener('touchmove', (e) => {
    if (e.cancelable) e.preventDefault();
  }, { passive: false });

  // 啟動引擎
  Matter.Runner.run(physicsEngine);
  renderPhysicsTags();
}

function createPhysicsTags() {
  const container = document.querySelector('.physics-about-section');
  if (!container) return;

  // 清理舊標籤
  physicsTags.forEach(tag => {
    if (tag.element) tag.element.remove();
    if (tag.body) Matter.World.remove(physicsWorld, tag.body);
  });
  physicsTags = [];

  // 整合所有標籤
  let allTags = [];
  Object.keys(physicsTagData).forEach(cat => {
    physicsTagData[cat].forEach(text => allTags.push({ text, cat }));
  });
  
  // 隨機排序
  allTags.sort(() => Math.random() - 0.5);

  allTags.forEach((tagInfo, index) => {
    // 創建 DOM 元素
    const el = document.createElement('div');
    el.className = `physics-tag ${tagInfo.cat}`;
    el.textContent = tagInfo.text;
    el.style.position = 'absolute';
    container.appendChild(el);

    // 測量尺寸
    const r = el.getBoundingClientRect();
    const w = r.width;
    const h = r.height;

    // 隨機初始位置
    const padding = 50;
    const x = padding + Math.random() * (physicsCanvas.width - w - padding * 2) + w / 2;
    const maxY = window.innerWidth <= 480 ? physicsCanvas.height / 3 :
                 window.innerWidth <= 768 ? physicsCanvas.height / 2 :
                 physicsCanvas.height / 2.5;
    const y = Math.random() * maxY;

    // ✅ 創建物理剛體
    const body = Matter.Bodies.rectangle(x, y, w, h, {
      restitution: 0.5,
      friction: 0.1,
      frictionAir: 0.01,
      density: 0.001,
      angle: (Math.random() - 0.5) * 0.3,
      chamfer: { radius: 12 },
      label: `tag-${index}`
    });

    // 初始速度
    Matter.Body.setVelocity(body, {
      x: (Math.random() - 0.5) * 3,
      y: Math.random() * 2
    });
    Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.15);

    physicsTags.push({ element: el, body, width: w, height: h });
    Matter.World.add(physicsWorld, body);
  });
}

function renderPhysicsTags() {
  physicsTags.forEach(tag => {
    if (!tag.element || !tag.body) return;

    const pos = tag.body.position;
    const angle = tag.body.angle;

    // ✅ 使用 translate(-50%, -50%) 確保中心對齊
    tag.element.style.left = `${pos.x}px`;
    tag.element.style.top = `${pos.y}px`;
    
    // 拖曳時保持水平
    if (physicsMouseConstraint && physicsMouseConstraint.body === tag.body) {
      tag.element.style.transform = `translate(-50%, -50%) scale(1.08)`;
    } else {
      tag.element.style.transform = `translate(-50%, -50%) rotate(${angle}rad)`;
    }
  });

  requestAnimationFrame(renderPhysicsTags);
}

function handlePhysicsResize() {
  const section = document.querySelector('.physics-about-section');
  if (!section || !physicsCanvas) return;
  
  const rect = section.getBoundingClientRect();
  physicsCanvas.width = rect.width;
  physicsCanvas.height = rect.height;
  
  // 重新初始化
  initPhysicsTags();
}

function initPhysicsWhenAboutActive() {
  const about = document.getElementById('about');
  if (about && about.classList.contains('active')) {
    setTimeout(() => {
      initPhysicsTags();
      window.addEventListener('resize', handlePhysicsResize);
    }, 300);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  showPage('home');
  initPhysicsWhenAboutActive();
});
