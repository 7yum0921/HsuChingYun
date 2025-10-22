// 頁面切換功能
function showPage(pageId) {
    // 隱藏所有頁面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // 顯示指定頁面
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // 更新導航欄指示器
    updateNavigation(pageId);
}

// 更新導航欄指示器
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

// 導航連結點擊事件
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function (e) {
        const pageId = this.getAttribute('data-page');
        
        // 如果沒有 data-page 屬性(例如 Resume 下載連結),讓它正常運作
        if (!pageId) {
            return; // 不阻止預設行為,讓下載正常進行
        }
        
        e.preventDefault(); // ✅ 阻止 # 的預設跳轉
        showPage(pageId);
    });
});

// 點擊 logo 回到首頁
document.querySelector('.logo').addEventListener('click', function (e) {
    e.preventDefault(); // ✅ 確保不會 reload
    showPage('home');
});

// 初始化導航指示器與顯示首頁
document.addEventListener('DOMContentLoaded', function () {
    showPage('home'); // ✅ 預設只顯示首頁
});

// 主題切換功能
document.querySelector('.theme-toggle').addEventListener('click', function () {
    console.log('Theme toggle clicked');
});

// 響應式導航指示器調整
window.addEventListener('resize', function () {
    const currentActivePage = document.querySelector('.page.active').id;
    updateNavigation(currentActivePage);
});



// Work 下拉展開功能
function toggleWorkDetails(headerElement) {
    const workItem = headerElement.closest('.work-item');
    const arrow = headerElement.querySelector('.dropdown-arrow');
    const details = workItem.querySelector('.work-details');
    
    // 切換展開狀態
    details.classList.toggle('open');
    arrow.classList.toggle('open');
    
    // 關閉其他展開的項目（可選）
    const allWorkItems = document.querySelectorAll('.work-item');
    allWorkItems.forEach(item => {
        if (item !== workItem) {
            const otherDetails = item.querySelector('.work-details');
            const otherArrow = item.querySelector('.dropdown-arrow');
            otherDetails.classList.remove('open');
            otherArrow.classList.remove('open');
        }
    });
}




// Projects 頁面篩選功能
document.addEventListener('DOMContentLoaded', function() {
    // 篩選按鈕點擊事件
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const projectCount = document.querySelector('.project-count');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // 移除所有按鈕的 active 類別
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // 添加 active 類別到被點擊的按鈕
            this.classList.add('active');
            
            // 篩選專案
            let visibleCount = 0;
            projectCards.forEach(card => {
                const categories = card.getAttribute('data-categories').split(' ');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.classList.remove('hidden');
                    visibleCount++;
                } else {
                    card.classList.add('hidden');
                }
            });
            
            // 更新專案數量
            projectCount.textContent = `共 ${visibleCount} 件`;
        });
    });
    
    // 專案卡片點擊事件（可選）
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            // 這裡可以添加點擊專案卡片後的行為
            // 例如：打開專案詳情頁面
            console.log('點擊了專案：', this.querySelector('.project-title').textContent);
        });
    });
});


// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝互動標籤

// 物理標籤系統變數
let physicsEngine, physicsWorld, physicsCanvas, physicsMouseConstraint;
let physicsTags = [];
let currentTagScale = 1;

// 標籤數據
const physicsTagData = {
    tools: ['Figma', 'CSS', 'Notion', 'Framer', 'SPSS', 'HTML', 'Illustrator', 'Photoshop', 'RWD'],
    traits: ['Collaboration', 'Persona', 'Prototype', 'Wireframe', 'Observation', 'Empathy', 'Human-Centered Design', 'Quantitative', 'Qualitative', 'Communication', 'Curiosity'],
    methods: ['Usability Testing', 'Design Thinking', 'Empathy']
};

