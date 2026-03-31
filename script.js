document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const addButton = document.getElementById("addButton");
    const taskList = document.getElementById("taskList");
    const newListBtn = document.getElementById("newListBtn");
    const listsContainer = document.getElementById("listsContainer");
    const listTitle = document.getElementById("listTitle");
    const editTitleHint = document.getElementById("editTitleHint");

    const contextMenu = document.getElementById("contextMenu");
    const deleteListBtn = document.getElementById("deleteListBtn");
    let currentContextListId = null;

    const LOCAL_STORAGE_KEY = "simple-checklist-data";
    
    // Structure: { activeListId: id, lists: [{ id, title, tasks: [] }] }
    let appData = {
        activeListId: null,
        lists: []
    };

    function loadData() {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedData) {
            appData = JSON.parse(savedData);
        }
        
        if (appData.lists.length === 0) {
            createNewList();
        } else if (!appData.activeListId) {
            appData.activeListId = appData.lists[0].id;
        }
        
        renderLists();
        renderActiveList();
    }

    function saveData() {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appData));
    }

    function createNewList() {
        const newList = {
            id: Date.now(),
            title: "New Checklist",
            tasks: []
        };
        appData.lists.unshift(newList);
        appData.activeListId = newList.id;
        saveData();
        renderLists();
        renderActiveList();
    }

    function switchList(id) {
        appData.activeListId = id;
        saveData();
        renderLists();
        renderActiveList();
    }

    function openContextMenu(e, listId) {
        currentContextListId = listId;
        contextMenu.style.left = `${e.clientX}px`;
        contextMenu.style.top = `${e.clientY}px`;
        contextMenu.classList.remove("hidden");
    }

    function closeContextMenu() {
        currentContextListId = null;
        contextMenu.classList.add("hidden");
    }

    function deleteList(listId) {
        appData.lists = appData.lists.filter(l => l.id !== listId);
        
        if (appData.activeListId === listId) {
            if (appData.lists.length > 0) {
                appData.activeListId = appData.lists[0].id;
            } else {
                createNewList();
                return; // createNewList handles saving/rendering
            }
        }
        
        saveData();
        renderLists();
        renderActiveList();
    }

    function renderLists() {
        listsContainer.innerHTML = "";
        appData.lists.forEach(list => {
            const li = document.createElement("li");
            li.className = `list-item ${list.id === appData.activeListId ? "active" : ""}`;
            
            const titleSpan = document.createElement("span");
            titleSpan.className = "list-title-text";
            titleSpan.innerText = list.title;
            
            const menuBtn = document.createElement("button");
            menuBtn.className = "list-menu-btn";
            menuBtn.innerHTML = "⋮";
            menuBtn.title = "List options";
            
            menuBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                openContextMenu(e, list.id);
            });

            li.addEventListener("click", () => switchList(list.id));
            
            li.appendChild(titleSpan);
            li.appendChild(menuBtn);
            listsContainer.appendChild(li);
        });
    }

    function getActiveList() {
        return appData.lists.find(list => list.id === appData.activeListId);
    }

    function renderActiveList() {
        const activeList = getActiveList();
        if (!activeList) return;

        listTitle.innerText = activeList.title;
        taskList.innerHTML = "";
        
        activeList.tasks.forEach((task) => {
            const li = document.createElement("li");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "task-cb";
            checkbox.checked = task.completed;
            checkbox.addEventListener("change", () => toggleTask(task.id));

            const span = document.createElement("span");
            span.className = `task-text ${task.completed ? "completed" : ""}`;
            span.innerText = task.text;

            const deleteBtn = document.createElement("button");
            deleteBtn.className = "delete-btn";
            deleteBtn.innerText = "✖";
            deleteBtn.title = "Delete task";
            deleteBtn.addEventListener("click", () => deleteTask(task.id));

            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });
    }

    function addTask(text) {
        if (!text.trim()) return;
        const activeList = getActiveList();
        if (!activeList) return;

        const newTask = {
            id: Date.now(),
            text: text.trim(),
            completed: false,
        };
        
        activeList.tasks.push(newTask);
        saveData();
        renderActiveList();
        
        taskInput.value = "";
        taskInput.focus();
    }

    function toggleTask(id) {
        const activeList = getActiveList();
        if (!activeList) return;

        activeList.tasks = activeList.tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        saveData();
        renderActiveList();
    }

    function deleteTask(id) {
        const activeList = getActiveList();
        if (!activeList) return;

        activeList.tasks = activeList.tasks.filter(task => task.id !== id);
        saveData();
        renderActiveList();
    }

    // Event Listeners
    addButton.addEventListener("click", () => {
        addTask(taskInput.value);
    });

    taskInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            addTask(taskInput.value);
        }
    });

    newListBtn.addEventListener("click", createNewList);

    deleteListBtn.addEventListener("click", () => {
        if (currentContextListId) {
            deleteList(currentContextListId);
            closeContextMenu();
        }
    });

    document.addEventListener("click", (e) => {
        if (!contextMenu.contains(e.target)) {
            closeContextMenu();
        }
    });

    listTitle.addEventListener("input", () => {
        if (!sessionStorage.getItem("hasEditedTitle")) {
            sessionStorage.setItem("hasEditedTitle", "true");
            editTitleHint.classList.add("hidden");
        }

        const activeList = getActiveList();
        if (activeList) {
            activeList.title = listTitle.innerText;
            saveData();
            renderLists();
        }
    });

    listTitle.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            listTitle.blur();
        }
    });

    // Initialize
    loadData();

    if (sessionStorage.getItem("hasEditedTitle")) {
        editTitleHint.classList.add("hidden");
    }
});