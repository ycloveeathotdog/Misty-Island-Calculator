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
let todoBtn = document.querySelectorAll('.todo-btn-list .todo-btn');
let todoListCurrent = todoBtn[0];
let todoListPrevious;
let todoListIDCurrent = '#product-todo-1';
let todoListIDPrevious;
for(let i=0;i<todoBtn.length;i++){
    todoBtn[i].addEventListener('click', function (e) {
        todoListPrevious = todoListCurrent;
        todoListCurrent = e.target;

        //按鈕變黃
        todoListPrevious.classList.remove('focused');
        todoListCurrent.classList.add('focused');

        //對應便條紙focus
        todoListIDPrevious = `#product-todo-${todoListPrevious.innerHTML}`;
        todoListIDCurrent = `#product-todo-${todoListCurrent.innerHTML}`;
        console.log(`前一次：${todoListIDPrevious} 目前：${todoListIDCurrent}`);
        document.querySelector(todoListIDPrevious).classList.remove('focused');
        document.querySelector(todoListIDCurrent).classList.add('focused');
    })
}
///////////// 點擊物品後新增至右側 /////////////
let productListContainer = document.querySelector('.product-list-container'); //限制判斷點擊範圍
{/* <li class="todo-item" data-todo-list-number=$1>
        <p data-todo-list-number=$1>test</p>
        <button class="btn-delete" data-todo-list-number=$1></button>
    </li> */}
// 需求素材
let listMaterial = {};
let listProcessed = {};
productListContainer.addEventListener('click', function(e) {
    let targetItemId = e.target.dataset.itemId;
    let todoList = document.querySelector(`${todoListIDCurrent} > ul.todo-list`);
    if(targetItemId){
        const todoItem = document.createElement('li');
        todoItem.classList.add('todo-item');
        todoItem.setAttribute('data-todo-list-number',todoListIDCurrent.slice(1));
        todoItem.setAttribute('data-item-id',targetItemId);
        todoItem.innerHTML =
        `
            <p data-todo-list-number="${todoListIDCurrent.slice(1)}">${e.target.innerText}</p>
            <button class="btn-delete" data-todo-list-number="${todoListIDCurrent.slice(1)}"></button>
        `;
        todoList.appendChild(todoItem);
        // todoList.style.borderTop = '1px rgba(171, 125, 9) solid';
        let productTodoHint = document.querySelector(`${todoListIDCurrent} > .hint`);
        let secLowLevelM = document.querySelector(`${todoListIDCurrent} .low-level-m`);
        let secProcessedM = document.querySelector(`${todoListIDCurrent} .processed-m`);

        productTodoHint.style.display = 'none';
        secLowLevelM.style.display = 'block';
        // 計算物品所需材料
        let todoListNumber = todoListIDCurrent.split('-')[2];
        listMaterial[todoListNumber] = listMaterial[todoListNumber] ? listMaterial[todoListNumber] : {};
        listProcessed[todoListNumber] = listProcessed[todoListNumber] ? listProcessed[todoListNumber] : {};
        calculatMaterial(listMaterial[todoListNumber], listProcessed[todoListNumber], targetItemId, 1);
        // 更新畫面數據
        flushMaterialData(todoListIDCurrent, listMaterial[todoListNumber]);
        flushProcessedData(todoListIDCurrent, listProcessed[todoListNumber], secProcessedM);
        //在item的刪除按鈕上綁事件監聽
        const buttonDelete = document.querySelectorAll(`${todoListIDCurrent} .btn-delete`);
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

const flushMaterialData = (todoListIDCurrent, currListMaterial) => {
    let materialList = document.querySelector(`${todoListIDCurrent} .low-level-m ul`);
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

const flushProcessedData = (todoListIDCurrent, currListProcessed, secProcessedM) => {
    let processedList = document.querySelector(`${todoListIDCurrent} .processed-m ul`);
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


