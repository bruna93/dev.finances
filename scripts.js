const Modal = {
  open() {
    // Abrir o modal
    // Adicionar a class active ao modal
    document
      .querySelector('.modal-overlay')
      .classList
      .add('active')
  },
  close() {
    // Fechar o modal
    // Remover a class active do modal
    document
      .querySelector('.modal-overlay')
      .classList
      .remove('active')
  }
}

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
  },

  set(transactions) {
    localStorage.setItem("dev.finances:transactions", 
    JSON.stringify(transactions))
  }
}
// Eu preciso somar as entradas
// depois eu preciso somar as saídas e
// remover das entradas o valor das saídas
// assim, eu terei o total

const Transaction = {
  all: Storage.get(),

  add(transaction) {
    Transaction.all.push(transaction)

    App.reload()
  },

  remove(index) {
    Transaction.all.splice(index, 1)

    App.reload()
  },

  incomes() {
    let income = 0;
    // Pegar todas as transações
    // Para cada transação, 
    Transaction.all.forEach(transaction => {
      // se a transação for maior que zero
      if (parseFloat(transaction.amount) > 0) {
        // somar a uma variável e retornar a variável
        income += parseFloat(transaction.amount);
      }

    })

    return income;
  },
  expenses() {
    let expense = 0;
    // Pegar todas as transações
    // Para cada transação, 
    Transaction.all.forEach(transaction => {
      // se a transação for menor que zero
      if (parseFloat(transaction.amount) < 0) {
        // somar a uma variável e retornar a variável
        expense += parseFloat(transaction.amount);
      }

    })

    return expense
  },
  total() {

    return parseFloat(Transaction.incomes()) + parseFloat(Transaction.expenses());

  }
}

// Substituir os dados do HTML com os dados do JS

const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index) {
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
    tr.dataset.index = index

    DOM.transactionsContainer.appendChild(tr)
  },
  innerHTMLTransaction(transaction, index) {
    
    const CSSclass = parseFloat(transaction.amount) > 0 ? "income" : "expense"

    const amount = Utils.formatCurrency(parseFloat(transaction.amount))

    const html = `
    <tr>
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação">
        </td>
    </tr>
    `

    return html
  },

  updateBalance() {
    document
      .getElementById('incomeDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.incomes())
    document
      .getElementById('expenseDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.expenses())
    document
      .getElementById('totalDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.total())
  },

  clearTransactions() {
    DOM.transactionsContainer.innerHTML = ""
  }
}

const Utils = {

  formatAmount(value) {

    value = value.replace(".", "").replace(/,/g, '.')

    return value

  },

  formatDate(date) {
    const splittedDate = date.split("-")
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  },

  formatCurrency(value) {
 
    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })

    return value

  }
}

const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues() {

    return  {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    };

  },

  validateFields() {
    // verificar se todas as informações foram preenchidas
    const { description, amount, date } = Form.getValues()

    if (description.trim() === "" || amount.trim() === "" || date.trim() === "") {
      throw new Error("Por favor, preencha todos os campos")
    }
  },

  formatValues() {

    let { description, amount, date } = Form.getValues()

    date = Utils.formatDate(date)
    amount = Utils.formatAmount(amount)

    return {
      description,
      amount,
      date
    }
  },

  clearFields() {
    Form.description.value = ""
    Form.amount.value = ""
    Form.date.value = ""
  },

  submit(event) {
    event.preventDefault()

    try {
      Form.validateFields()
      // formatar os dados para salvar
      const transaction = Form.formatValues()

      // salvar
      Transaction.add(transaction)
      // apagar os dados do formulário
      Form.clearFields()
      // modal feche
      Modal.close()
      // Atualizar a aplicação
      // tem um app.reload no add

    } catch (error) {
      alert(error.message)
    }
  }
}

const App = {
  init() {
    Transaction.all.forEach(DOM.addTransaction)
    DOM.updateBalance()
    Storage.set(Transaction.all)
  },
  reload() {
    DOM.clearTransactions()
    App.init()
  },
}

App.init()

