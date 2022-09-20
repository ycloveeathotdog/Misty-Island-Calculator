///////////// 清單是否為空 /////////////
function isListEmpty(tag) {
    return tag.innerHTML.trim() == "";
}
///////////// 切換顯示製作物品清單 /////////////
let targetClassId = 'tool'; //預設值tool, 該次點擊取得的ID
let readyToClearId; //前一次點擊取得的ID
let proSkillClass = document.querySelector('.pro-skill-class'); //限制判斷點擊範圍
proSkillClass.addEventListener('click', function(e) {
    if(e.target.id){    //id不是空字串就進if
        readyToClearId = targetClassId;
        targetClassId = e.target.id;
        document.querySelector(`#${readyToClearId}`).classList.remove('focused');
        e.target.classList.add('focused');

        if(readyToClearId != targetClassId){
            //組成DOM看得懂的東西(?)
            let clearListID = 'product-' + readyToClearId;
            let showListID = 'product-' + targetClassId;

            document.getElementById(clearListID).style.display = 'none';
            document.getElementById(showListID).style.display = 'block';
        }
    }
})
// 幫所有預設便條紙加上事件監聽
let tdBtn = document.querySelectorAll('.todo-btn-list .todo-btn');
let tdListCurrentBtn = tdBtn[0];
let tdListPreviousBtn;
let tdListCurrentID = '#product-todo-1';
let tdListPreviousID;

const tdListEvent = (e) => {
    tdListPreviousBtn = tdListCurrentBtn;
    tdListCurrentBtn = e.target;
    tdListPreviousID = `#product-todo-${tdListPreviousBtn.innerHTML}`;
    tdListCurrentID = `#product-todo-${tdListCurrentBtn.innerHTML}`;
    const tdListPrevious = document.querySelector(tdListPreviousID);
    const tdListCurrent = document.querySelector(tdListCurrentID);
    //按鈕狀態變為focused = 變黃
    FocusTdListBtn(tdListPreviousBtn, tdListCurrentBtn);
    //對應便條紙focused = 變黃
    FocusTdList(tdListPrevious, tdListCurrent);
}
const FocusTdListBtn = (previousBtn , currentBtn) =>{
    previousBtn.classList.remove('focused');
    currentBtn.classList.add('focused');
}
const FocusTdList = (previousList, currentList) =>{
    previousList.classList.remove('focused');
    currentList.classList.add('focused');
    //移動至該list
    currentList.scrollIntoView({
        behavior: 'smooth',
        inline:'center',
    })
}


for(let i=0;i<tdBtn.length;i++){
    tdBtn[i].addEventListener('click', tdListEvent);
}


///////////// 新增清單 /////////////
// 如果點的是add-td-list 則新增且focuse在它身上
let tdBtnList = document.querySelector('ul.todo-btn-list');
let addTdList = document.querySelector('.add-td-list');
let tdListNum = tdBtn.length;
addTdList.addEventListener('click',function (e) {
    tdListNum++;
    const newTdBtn = document.createElement('li'); //上方新按鈕
    const newTdList = document.createElement('div'); //新清單
    //上方新按鈕
    newTdBtn.innerHTML =
        `
        <button class="todo-btn">${tdListNum}</button>
        `;
    tdBtnList.insertBefore(newTdBtn,addTdList.parentNode);
    tdBtn = document.querySelectorAll('.todo-btn-list .todo-btn'); //更新抓到的todo-btn-list

    //current變成newTdBtn previous清除focused
    tdListPreviousBtn = tdListCurrentBtn;
    tdListCurrentBtn = tdBtn[tdListNum-1];
    FocusTdListBtn(tdListPreviousBtn, tdListCurrentBtn);
    // 新清單
    newTdList.classList.add('product-todo');
    newTdList.setAttribute('id','product-todo-'+tdListNum);
    newTdList.innerHTML = 
    `
        <h2 data-todo-list-number="product-todo-${tdListNum}">製作清單${tdListNum}</h2>
        <section class="low-level-m">
            <h3>需要</h3>
            <ul class="m-list">
            </ul>
        </section>
        <section class="processed-m">
            <h3>加工品</h3>
            <ul class="m-list">
            </ul>
        </section>
        <ul class="todo-list" data-todo-list-number="product-todo-${tdListNum}">
        </ul>
        <p class="hint" data-todo-list-number="product-todo-${tdListNum}">尚未加入欲製作道具</p>
    `;
    document.querySelector('.todo-list-main').appendChild(newTdList);
    //新清單focused
    tdListPreviousID = `#product-todo-${tdListPreviousBtn.innerHTML}`;
    tdListCurrentID = `#product-todo-${tdListCurrentBtn.innerHTML}`;
    FocusTdList(document.querySelector(tdListPreviousID), document.querySelector(tdListCurrentID));
    
    tdBtn[tdListNum-1].addEventListener('click', tdListEvent);
    
})
///////////// 點擊物品後新增至右側 /////////////
let productListContainer = document.querySelector('.product-list-container'); //限制判斷點擊範圍
/* { <li class="todo-item" data-todo-list-number=$1>
        <p data-todo-list-number=$1>test</p>
        <button class="btn-delete" data-todo-list-number=$1></button>
    </li> } */
