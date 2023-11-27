const eventArea = document.getElementById("eventArea")

const defaultPIN = 1234

class User {
    constructor(name, userNumber, pinNumber, balance) {
        this.name = name
        this.userNumber = userNumber
        this.pinNumber = pinNumber
        this.balance = balance
    }
}

const users = [
    {
        name: "Admin",
        userNumber : 123456,
        pinNumber : 1234
    }
]

let curEvent = {}
let subCurEvent = {}
let receiptData = {}

let currentUser;

const homeScene = () => {
    clearScreen()
    const userNumberInput = document.createElement("input")
        userNumberInput.setAttribute("type", "number")
        userNumberInput.classList.add("user-input")
        userNumberInput.placeholder = "Enter user number"
        userNumberInput.autofocus = true
    
    const userNumberSubmit = document.createElement("input")
        userNumberSubmit.setAttribute("type", "submit")
        userNumberSubmit.value = "Enter"
        userNumberSubmit.classList.add("user-submit")
    
    const takeOutCard = document.createElement("button")
        takeOutCard.innerText = "Take Out Card"
        takeOutCard.classList.add("user-submit")
        takeOutCard.classList.add("cardAction")

        takeOutCard.addEventListener("click", () => {
            if(Object.keys(receiptData) == 0) {
                ressolve("No transactions made", initializeATM)
            } else {
                printReciept()
            }
        })
    
    eventArea.appendChild(userNumberInput)
    eventArea.appendChild(userNumberSubmit)
    eventArea.appendChild(takeOutCard)

    addEventListener("keydown", submitUserNumber)
    userNumberSubmit.addEventListener("click", submitUserNumber)  

    function submitUserNumber(e) {
        const userInput = userNumberInput.value
        console.log(userInput.length)
        if(userInput.length == 6) {
            removeEventListener("keydown", submitUserNumber)
            userNumberSubmit.removeEventListener("click", submitUserNumber)
            clearScreen()
            pinScene(userInput)
        } else if((e.pointerId !== undefined && userInput.length != 6) || (e.code == "Enter" && userInput.length != 6)) {
            console.log("error")
            ressolve("User number must be 6-digit number", homeScene)
        }
    }
}

const pinScene = (userNumber) => {
    const userPinInput = document.createElement("input")
        userPinInput.setAttribute("type", "password")
        userPinInput.classList.add("user-input")
        userPinInput.placeholder = "Enter PIN number"
        userPinInput.autofocus = true
    
    const userNumberSubmit = document.createElement("input")
        userNumberSubmit.setAttribute("type", "submit")
        userNumberSubmit.value = "Enter"
        userNumberSubmit.classList.add("user-submit")
    
    eventArea.appendChild(userPinInput)
    eventArea.appendChild(userNumberSubmit)

    addEventListener("keydown", submitPinNumber)
    userNumberSubmit.addEventListener("click", submitPinNumber)  

    function submitPinNumber(e) {
        const userInput = userPinInput.value

        if(userInput.length == 4) {
            removeEventListener("keydown", submitPinNumber)
            userNumberSubmit.removeEventListener("click", submitPinNumber)
            clearScreen()
            login(userNumber, userInput)
        }
        if((e.pointerId !== undefined && userInput.length != 4) || (e.code == "Enter" && userInput.length != 4)) {
            ressolve("PIN number must be 4-digit number", () => pinScene(userNumber))
        }
    }
}

const login = (userInput, pinInput) => {
    users.forEach((user) => {
        if (userInput == user.userNumber && pinInput == user.pinNumber) {
            currentUser = user.userNumber
            return ressolve(`${user.name} has logged on`, user.name == "Admin" ?
                displayAdminPanel : displayUserPanel)
        } else if (userInput == user.userNumber && pinInput != user.pinNumber) {
            ressolve("Incorrect PIN number", homeScene)
        }
    })
}

