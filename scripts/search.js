// 标签切换功能
document.querySelectorAll('.toggle-children').forEach(button => {
    button.addEventListener('click', () => {
        const parentLi = button.closest('li');
        const childrenTags = parentLi.querySelector('.children-tags');
        const icon = button.querySelector('i');
        
        if (childrenTags.classList.contains('hidden')) {
        childrenTags.classList.remove('hidden');
        icon.style.transform = 'rotate(180deg)';
        } else {
        childrenTags.classList.add('hidden');
        icon.style.transform = 'rotate(0)';
        }
    });
});
    
 // 父标签和子标签的联动
document.querySelectorAll('.parent-checkbox').forEach(checkbox => {
checkbox.addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    const parentId = e.target.id;
    const childCheckboxes = document.querySelectorAll(`.child-checkbox[data-parent="${parentId}"]`);
    
    childCheckboxes.forEach(child => {
    child.checked = isChecked;
    });
    
    filterContent();
    updateActiveTags();
});
});
    
document.querySelectorAll('.child-checkbox').forEach(checkbox => {
checkbox.addEventListener('change', () => {
    const parentId = checkbox.dataset.parent;
    const parentCheckbox = document.getElementById(parentId);
    const allChildren = document.querySelectorAll(`.child-checkbox[data-parent="${parentId}"]`);
    const checkedChildren = document.querySelectorAll(`.child-checkbox[data-parent="${parentId}"]:checked`);
    
    // 如果所有子标签都被选中，父标签也被选中
    if (allChildren.length === checkedChildren.length) {
    parentCheckbox.checked = true;
    } 
    // 如果没有子标签被选中，父标签也被取消选中
    else if (checkedChildren.length === 0) {
    parentCheckbox.checked = false;
    }
    // 否则父标签处于部分选中状态
    else {
    parentCheckbox.checked = false;
    }
    
    filterContent();
    updateActiveTags();
});
});
    
// 搜索功能
document.getElementById('search-input').addEventListener('input', filterContent);
document.getElementById('tag-search').addEventListener('input', filterTags);

// 标签搜索功能
function filterTags() {
const searchTerm = document.getElementById('tag-search').value.toLowerCase().trim();
const allTags = document.querySelectorAll('.tag-item');

allTags.forEach(tag => {
    const tagText = tag.textContent.toLowerCase();
    if (searchTerm === '' || tagText.includes(searchTerm)) {
    tag.style.display = 'flex';
    } else {
    tag.style.display = 'none';
    }
});
}
    
// 内容筛选功能
function filterContent() {
const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
const selectedTags = Array.from(document.querySelectorAll('.tag-checkbox:checked'))
    .map(checkbox => checkbox.id);

const contentCards = document.querySelectorAll('.content-card');
let visibleCount = 0;

contentCards.forEach(card => {
    const cardTags = card.dataset.tags.split(',');
    const cardTitle = card.querySelector('h3').textContent.toLowerCase();
    const cardDesc = card.querySelector('p').textContent.toLowerCase();
    
    // 检查是否匹配搜索词
    const matchesSearch = searchTerm === '' || 
                        cardTitle.includes(searchTerm) || 
                        cardDesc.includes(searchTerm);
    
    // 检查是否匹配选中的标签
    const matchesTags = selectedTags.length === 0 || 
                        cardTags.some(tag => selectedTags.includes(tag));
    
    if (matchesSearch && matchesTags) {
    card.style.display = 'block';
    visibleCount++;
    } else {
    card.style.display = 'none';
    }
});

// 显示空状态（如果需要）
const contentGrid = document.getElementById('content-grid');
if (visibleCount === 0) {
    contentGrid.innerHTML = `
    <div class="col-span-full flex flex-col items-center justify-center py-12">
        <div class="w-24 h-24 mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
        <i class="fa-solid fa-search text-neutral-300 text-3xl"></i>
        </div>
        <h3 class="text-lg font-medium text-neutral-500 mb-2">没有找到匹配的内容</h3>
        <p class="text-sm text-neutral-400 max-w-md text-center">尝试调整筛选条件或搜索关键词，以查找更多相关内容。</p>
    </div>
    `;
}
}

// 更新活跃标签
function updateActiveTags() {
const activeTagsContainer = document.getElementById('active-tags');
activeTagsContainer.innerHTML = '';

const selectedTags = document.querySelectorAll('.tag-checkbox:checked');
selectedTags.forEach(tag => {
    const tagName = tag.id;
    const tagLabel = document.querySelector(`label[for="${tagName}"]`).textContent;
    
    const tagElement = document.createElement('span');
    tagElement.className = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary';
    tagElement.innerHTML = `
    ${tagLabel}
    <button class="ml-1 text-primary hover:text-primary/80">
        <i class="fa-solid fa-times-circle"></i>
    </button>
    `;
    
    // 添加点击事件
    tagElement.querySelector('button').addEventListener('click', () => {
    tag.checked = false;
    if (tag.classList.contains('parent-checkbox')) {
        const parentId = tag.id;
        document.querySelectorAll(`.child-checkbox[data-parent="${parentId}"]`).forEach(child => {
        child.checked = false;
        });
    }
    updateActiveTags();
    filterContent();
    });
    
    activeTagsContainer.appendChild(tagElement);
});
}

// 初始显示第一个父标签的子标签
document.querySelector('.toggle-children').click();
// 初始化活跃标签
updateActiveTags();

const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const currentPageInput = document.getElementById('currentPage');

// 上一页
prevPageBtn.addEventListener('click', function() {
    let currentPage = parseInt(currentPageInput.value);
    if (currentPage > 1) {
        currentPageInput.value = currentPage - 1;
    }
});

// 下一页
nextPageBtn.addEventListener('click', function() {
    let currentPage = parseInt(currentPageInput.value);
    if (currentPage < 10) {
        currentPageInput.value = currentPage + 1;
    }
});