// 需求素材
let listMaterial = {};
let listProcessed = {};
productListContainer.addEventListener('click', function(e) {
    let targetItemId = e.target.dataset.itemId;
    let todoList = document.querySelector(`${tdListCurrentID} > ul.todo-list`);
    if(targetItemId){
        const todoItem = document.createElement('li');
        todoItem.classList.add('todo-item');
        todoItem.setAttribute('data-todo-list-number',tdListCurrentID.slice(1));
        todoItem.setAttribute('data-item-id',targetItemId);
        todoItem.innerHTML =
        `
            <p data-todo-list-number="${tdListCurrentID.slice(1)}">${e.target.innerText}</p>
            <button class="btn-delete" data-todo-list-number="${tdListCurrentID.slice(1)}"></button>
        `;
        todoList.appendChild(todoItem);
        let productTodoHint = document.querySelector(`${tdListCurrentID} > .hint`);
        let secLowLevelM = document.querySelector(`${tdListCurrentID} .low-level-m`);
        let secProcessedM = document.querySelector(`${tdListCurrentID} .processed-m`);

        productTodoHint.style.display = 'none';
        secLowLevelM.style.display = 'block';
        // 計算物品所需材料
        let todoListNumber = tdListCurrentID.split('-')[2];
        listMaterial[todoListNumber] = listMaterial[todoListNumber] ? listMaterial[todoListNumber] : {};
        listProcessed[todoListNumber] = listProcessed[todoListNumber] ? listProcessed[todoListNumber] : {};
        calculatMaterial(listMaterial[todoListNumber], listProcessed[todoListNumber], targetItemId, 1);
        // 更新畫面數據
        flushMaterialData(tdListCurrentID, listMaterial[todoListNumber]);
        flushProcessedData(tdListCurrentID, listProcessed[todoListNumber], secProcessedM);
        //在item的刪除按鈕上綁事件監聽
        const buttonDelete = document.querySelectorAll(`${tdListCurrentID} .btn-delete`);
        const deleteItem = buttonDelete[buttonDelete.length-1];
        deleteItem.addEventListener('click', function (e) {
            let deleteItemId = deleteItem.parentElement.dataset.itemId;
            calculatMaterial(listMaterial[todoListNumber], listProcessed[todoListNumber], deleteItemId, 1, -1);
            flushMaterialData(`#${deleteItem.dataset.todoListNumber}`, listMaterial[todoListNumber]);
            flushProcessedData(`#${deleteItem.dataset.todoListNumber}`, listProcessed[todoListNumber], secProcessedM);
            deleteItem.parentElement.remove();
            if(isListEmpty(todoList)){
                productTodoHint.style.display = 'block';
                document.querySelector(`#${deleteItem.dataset.todoListNumber} .low-level-m`).style.display = 'none';
                document.querySelector(`#${deleteItem.dataset.todoListNumber} .processed-m`).style.display = 'none';

                // todoList.style.borderTop = 'none';
            }
        })
    }
})

const calculatMaterial = (listMaterial, listProcessed, itemId, count = 1, sign = 1) => {
    let item = material[itemId];
    if (item.materials === null) {
        // 若已為最低階材料，則直接將數量加入 listMaterial 中
        if (listMaterial[itemId]) {
            listMaterial[itemId] += count * sign;
        } else {
            listMaterial[itemId] = count;
        }
    } else {
        if (item.is_processed) {
            if (listProcessed[itemId]) {
                listProcessed[itemId] += count * sign;
            } else {
                listProcessed[itemId] = count;
            }
        }
        item.materials.forEach((element) => {
            calculatMaterial(listMaterial, listProcessed, element.material_id, count * element.count, sign);
        });
    }
}

const flushMaterialData = (tdListCurrentID, currListMaterial) => {
    let materialList = document.querySelector(`${tdListCurrentID} .low-level-m ul`);
    materialList.innerHTML = '';
    Object.keys(currListMaterial).forEach((element) => {
        if (currListMaterial[element] !== 0) {
            const materialItem = document.createElement('li');
            materialItem.classList.add('m-list-item');
            materialItem.innerHTML = `${material[element].name} x ${currListMaterial[element]}`;
            materialList.appendChild(materialItem);
        }
    });
};

const flushProcessedData = (tdListCurrentID, currListProcessed, secProcessedM) => {
    let processedList = document.querySelector(`${tdListCurrentID} .processed-m ul`);
    processedList.innerHTML = '';
    Object.keys(currListProcessed).forEach((element) => {
        if (currListProcessed[element] !== 0) {
            const processedItem = document.createElement('li');
            processedItem.classList.add('m-list-item');
            processedItem.innerHTML = `${material[element].name} x ${currListProcessed[element]}`;
            processedList.appendChild(processedItem);
        }
    });
    if (Object.keys(currListProcessed).length !== 0) {
        secProcessedM.style.display = 'block';
    }
};