const displayAdminPanel = (infos) => {
    let informations = infos == undefined ? "" : infos
    const subheader = document.createElement("h3")
        subheader.innerText = "Admin Panel"
        subheader.classList.add("subheader")
        eventArea.appendChild(subheader)

    const info = document.createElement("div")
        info.classList.add("info")
        info.innerText = informations
        eventArea.appendChild(info)
    
    const buttons = document.createElement("div")
        buttons.classList.add("buttons")
        eventArea.appendChild(buttons)

    const logoutButton = document.createElement("button")
        logoutButton.classList.add("logout")
        logoutButton.innerText = "Log Out"
        eventArea.appendChild(logoutButton)

        logoutButton.addEventListener("click", logout)

    const createUserButton = document.createElement("button")
        createUserButton.classList.add("admin-power")
        createUserButton.innerHTML = "Create new user"
        buttons.appendChild(createUserButton)

        createUserButton.addEventListener("click", createUser)
    
    const depositButton = document.createElement("button")
        depositButton.classList.add("admin-power")
        depositButton.innerHTML = "Deposit to user account"
        buttons.appendChild(depositButton)

        depositButton.addEventListener("click", deposit)
    
    const displayUserButton = document.createElement("button")
        displayUserButton.classList.add("admin-power")
        displayUserButton.innerHTML = "Display user's information"
        buttons.appendChild(displayUserButton)

        displayUserButton.addEventListener("click", displayUserInfo)
    
    const resetPinButton = document.createElement("button")
        resetPinButton.classList.add("admin-power")
        resetPinButton.innerHTML = "Reset user's PIN number to default"
        buttons.appendChild(resetPinButton)

        resetPinButton.addEventListener("click", resetPin)


}

const createUser = () => {
    clearScreen()
    const userNameInput = document.createElement("input")
        userNameInput.setAttribute("type", "text")
        userNameInput.classList.add("user-input")
        userNameInput.placeholder = "Enter your name"
        eventArea.appendChild(userNameInput)
        userNameInput.autofocus = true
    
    const userNameSubmit = document.createElement("input")
        userNameSubmit.setAttribute("type", "submit")
        userNameSubmit.value = "Enter"
        userNameSubmit.classList.add("user-submit")
        eventArea.appendChild(userNameSubmit)
    
    addEventListener("keydown", submitName)
    userNameSubmit.addEventListener("click", submitName) 

    function submitName(e) {
        if(e.pointerId !== undefined || e.code == "Enter") {
            removeEventListener("keydown", submitName)
            removeEventListener("click", submitName)
            const name = userNameInput.value
            receiptData.title = "Created an Account"
            receiptData.name = name
            initializeBalance(name)
        }
    }
}

const initializeBalance = (name) => {
    clearScreen()
    const userBalanceInput = document.createElement("input")
        userBalanceInput.setAttribute("type", "number")
        userBalanceInput.classList.add("user-input")
        userBalanceInput.placeholder = "Enter initial balance"
        eventArea.appendChild(userBalanceInput)
        userBalanceInput.autofocus = true
    
    const userBalanceSubmit = document.createElement("input")
        userBalanceSubmit.setAttribute("type", "submit")
        userBalanceSubmit.value = "Enter"
        userBalanceSubmit.classList.add("user-submit")
        eventArea.appendChild(userBalanceSubmit)

    addEventListener("keydown", submitBalance)
    userBalanceSubmit.addEventListener("click", submitBalance) 

    function submitBalance(e) {
        if(e.pointerId !== undefined || e.code == "Enter") {
            removeEventListener("keydown", submitBalance)
            removeEventListener("click", submitBalance)
            const userNumber = Math.floor(100000 + Math.random() * 900000)
            const pinNumber = defaultPIN
            const balance = Number(userBalanceInput.value)

            receiptData.userNumber = userNumber
            curEvent.curEventProp = "Pin Number"
            curEvent.curEventValue = pinNumber
            subCurEvent.subCurEventProp = "Balance"
            subCurEvent.subCurEventValue = balance.toFixed(2) + "Php"

            users.push(new User(name, userNumber, pinNumber, balance))
            ressolve(`${name}'s account was successfully created`, displayAdminPanel)
        }
    }
}