// 初始化物理標籤系統
function initPhysicsTags() {
    // 檢查 Matter.js 是否已載入
    if (typeof Matter === 'undefined') {
        console.error('Matter.js library not loaded');
        return;
    }

    // 檢查是否在 About 頁面
    const physicsSection = document.querySelector('.physics-about-section');
    if (!physicsSection) return;

    const Engine = Matter.Engine;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Mouse = Matter.Mouse;
    const MouseConstraint = Matter.MouseConstraint;

    // 創建引擎
    physicsEngine = Engine.create();
    physicsWorld = physicsEngine.world;
    physicsEngine.world.gravity.y = 0.8;

    // 獲取畫布
    physicsCanvas = document.getElementById('physics-canvas');
    
    // 設定畫布大小，確保與容器完全匹配
    const rect = physicsSection.getBoundingClientRect();
    physicsCanvas.width = rect.width;
    physicsCanvas.height = rect.height;

    // 創建邊界 - 調整位置確保標籤不會超出
    const thickness = 20;
    const boundaries = [
        // 底部邊界 - 稍微往上移，確保標籤停在可見區域
        Bodies.rectangle(physicsCanvas.width / 2, physicsCanvas.height - thickness / 2, physicsCanvas.width + 100, thickness, { isStatic: true }),
        // 左邊界
        Bodies.rectangle(thickness / 2, physicsCanvas.height / 2, thickness, physicsCanvas.height, { isStatic: true }),
        // 右邊界
        Bodies.rectangle(physicsCanvas.width - thickness / 2, physicsCanvas.height / 2, thickness, physicsCanvas.height, { isStatic: true })
    ];
    World.add(physicsWorld, boundaries);

    // 更新縮放比例
    updateTagScale();

    // 創建標籤
    createPhysicsTags();

    // 設定滑鼠控制
    const mouse = Mouse.create(physicsCanvas);
    physicsMouseConstraint = MouseConstraint.create(physicsEngine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.8,
            render: {
                visible: false
            }
        }
    });
    World.add(physicsWorld, physicsMouseConstraint);

    // 開始引擎
    Engine.run(physicsEngine);

    // 開始渲染循環
    renderPhysicsTags();
}

// 更新標籤縮放比例
function updateTagScale() {
    const width = window.innerWidth;
    if (width <= 480) {
        currentTagScale = 0.5;
    } else if (width <= 768) {
        currentTagScale = 0.6;
    } else if (width <= 1024) {
        currentTagScale = 0.8;
    } else {
        currentTagScale = 1;
    }
}

// 創建物理標籤
function createPhysicsTags() {
    const container = document.querySelector('.physics-about-section');
    if (!container) return;
    
    // 清除現有標籤
    physicsTags.forEach(tag => {
        if (tag.element && tag.element.parentNode) {
            tag.element.parentNode.removeChild(tag.element);
        }
        if (tag.body && physicsWorld) {
            Matter.World.remove(physicsWorld, tag.body);
        }
    });
    physicsTags = [];

    let allTags = [];
    Object.keys(physicsTagData).forEach(category => {
        physicsTagData[category].forEach(text => {
            allTags.push({ text, category });
        });
    });

    // 打亂標籤順序
    allTags = allTags.sort(() => Math.random() - 0.5);

    allTags.forEach((tagInfo, index) => {
        // 創建 DOM 元素
        const element = document.createElement('div');
        element.className = `physics-tag ${tagInfo.category}`;
        element.textContent = tagInfo.text;
        container.appendChild(element);

        // 強制渲染以獲取準確尺寸
        element.style.visibility = 'hidden';
        element.style.position = 'absolute';
        const rect = element.getBoundingClientRect();
        element.style.visibility = 'visible';
        
        const width = rect.width;
        const height = rect.height;

        // 隨機初始位置（上方區域），確保在邊界內
        const margin = width / 2 + 20;
        const x = Math.random() * (physicsCanvas.width - margin * 2) + margin;
        const y = Math.random() * 150 + 50; // 降低初始高度，讓標籤更容易看到

        // 創建物理體 - 使用實際 DOM 尺寸
        const body = Matter.Bodies.rectangle(x, y, width, height, {
            restitution: 0.3,
            friction: 0.4,
            density: 0.001,
            frictionAir: 0.01
        });

        // 存儲標籤信息
        physicsTags.push({
            element,
            body,
            width,
            height
        });

        Matter.World.add(physicsWorld, body);

        // 設定拖曳事件
        setupTagDragEvents(element, body);
    });
}

// 設定標籤拖曳事件
function setupTagDragEvents(element, body) {
    let isDragging = false;

    element.addEventListener('mousedown', (e) => {
        isDragging = true;
        element.style.zIndex = '10';
    });

    element.addEventListener('mouseup', () => {
        isDragging = false;
        element.style.zIndex = '6';
    });

    // 觸控支援
    element.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isDragging = true;
        element.style.zIndex = '10';
    });

    element.addEventListener('touchend', (e) => {
        e.preventDefault();
        isDragging = false;
        element.style.zIndex = '6';
    });
}

