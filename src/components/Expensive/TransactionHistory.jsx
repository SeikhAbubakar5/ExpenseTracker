import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import "./TransactionHistory.css";
import Modal from 'react-modal';
import { CiCircleRemove ,CiEdit} from "react-icons/ci";
import { BsArrowLeftCircle ,BsArrowRightCircle} from "react-icons/bs";

const TransactionHistory = ({ expenses, handleEdit, handleDelete }) => {
  const [page, setPage] = useState(0);
  const [editedExpense, setEditedExpense] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false); 
//pagination 
  const handlePrev = () => {
    if (page > 0) setPage(page => page - 1);
  };

  const handleNext = () => {
    if (expenses && expenses.length / 3 > page + 1) setPage(page => page + 1);
  };

  const openEditForm = (exp) => {
    setEditedExpense(exp);
    //open modal when editing
    setModalIsOpen(true); 
  };

  const closeEditForm = () => {
    setEditedExpense(null);
    //modal close
    setModalIsOpen(false); 
  };

  const editExpense = () => {
    handleEdit(editedExpense);
    closeEditForm();
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedExpense(prevExpense => ({
      ...prevExpense,
      [name]: value
    }));
  };
  const expenseData = expenses.map(expense => ({
    name: expense.category,
    amount: expense.amount
  }));

  return (
  <div className='containerBox'>
    {/* Recent transactions */}
    <div className='history'>
    <h3>Recent transactions</h3>
      <div className='containers'>
      {expenses && expenses.length > 0 ? (
        <>
          {expenses.slice(page * 3, page * 3 + 3).map((expense) => (
            <div className="transactions" key={expense.id}>
              <div className="transaction-info">
                <p className="transaction-name">{expense.title}</p>
                <p className="transaction-date">{expense.date}</p>
              </div>

              <div className="btns">
                <p className='amount'><span style={{color:'#F4BB4A',fontSize:'16px',fontWeight:'700',lineHeight:'21px'}}>&#8377;{expense.amount}</span></p>
                <button style={{background:'red'}} onClick={() => handleDelete(expense)}><CiCircleRemove /></button>
                <button style={{background:'#F4BB4A'}} onClick={() => openEditForm(expense)}><CiEdit /></button>
              </div>
            </div>
            
          ))}
          
        </>
        
      ) : (
        <p>No Transactions history</p>
      )}
      <div className="prevNextBtns">
            <button disabled={page <= 0} onClick={handlePrev}><BsArrowLeftCircle /></button>
            <button style={{position:'relative', marginLeft:'30px'}} disabled={Math.floor(expenses.length / 3) <= page} onClick={handleNext}><BsArrowRightCircle /></button>
          </div>
      </div>
    </div>         

      {/* barchart */}
      <div className="containerChart">
        <h3>Top Expenses</h3>
          <div className='barChart'>
          <BarChart  width={400} height={300}
            data={expenseData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" interval={0} padding={{ left: 20, right: 20 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
          </div>
      </div>

      {/* Edit Expense Modal */}
     
      <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeEditForm}
          style={{overlay:{position:'fixed', width:'100%' ,height:'auto'},
            content:{width:'538px',height:'335px',background:'#EFEFEF',
            position:'absolute', top:'145px', left:'360px',borderRadius: '15px'}}}
        >
        <h2>Edit Expense</h2>
          <form onSubmit={editExpense}>
          <div className='editForm'>
            <div className='input-box'>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={editedExpense?.title || ''}
              onChange={handleEditChange}
            />
            </div>
          <div className='input-box'>
            <input
              type="number"
              name="amount"
              placeholder="Price"
              value={editedExpense?.amount || ''}
              onChange={handleEditChange}
            />
            </div>
          <div className='input-box'>
            <input
              type="text"
              name="Select Category"
              value={editedExpense?.category || ''}
              onChange={handleEditChange}
            />
            </div>
           <div className='input-box'>
            <input
              type="date"
              name="date"
              value={editedExpense?.date || ''}
              onChange={handleEditChange}
            />
            </div>
          <div className='input-box'>
            <button type="submit" style={{width:"225px",background:'#F4BB4A',
            color:'#FFFFFF',lineHeight:'21px',fontSize:'16px',fontWeight:'700'}}>Add Expense</button></div>
            <div className='input-box'>
            <button style={{background:'#E3E3E3', width:'112px',fontWeight:'400'}} type="button" onClick={closeEditForm}>Cancel</button></div>
            </div>
        </form>
      </Modal>
    </div>
  );
};

export default TransactionHistory;
