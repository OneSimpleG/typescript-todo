import React, { useEffect, useState } from "react"
import { addTodo, deleteTask, updateTodo } from "../functions/dbFunctions.tsx"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase"
function TodoList() {
  const [formTask, setFormTask] = useState("")
  const [formDate, setFormDate] = useState("today")
  const [todos, setTodos]: any = useState([])
  const [updateTime, setUpdateTime] = useState(Date.now())
  const [listView, setListView] = useState(false)
  //gets data from DB
  const fetchPost = async () => {
    await getDocs(collection(db, "todos")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      setTodos(newData)
    })
  } // Atskiram file neisejo.
  // handles submit
  function handleSubmit(e) {
    e.preventDefault()
    const data = [formTask, formDate, false]
    addTodo(data)
    setUpdateTime(Date.now())
    setFormTask("")
    setFormDate("today")
  }
  // handle task name and "date"
  const handleTaskInput = (e) => {
    setFormTask(e.target.value)
  }
  const handleDateInput = (e) => {
    setFormDate(e.target.value)
  }
  // Edit task
  const handleEdit = (e) => {
    if (e.target.parentNode.children[4].tagName === "DIV") {
      const taskNameInput = document.createElement("input")
      taskNameInput.className = "taskName"
      taskNameInput.value = e.target.parentNode.children[4].innerText
      e.target.parentNode.append(taskNameInput)
      e.target.parentNode.children[4].remove()
    } else {
      const taskName = document.createElement("div")
      taskName.className = "taskName"
      taskName.innerHTML = e.target.parentNode.children[4].value
      e.target.parentNode.children[4].remove()
      e.target.parentNode.append(taskName)
      updateTodo(
        e.target.parentNode.id,
        e.target.parentNode.children[4].innerText,
        e.target.parentNode.children[3].innerText,
        e.target.parentNode.children[0].checked
      )
    }
  }
  // Delete task
  const handleDelete = (e) => {
    console.log(e.target.parentNode)
    deleteTask(e.target.parentNode.id)
    e.target.parentNode.remove()
  }
  // Clear tasks (Delete All?)
  const handleClear = (e) => {
    const allTasks = document.querySelectorAll(".task")
    console.log(allTasks)
    if (allTasks.length > 0) {
      allTasks.forEach((task) => {
        console.log(task)
        deleteTask(task.id)
        task.remove()
      })
    }
  }
  // Checkbox to apply line-through text effect
  const strikeComplete = (e) => {
    if (e.target.checked === true) {
      e.target.parentNode.getElementsByTagName("div")[1].style.textDecoration =
        "line-through"
      e.target.parentNode.getElementsByTagName("button")[0].style.display =
        "none"
      updateTodo(
        e.target.parentNode.id,
        e.target.parentNode.children[4].innerText,
        e.target.parentNode.children[3].innerText,
        e.target.parentNode.children[0].checked
      )
      setUpdateTime(Date.now())
    } else {
      e.target.parentNode.getElementsByTagName("div")[1].style.textDecoration =
        "none"

      e.target.parentNode.getElementsByTagName("button")[0].style.display =
        "flex"
      updateTodo(
        e.target.parentNode.id,
        e.target.parentNode.children[4].innerText,
        e.target.parentNode.children[3].innerText,
        e.target.parentNode.children[0].checked
      )
      setUpdateTime(Date.now())
    }
  }
  // handle list view
  function handleListView() {
    if (!listView) {
      const todoList = document.getElementById("todos")
      const dateList: any = []
      const taskList: any = []
      for (let task in todoList?.childNodes) {
        if (todoList?.childNodes[task].tagName === "DIV") {
          if (
            !dateList.includes(todoList?.childNodes[task].children[3].innerText)
          ) {
            dateList.push(todoList?.childNodes[task].children[3].innerText)
          }
        }
      }
      dateList.sort()
      let child = todoList?.lastElementChild
      while (child) {
        taskList.push(child)
        todoList?.removeChild(child)
        child = todoList?.lastElementChild
      }
      dateList.forEach((date: string) => {
        const day = document.createElement("span")
        const sortedList = document.createElement("div")
        day.innerText = date
        sortedList.appendChild(day)
        todoList?.appendChild(sortedList)
      })
      taskList.forEach((task) => {
        const index = dateList.indexOf(task.children[3].innerText)
        todoList?.children[index].append(task)
      })
      setListView(true)
    } else {
      const taskList: any = []
      const todoList = document.getElementById("todos")
      let child = todoList?.lastElementChild
      while (child) {
        let subChild = child.lastElementChild
        while (subChild) {
          if (subChild.tagName === "DIV") {
            taskList.push(subChild)
          }
          child.removeChild(subChild)
          subChild = child.lastElementChild
        }
        todoList?.removeChild(child)
        child = todoList?.lastElementChild
      }
      taskList.forEach((el) => {
        todoList?.appendChild(el)
      })
      setListView(false)
    }
  }
  useEffect(() => {
    fetchPost()
    console.log(updateTime, "effect")
  }, [updateTime])
  // The todo list
  return (
    <div className="todoList">
      <div className="listHeader">
        <div id="listTitle">To Do List</div>
        <button className="listButton" onClick={handleListView}>
          List view
        </button>
        <button className="listButton" onClick={handleClear}>
          Clear list
        </button>
      </div>
      <div className="list">
        <div id="todos">
          {todos?.map((el, i) => {
            return (
              <div key={i} className="task" id={el.id}>
                <input
                  type="checkbox"
                  onChange={strikeComplete}
                  checked={el.todo[2]}
                />
                {el.todo[2] === false ? (
                  <button className="taskButton" onClick={handleEdit}>
                    &#9998;
                  </button>
                ) : (
                  <button
                    className="taskButton"
                    onClick={handleEdit}
                    style={{ display: "none" }}
                  >
                    &#9998;
                  </button>
                )}

                <button className="taskButton" onClick={handleDelete}>
                  &#x1F5D1;
                </button>
                <div className={`taskDate ${el.todo[1]}`}>{el.todo[1]}</div>
                {el.todo[2] === false ? (
                  <div className="taskName">{el.todo[0]}</div>
                ) : (
                  <div
                    className="taskName"
                    style={{ textDecoration: "line-through" }}
                  >
                    {el.todo[0]}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <div id="formSubmition">
          <form action="" id="listForm" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Add a task"
              required
              className="listInputField"
              onChange={handleTaskInput}
              value={formTask}
              name="Task"
            />
            <select
              name=""
              id=""
              required
              className="listSelectField"
              onChange={handleDateInput}
              value={formDate}
            >
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
            </select>
            <button type="submit" className="listSubmit">
              &uarr;
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default TodoList
