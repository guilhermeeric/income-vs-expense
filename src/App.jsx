import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Plus, Trash2, Save } from 'lucide-react'
import './App.css'

function App() {
  const [incomeItems, setIncomeItems] = useState([])
  const [expenseItems, setExpenseItems] = useState([])
  const [incomeDescription, setIncomeDescription] = useState('')
  const [incomeAmount, setIncomeAmount] = useState('')
  const [expenseDescription, setExpenseDescription] = useState('')
  const [expenseAmount, setExpenseAmount] = useState('')

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedIncomeItems = localStorage.getItem('incomeItems')
    const savedExpenseItems = localStorage.getItem('expenseItems')
    
    if (savedIncomeItems) {
      try {
        setIncomeItems(JSON.parse(savedIncomeItems))
      } catch (error) {
        console.error('Error loading income items:', error)
      }
    }
    
    if (savedExpenseItems) {
      try {
        setExpenseItems(JSON.parse(savedExpenseItems))
      } catch (error) {
        console.error('Error loading expense items:', error)
      }
    }
  }, [])

  // Save income items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('incomeItems', JSON.stringify(incomeItems))
  }, [incomeItems])

  // Save expense items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('expenseItems', JSON.stringify(expenseItems))
  }, [expenseItems])

  // Calculate totals
  const totalIncome = incomeItems.reduce((sum, item) => sum + item.amount, 0)
  const totalExpense = expenseItems.reduce((sum, item) => sum + item.amount, 0)
  const netTotal = totalIncome - totalExpense

  // Add income item
  const addIncomeItem = () => {
    if (incomeDescription.trim() && incomeAmount && parseFloat(incomeAmount) > 0) {
      const newItem = {
        id: Date.now(),
        description: incomeDescription.trim(),
        amount: parseFloat(incomeAmount)
      }
      setIncomeItems([...incomeItems, newItem])
      setIncomeDescription('')
      setIncomeAmount('')
    }
  }

  // Add expense item
  const addExpenseItem = () => {
    if (expenseDescription.trim() && expenseAmount && parseFloat(expenseAmount) > 0) {
      const newItem = {
        id: Date.now(),
        description: expenseDescription.trim(),
        amount: parseFloat(expenseAmount)
      }
      setExpenseItems([...expenseItems, newItem])
      setExpenseDescription('')
      setExpenseAmount('')
    }
  }

  // Remove income item
  const removeIncomeItem = (id) => {
    setIncomeItems(incomeItems.filter(item => item.id !== id))
  }

  // Remove expense item
  const removeExpenseItem = (id) => {
    setExpenseItems(expenseItems.filter(item => item.id !== id))
  }

  // Clear all data
  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      setIncomeItems([])
      setExpenseItems([])
      localStorage.removeItem('incomeItems')
      localStorage.removeItem('expenseItems')
    }
  }

  // Handle key press for inputs
  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Income & Expense Tracker</h1>
          <p className="text-gray-600">Track your income and expenses in real-time</p>
          <div className="mt-4 flex justify-center items-center gap-2 text-sm text-green-600">
            <Save className="w-4 h-4" />
            <span>Data automatically saved to your device</span>
          </div>
        </div>

        {/* Total Display */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-700">Total Income</h3>
                <p className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-red-700">Total Expenses</h3>
                <p className="text-2xl font-bold text-red-600">${totalExpense.toFixed(2)}</p>
              </div>
              <div className={`p-4 rounded-lg ${netTotal >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
                <h3 className={`text-lg font-semibold ${netTotal >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                  Net Total
                </h3>
                <p className={`text-2xl font-bold ${netTotal >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  ${netTotal.toFixed(2)}
                </p>
              </div>
            </div>
            
            {/* Clear Data Button */}
            <div className="mt-4 text-center">
              <Button 
                variant="outline" 
                onClick={clearAllData}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income Column */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-700 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add Income Form */}
              <div className="space-y-3 mb-6">
                <Input
                  placeholder="Income description"
                  value={incomeDescription}
                  onChange={(e) => setIncomeDescription(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, addIncomeItem)}
                />
                <Input
                  type="number"
                  placeholder="Amount ($)"
                  value={incomeAmount}
                  onChange={(e) => setIncomeAmount(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, addIncomeItem)}
                  min="0"
                  step="0.01"
                />
                <Button 
                  onClick={addIncomeItem}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Income
                </Button>
              </div>

              {/* Income List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {incomeItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No income entries yet</p>
                ) : (
                  incomeItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.description}</p>
                        <p className="text-green-600 font-semibold">${item.amount.toFixed(2)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeIncomeItem(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Expense Column */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add Expense Form */}
              <div className="space-y-3 mb-6">
                <Input
                  placeholder="Expense description"
                  value={expenseDescription}
                  onChange={(e) => setExpenseDescription(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, addExpenseItem)}
                />
                <Input
                  type="number"
                  placeholder="Amount ($)"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, addExpenseItem)}
                  min="0"
                  step="0.01"
                />
                <Button 
                  onClick={addExpenseItem}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
              </div>

              {/* Expense List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {expenseItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No expense entries yet</p>
                ) : (
                  expenseItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.description}</p>
                        <p className="text-red-600 font-semibold">${item.amount.toFixed(2)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExpenseItem(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default App