const deposit = () => {
    clearScreen()
    const seachUserNameInput = document.createElement("input")
        seachUserNameInput.setAttribute("type", "text")
        seachUserNameInput.classList.add("user-input")
        seachUserNameInput.placeholder = "Enter user's name"
        eventArea.appendChild(seachUserNameInput)
        seachUserNameInput.autofocus = true
    
    const searchUserNameSubmit = document.createElement("input")
        searchUserNameSubmit.setAttribute("type", "submit")
        searchUserNameSubmit.value = "Enter"
        searchUserNameSubmit.classList.add("user-submit")
        eventArea.appendChild(searchUserNameSubmit)
    
    addEventListener("keydown", submitSearchUserName)
    searchUserNameSubmit.addEventListener("click", submitSearchUserName)

    function submitSearchUserName(e) {
        if(e.pointerId !== undefined || e.code == "Enter") {
            removeEventListener("keydown", submitSearchUserName)
            removeEventListener("click", submitSearchUserName)
            const searchedName = seachUserNameInput.value

            depositAmount(searchedName)
        }
    }
}

const depositAmount = (searchedName) => {
    clearScreen()
    const depositAmountInput = document.createElement("input")
        depositAmountInput.setAttribute("type", "text")
        depositAmountInput.classList.add("user-input")
        depositAmountInput.placeholder = "Enter amount to deposit"
        eventArea.appendChild(depositAmountInput)
        depositAmountInput.autofocus = true
    
    const depositAmountSubmit = document.createElement("input")
        depositAmountSubmit.setAttribute("type", "submit")
        depositAmountSubmit.value = "Enter"
        depositAmountSubmit.classList.add("user-submit")
        eventArea.appendChild(depositAmountSubmit)
    
    addEventListener("keydown", submitDepositAmount)
    depositAmountSubmit.addEventListener("click", submitDepositAmount)

    function submitDepositAmount(e) {
        if(e.pointerId !== undefined || e.code == "Enter") {
            removeEventListener("keydown", submitDepositAmount)
            removeEventListener("click", submitDepositAmount)

            const amount = Number(depositAmountInput.value)
            
            users.forEach((user) => {
                if(searchedName.toLowerCase() == user.name.toLowerCase()) {
                    user.balance += amount
                    ressolve(`${user.name}'s balance has been updated.`, displayAdminPanel)
                    receiptData.title = "Deposited Transaction"
                    receiptData.name = user.name
                    receiptData.userNumber = user.userNumber
                    curEvent.curEventProp = "Amount Deposited"
                    curEvent.curEventValue = amount
                    subCurEvent.subCurEventProp = "Balance"
                    subCurEvent.subCurEventValue = user.balance

                }
            })
        }
    }
}

const displayUserInfo = () => {
    clearScreen()
    const displayUserInput = document.createElement("input")
        displayUserInput.setAttribute("type", "text")
        displayUserInput.classList.add("user-input")
        displayUserInput.placeholder = "Enter user's name"
        eventArea.appendChild(displayUserInput)
        displayUserInput.autofocus = true
    
    const displayUserSubmit = document.createElement("input")
        displayUserSubmit.setAttribute("type", "submit")
        displayUserSubmit.value = "Enter"
        displayUserSubmit.classList.add("user-submit")
        eventArea.appendChild(displayUserSubmit)
    
    addEventListener("keydown", submitDisplayUser)
    displayUserSubmit.addEventListener("click", submitDisplayUser)

    function submitDisplayUser(e) {
        if(e.pointerId !== undefined || e.code == "Enter") {
            const searchedName = displayUserInput.value

            users.forEach((user) => {
                if(searchedName.toLowerCase() == user.name.toLowerCase()) {
                    let infos = `Name: ${user.name}\nAccount Number: ${user.userNumber}\nPIN Number: ${user.pinNumber}\nBalance: ${user.balance} PHP`
                    clearScreen()
                    displayAdminPanel(infos)
                    removeEventListener("keydown", submitDisplayUser)
                    displayUserSubmit.removeEventListener("click", submitDisplayUser)
                } 
            })
        }
    }
}

