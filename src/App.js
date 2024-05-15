import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import TransactionHistory from './components/Expensive/TransactionHistory';
import { SnackbarProvider, useSnackbar } from 'notistack'

function App() {
  //initialize state from localStorage
  const { enqueueSnackbar} = useSnackbar()
  const [expenses, setExpenses] = useState(
    JSON.parse(localStorage.getItem('expenses')) || []
  );
  const [balance, setBalance] = useState(
    parseFloat(localStorage.getItem('balance')) || 5000//initial set to 5000
  );

  //update localStorage
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('balance', balance.toString());
  }, [balance]);

//edit expense function
  const handleEdit = (editedExpense) => {
    const updatedExpenses = expenses.map((expense) =>
      expense.id === editedExpense.id ? editedExpense : expense
    );
  
    //calculate original and edited expense
    const actualExp = expenses.find(expense => expense.id ===editedExpense.id);
    const actualAmt = parseFloat(actualExp.amount);
    const editedAmt = parseFloat(editedExpense.amount);
    const diff = editedAmt - actualAmt;

    const newBal = balance - diff;

  if (newBal < 0) {
    enqueueSnackbar('Cannot spend more than available balance.' , { variant: 'error' })
    return;
  }
    //update expenses and balance
    setExpenses(updatedExpenses);
    //deduct or add the diff to balance
    setBalance(balance - diff); 
  };

  const handleAddExpense = (newExpense) => {
    const expenseAmt = parseFloat(newExpense.amount);
    if (expenseAmt) {
      if (balance - expenseAmt < 0) {
        enqueueSnackbar('Cannot spend more than available balance.', { variant: 'error' })
        return;
      }
      setExpenses([...expenses, newExpense]);
      //deduct expense amt from balance.
      setBalance(balance - expenseAmt); 
    }
  };
  //delete expense function
  const handleDelete = (deletedExpense) => {
    const expenseAmt = parseFloat(deletedExpense.amount);
    const updatedExpenses = expenses.filter(
      (expense) => expense.id !== deletedExpense.id
    );
    setExpenses(updatedExpenses);
    //expense amt back to wallet balance
    setBalance(balance + expenseAmt); 
  };
  

  return (
    <SnackbarProvider>
          <div className="App">
            <h1>Expense Tracker</h1>
                <Dashboard
                  balance={balance}
                  setBalance={setBalance}
                  expenses={expenses}
                  setExpenses={setExpenses}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  handleAddExpense={handleAddExpense}
                />
                <TransactionHistory
                  expenses={expenses}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                />
         </div>
    </SnackbarProvider>
    
  );
}

export default App;
