import React, { useState } from 'react';
import Modal from 'react-modal';
import { PieChart, Pie, Cell} from 'recharts';
import "./Dashboard.css";
import { useSnackbar } from 'notistack'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


const Dashboard = ({ balance, setBalance, handleAddExpense }) => {
  const { enqueueSnackbar} = useSnackbar()
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: ''
  });
  
  const [incomeModalIsOpen, setIncomeModalIsOpen] = useState(false);
  const [expenseModalIsOpen, setExpenseModalIsOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleAddIncome = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
  const amount = parseFloat(formData.amount);
  if (amount) {
    setBalance(balance + amount);
    setIncomeModalIsOpen(false);
    enqueueSnackbar('Income added successfully!', { variant: 'success' });
  }
  };

  const handleSubmitExpense = (event) => {
    event.preventDefault();
    const { title, amount, category, date } = formData;
    const expenseAmount = parseFloat(amount);

    if (title && expenseAmount && category && date) {
      if (balance - expenseAmount < 0) {
        enqueueSnackbar('Cannot spend more than available balance.', { variant: 'error' });
        return;
      }

      const newExpense = {
        id: Date.now(),
        title: title,
        amount: expenseAmount,
        category: category,
        date: date
      };

      handleAddExpense(newExpense);
      setBalance(balance - expenseAmount);
      // Add new expense to expenses
      setExpenses([...expenses, newExpense]); 
      setFormData({
        title: '',
        amount: '',
        category: '',
        date: ''
      });
      setExpenseModalIsOpen(false)
      enqueueSnackbar('Expense added successfully!', { variant: 'success' });
    }
  };

  //expenses by category
  const categoryExpenses = expenses.reduce((acc, expense) => {
    if (acc[expense.category]) {
      acc[expense.category] += expense.amount;
    } else {
      acc[expense.category] = expense.amount;
    }
    return acc;
  }, {});

  // Convert expenses data for pie chart
  const pieChartData = Object.keys(categoryExpenses).map(category => ({
    name: category,
    value: categoryExpenses[category]
  }));

  const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);

  return (
    <div className='container'>
      {/* add balance */}
      <div className="subContainer balance">
          <h3>Wallet balance:<span style={{color:'#9DFF5B',fontWeight:'700' , height:'30px' ,lineHeight:'34px'}}>&#8377;{balance}</span></h3>
          <button style={{background:'#B5DC52'}} onClick={() => setIncomeModalIsOpen(true)}>+ Add income</button>
          <Modal
            isOpen={incomeModalIsOpen}
            onRequestClose={() => setIncomeModalIsOpen(false)}
            style={{overlay:{position:'fixed', width:'100%' ,height:'auto'},
            content:{width:'538px',height:'164px',background:'#EFEFEF',
            position:'absolute', top:'245px', left:'360px',borderRadius: '15px'}}}
          >
            <h2>Add Balance</h2>
            <form onSubmit={handleAddIncome}>
              <div className='incomeForm'>
                <div className='modal-input'>
                <input
                    type="number"
                    name="amount"
                    placeholder="Income Amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                  />
                </div>
                  <div className='modal-input'>
                    <button style={{background:'#F4BB4A', width:'145px',color:'#FFFFFF',fontWeight:'700'}} type="submit">Add Income</button>
                  </div>
                  <div className='modal-input'>
                    <button style={{background:'#E3E3E3', width:'112px',fontWeight:'400'}} onClick={() => setIncomeModalIsOpen(false)}>Cancel</button>
                  </div>
              </div>
            </form>
          </Modal>
        </div>
        
        {/* add expense */}
      <div className="subContainer expenses">
        <h3>Expenses: <span style={{color:'#F4BB4A',fontWeight:'700' , height:'30px' ,lineHeight:'34px'}}>&#8377;{totalExpense}</span></h3> {/*display total expense*/}
        <button style={{background:'linear-gradient(90deg, #FF9595 0%, #FF4747 80%, #FF3838 100%'}} 
        onClick={() => setExpenseModalIsOpen(true)}>+ Add Expense</button>

        <Modal
          isOpen={expenseModalIsOpen}
          onRequestClose={() => setExpenseModalIsOpen(false)}
          style={{overlay:{position:'fixed', width:'100%' ,height:'auto'},
            content:{width:'538px',height:'335px',background:'#EFEFEF',
            position:'absolute', top:'145px', left:'360px',borderRadius: '15px'}}}
        >
          <h2>Add Expense</h2>
          
          <form onSubmit={handleSubmitExpense}>
          <div className='expenseForm'>
            <div className='input-box'>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleInputChange}
            />
            </div>
            <div className='input-box'>
            <input
              type="number"
              name="amount"
              placeholder="Price"
              value={formData.amount}
              onChange={handleInputChange}
            />
            </div>
            <div className='input-box'>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            >
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Sports">Sports</option>
            </select>
            </div>
            <div className='input-box'>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
            />
            </div>
            <div className='input-box'>
            <button type="submit" style={{width:"225px",background:'#F4BB4A',
            color:'#FFFFFF',lineHeight:'21px',fontSize:'16px',fontWeight:'700'}}>Add Expense</button></div>
            <div className='input-box'>
            <button style={{background:'#E3E3E3', width:'112px',fontWeight:'400'}} type="button" onClick={() => setExpenseModalIsOpen(false)}>Cancel</button></div>
            </div>
          </form>
          
        </Modal>
      </div>

      {/* pieCharts */}
      <div className='Piecharts'>
  {pieChartData.length === 0 ? (
    <span style={{color:'white'}}><h2>No Trending Expenses</h2></span>
  ) : (
    <PieChart width={400} height={400}>
      <Pie
        data={pieChartData}
        cx="50%"
        cy="50%"
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
        labelLine={false}
        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
          const RADIAN = Math.PI / 180;
          const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
          const x = cx + radius * Math.cos(-midAngle * RADIAN);
          const y = cy + radius * Math.sin(-midAngle * RADIAN);
          return (
            <text
              x={x}
              y={y}
              fill="white"
              textAnchor={x > cx ? 'start' : 'end'}
              dominantBaseline="central"
            >
              {`${(percent * 100).toFixed(0)}%`}
            </text>
          );
        }}
      >
        {pieChartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  )}
</div>

    </div>
  );
};

export default Dashboard;