const resetPin = () => {
    clearScreen()
    const resetPinInput = document.createElement("input")
        resetPinInput.setAttribute("type", "text")
        resetPinInput.classList.add("user-input")
        resetPinInput.placeholder = "Enter user's name"
        eventArea.appendChild(resetPinInput)
        resetPinInput.autofocus = true
    
    const resetPinSubmit = document.createElement("input")
        resetPinSubmit.setAttribute("type", "submit")
        resetPinSubmit.value = "Enter"
        resetPinSubmit.classList.add("user-submit")
        eventArea.appendChild(resetPinSubmit)
    
    addEventListener("keydown", submitResetPin)
    resetPinSubmit.addEventListener("click", submitResetPin)

    function submitResetPin(e) {
        if(e.pointerId !== undefined || e.code == "Enter") {
            removeEventListener("keydown", submitResetPin)
            removeEventListener("click", submitResetPin)
            const searchedName = resetPinInput.value

            users.forEach((user) => {
                if(searchedName.toLowerCase() == user.name.toLowerCase()) {
                    if(user.pinNumber != defaultPIN) {
                        user.pinNumber = defaultPIN
                        ressolve(`Pin number of ${user.name} has been reset`, displayAdminPanel)
                        receiptData.title = "Reset PIN Number"
                        receiptData.name = user.name
                        receiptData.userNumber = user.userNumber
                        curEvent.curEventProp = "New PIN Number"
                        curEvent.curEventValue = defaultPIN
                        subCurEvent.subCurEventProp = "Date Reset"
                        subCurEvent.subCurEventValue = new Date()
                    } else {
                        ressolve(`Pin number was already default`, displayAdminPanel)
                    }
                }
            })
        }
    }
}

const displayUserPanel = (infos) => {
    let informations = infos == undefined ? "" : infos
    const subheader = document.createElement("h3")
        subheader.innerText = "User Panel"
        subheader.classList.add("subheader")
        eventArea.appendChild(subheader)

    const info = document.createElement("div")
        info.classList.add("info")
        info.innerText = informations
        eventArea.appendChild(info)
    
    const buttons = document.createElement("div")
        buttons.classList.add("buttons")
        eventArea.appendChild(buttons)

    const createUserButton = document.createElement("button")
        createUserButton.classList.add("admin-power")
        createUserButton.innerHTML = "View Account Details"
        buttons.appendChild(createUserButton)

        createUserButton.addEventListener("click", displayAccountInfo)
    
    const depositButton = document.createElement("button")
        depositButton.classList.add("admin-power")
        depositButton.innerHTML = "Withdraw"
        buttons.appendChild(depositButton)

        depositButton.addEventListener("click", withdraw)
    
    const displayUserButton = document.createElement("button")
        displayUserButton.classList.add("admin-power")
        displayUserButton.innerHTML = "change PIN number"
        buttons.appendChild(displayUserButton)

        displayUserButton.addEventListener("click", changePIN)
    
    const logoutButton = document.createElement("button")
        logoutButton.classList.add("admin-power")
        logoutButton.classList.add("log")
        logoutButton.innerHTML = "Log Out"
        buttons.appendChild(logoutButton)

        logoutButton.addEventListener("click", logout)
}

const displayAccountInfo = () => {
    users.forEach((user) => {
        if(currentUser == user.userNumber) {
            let infos = `Name: ${user.name}\nAccount Number: ${user.userNumber}\nPIN Number: ${user.pinNumber}\nBalance: ${user.balance} PHP`
            clearScreen()
            displayUserPanel(infos)
        }
    })
}

const withdraw = () => {
    clearScreen()
    const withdrawInput = document.createElement("input")
        withdrawInput.setAttribute("type", "text")
        withdrawInput.classList.add("user-input")
        withdrawInput.placeholder = "Enter amount to deposit"
        eventArea.appendChild(withdrawInput)
        withdrawInput.autofocus = true
    
    const withdrawSubmit = document.createElement("input")
        withdrawSubmit.setAttribute("type", "submit")
        withdrawSubmit.value = "Enter"
        withdrawSubmit.classList.add("user-submit")
        eventArea.appendChild(withdrawSubmit)
    
    addEventListener("keydown", submitWithdraw)
    withdrawSubmit.addEventListener("click", submitWithdraw)

    function submitWithdraw(e) {
        if(e.pointerId !== undefined || e.code == "Enter") {
            removeEventListener("keydown", submitWithdraw)
            removeEventListener("click", submitWithdraw)

            const amount = Number(withdrawInput.value)
            
            users.forEach((user) => {
                if(currentUser == user.userNumber) {
                    if(user.balance > amount) {
                        user.balance -= amount
                        ressolve(`${user.name}'s balance has been updated.`, displayUserPanel)
                        receiptData.title = "Withdraw Transaction"
                        receiptData.name = user.name
                        receiptData.userNumber = user.userNumber
                        curEvent.curEventProp = "Ammount Withdrew"
                        curEvent.curEventValue = amount
                        subCurEvent.subCurEventProp = "Balance"
                        subCurEvent.subCurEventValue = user.balance
                    } else {
                        ressolve(`Transaction Unsuccessful. Insufficient balance.`, displayUserPanel)
                    }
                }
            })
        }
    }
}

