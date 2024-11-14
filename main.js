const express = require('express')
const { getAllExpenses, postExpense, deleteById, editById, getExpenseById } = require('./utils')

const cors = require('cors')

const app = express()

const PORT = 3000

app.use(express.json())
app.use(cors())

app.get('/', (req,res)=>{
  res.send('welcome to my application')
})

app.get('/expenses', async(req,res)=>{
  let {page=1, take=5} = req.query
  page = Number(page)
  take = Number(take)
  
  if(take > 10 || take < 1) take = 5

  const data =  await getAllExpenses(page,take)
  res.status(200).json(data)
})

app.get('/expenses/:id', async(req,res)=>{
  const {id} = req.params
  const data =  await getExpenseById(id)
  if(!data){
    return res.status(404).json({message: 'expense not found'})
  }

  res.json({data: data})
})

app.post('/expenses', async(req,res)=>{
  const {category, price} = req.body
  if(!category || !price){
    return res.status(400).json({message: 'category and price is required'})
  }
  await postExpense(category, price)
  res.status(201).json({message: 'expense posted'})
})

app.delete('/expenses/:id', async(req,res)=>{
  const {id} = req.params

  const deleteExpense = deleteById(id)
  if(!deleteExpense){
    return res.status(400).json({message: 'expanse not found'})
  }
  res.json({message: 'expanse deleted'})

})

app.put('/expenses/:id', async(req,res)=>{
  const {id} = req.params
  const {category, price} = req.body

  const editedExpanse = await editById(id, category, price)

  if(!editedExpanse){
    return res.status(404).json({message: 'expanse not found'})
  }

  res.json({message: 'expanse updated'})

})

app.listen(PORT, ()=>{
  console.log('app runs on http://localhost:3000')
})