// 渲染物理標籤
function renderPhysicsTags() {
    // 更新標籤位置
    physicsTags.forEach(tag => {
        if (tag.element && tag.body) {
            const pos = tag.body.position;
            const angle = tag.body.angle;
            
            // 確保標籤不會超出邊界
            const maxX = physicsCanvas.width - tag.width / 2;
            const minX = tag.width / 2;
            const maxY = physicsCanvas.height - tag.height / 2;
            const minY = tag.height / 2;
            
            let finalX = pos.x;
            let finalY = pos.y;
            
            // 邊界檢查和修正
            if (pos.x > maxX) {
                finalX = maxX;
                Matter.Body.setPosition(tag.body, { x: finalX, y: pos.y });
            } else if (pos.x < minX) {
                finalX = minX;
                Matter.Body.setPosition(tag.body, { x: finalX, y: pos.y });
            }
            
            if (pos.y > maxY) {
                finalY = maxY;
                Matter.Body.setPosition(tag.body, { x: pos.x, y: finalY });
            } else if (pos.y < minY) {
                finalY = minY;
                Matter.Body.setPosition(tag.body, { x: pos.x, y: finalY });
            }
            
            tag.element.style.left = (finalX - tag.width / 2) + 'px';
            tag.element.style.top = (finalY - tag.height / 2) + 'px';
            tag.element.style.transform = `rotate(${angle}rad) scale(${currentTagScale})`;
        }
    });

    requestAnimationFrame(renderPhysicsTags);
}

// 處理視窗大小調整
function handlePhysicsResize() {
    const container = document.querySelector('.physics-about-section');
    if (!container || !physicsCanvas) return;

    // 更新畫布大小
    const rect = container.getBoundingClientRect();
    physicsCanvas.width = rect.width;
    physicsCanvas.height = rect.height;

    // 更新縮放
    const oldScale = currentTagScale;
    updateTagScale();

    // 清空物理世界
    Matter.World.clear(physicsWorld, false);

    // 重新創建邊界
    const thickness = 20;
    const boundaries = [
        // 底部邊界
        Matter.Bodies.rectangle(physicsCanvas.width / 2, physicsCanvas.height - thickness / 2, physicsCanvas.width + 100, thickness, { isStatic: true }),
        // 左邊界
        Matter.Bodies.rectangle(thickness / 2, physicsCanvas.height / 2, thickness, physicsCanvas.height, { isStatic: true }),
        // 右邊界
        Matter.Bodies.rectangle(physicsCanvas.width - thickness / 2, physicsCanvas.height / 2, thickness, physicsCanvas.height, { isStatic: true })
    ];
    Matter.World.add(physicsWorld, boundaries);

    // 重新添加滑鼠控制
    Matter.World.add(physicsWorld, physicsMouseConstraint);

    // 如果縮放改變，重新創建標籤
    if (oldScale !== currentTagScale) {
        createPhysicsTags();
    } else {
        // 重新添加現有標籤的物理體
        physicsTags.forEach(tag => {
            if (tag.body) {
                // 調整標籤位置確保在新邊界內
                const pos = tag.body.position;
                const newX = Math.min(Math.max(pos.x, tag.width / 2 + 20), physicsCanvas.width - tag.width / 2 - 20);
                const newY = Math.min(pos.y, physicsCanvas.height - tag.height / 2 - 20);
                
                Matter.Body.setPosition(tag.body, { x: newX, y: newY });
                Matter.World.add(physicsWorld, tag.body);
            }
        });
    }
}

// 當頁面切換到 About 時初始化物理標籤系統
function initPhysicsWhenAboutActive() {
    const aboutPage = document.getElementById('about');
    if (aboutPage && aboutPage.classList.contains('active')) {
        // 延遲初始化，確保 DOM 完全渲染
        setTimeout(() => {
            initPhysicsTags();
        }, 100);
    }
}

// 修改原有的頁面切換函數，加入物理標籤初始化
const originalShowPage = showPage;
showPage = function(pageId) {
    originalShowPage(pageId);
    if (pageId === 'about') {
        initPhysicsWhenAboutActive();
    }
};

// 頁面載入完成時初始化
document.addEventListener('DOMContentLoaded', function() {
    // 檢查是否一開始就在 About 頁面
    initPhysicsWhenAboutActive();
});

// 視窗大小改變時重新調整
window.addEventListener('resize', handlePhysicsResize);

// 防止觸控滾動干擾
document.addEventListener('touchmove', function(e) {
    if (e.target.classList.contains('physics-tag')) {
        e.preventDefault();
    }
}, { passive: false });