const changePIN = () => {
    clearScreen()
    const changePinInput = document.createElement("input")
        changePinInput.setAttribute("type", "password")
        changePinInput.classList.add("user-input")
        changePinInput.placeholder = "Enter new PIN number"
        eventArea.appendChild(changePinInput)
        changePinInput.autofocus = true
    
    const changePinSubmit = document.createElement("input")
        changePinSubmit.setAttribute("type", "submit")
        changePinSubmit.value = "Enter"
        changePinSubmit.classList.add("user-submit")
        eventArea.appendChild(changePinSubmit)
    
    addEventListener("keydown", submitChangePin)
    changePinSubmit.addEventListener("click", submitChangePin)

    function submitChangePin(e) {
        const value = changePinInput.value
        
        if(value.length == 4) {
            removeEventListener("keydown", submitChangePin)
            removeEventListener("click", submitChangePin)
            users.forEach((user) => {
                if(currentUser == user.userNumber) {
                    user.pinNumber = value
                    ressolve("Your PIN number has been updated", displayUserPanel)
                    receiptData.title = "Changed PIN Number"
                    receiptData.name = user.name
                    receiptData.userNumber = user.userNumber
                    curEvent.curEventProp = "New PIN Number"
                    curEvent.curEventValue = value
                    subCurEvent.subCurEventProp = "Date Changed"
                    subCurEvent.subCurEventValue = new Date()
                }
            })
        }
        console.log(value.length)
        if((e.pointerId !== undefined && value.length != 4) || (e.code == "Enter" && value.length != 4)) {
            alert("PIN number must be 4-digit number")
        }
    }
}

const printReciept = () => {
    receiptData.event = curEvent
    receiptData.subEvent = subCurEvent
    
    let textFile = null;
    let receiptValue = 
        `${receiptData.title}
        Name: ${receiptData.name}
        User Number: ${receiptData.userNumber}
        ${receiptData.event.curEventProp}: ${receiptData.event.curEventValue}
        ${receiptData.subEvent.subCurEventProp}: ${receiptData.subEvent.subCurEventValue}`

    function makeTextFile(text) {
        var data = new Blob([text], {type: 'text/plain'});

        if (textFile !== null) window.URL.revokeObjectURL(textFile);

        textFile = window.URL.createObjectURL(data);

        return textFile;
    }

    const createLink = document.createElement("a")
        createLink.innerText = "Download"
        createLink.id = "downloadlink"
        createLink.style.display = "none"
        document.body.appendChild(createLink)

    const link = document.getElementById('downloadlink');
        link.setAttribute('download', 'transactionReceipt.txt');
        link.href = makeTextFile(receiptValue);
        link.style.display = 'block';

    window.requestAnimationFrame(function () {
        const event = new MouseEvent('click');
        link.dispatchEvent(event);
        document.body.removeChild(link);
    });

    ressolve("Transaction Receipt has been printed", initializeATM)
}

function logout() {
    ressolve("Logging out...", homeScene)
}

function clearScreen() {
    eventArea.innerHTML = ""
}

function ressolve(message, destination) {
    clearScreen()
    eventArea.innerHTML = message

    setTimeout(() => {
        clearScreen()
        destination()
    }, 1500)
}

function initializeATM() {
    const insertCardButton = document.createElement("button")
        insertCardButton.innerText = "Insert Card"
        insertCardButton.classList.add("user-submit")
        insertCardButton.classList.add("cardInsert")
        eventArea.appendChild(insertCardButton)

        insertCardButton.addEventListener("click", homeScene)
}

initializeATM()