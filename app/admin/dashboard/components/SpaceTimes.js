'use client'

import React from 'react'

// shadcn ui components
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import Toast from '@/app/components/Toast'
import { HashLoader } from 'react-spinners'
import getDocument from '@/firebase/firestore/getData'
import updateData from '@/firebase/firestore/updateData'
import { Textarea } from '@/components/ui/textarea'
import { TbEdit } from 'react-icons/tb'
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore'
import firebaseApp from '@/firebase/config'
import addData from '@/firebase/firestore/addData'

function SpaceTimes() {
  const [privateSpaceData, setPrivateSpaceData] = React.useState(null)
  const [regularSpaceData, setPremiumSpaceData] = React.useState(null)
  const [premiumSpaceData, setRegularSpaceData] = React.useState(null)
  const [allSpaceTimeData, setAllSpaceTimeData] = React.useState(null)

  async function fetchDataTimes() {
    const dataPrivateSpace = await getDocument(
      'space-setting-times',
      'private-space-doc',
    )
    setPrivateSpaceData(dataPrivateSpace.data)

    const dataPremiumSpace = await getDocument(
      'space-setting-times',
      'premium-space-doc',
    )
    setPremiumSpaceData(dataPremiumSpace.data)

    const dataRegularSpace = await getDocument(
      'space-setting-times',
      'regular-space-doc',
    )
    setRegularSpaceData(dataRegularSpace.data)

    setAllSpaceTimeData({
      privateSpaceData: dataPrivateSpace.data,
      premiumSpaceData: dataPremiumSpace.data,
      regularSpaceData: dataRegularSpace.data,
    })
    setFormData({
      privateSpaceData: dataPrivateSpace.data,
      premiumSpaceData: dataPremiumSpace.data,
      regularSpaceData: dataRegularSpace.data,
    })
  }

  console.log({ privateSpaceData })
  console.log({ premiumSpaceData })
  console.log({ regularSpaceData })
  console.log({ allSpaceTimeData })

  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    fetchDataTimes()
  }, [])

  const [formData, setFormData] = React.useState(null)
  const [editingCategory, setEditingCategory] = React.useState(null)
  const [isUpdating, setIsUpdating] = React.useState(false)

  // Handle changes when editing a row
  const handleChange = (category, index, field, value) => {
    setFormData((prev) => {
      const newData = { ...prev }
      newData[category].times[index][field] = value
      return { ...newData }
    })
  }

  // Handle changes for start-time and end-time
  const handleTimeChange = (category, index, field, value) => {
    setFormData((prev) => {
      const newData = { ...prev }

      // Ensure times[index] exists
      if (!newData[category].times[index]) {
        newData[category].times[index] = { 'time-set': {} }
      }

      // Ensure 'time-set' is an object
      if (typeof newData[category].times[index]['time-set'] !== 'object') {
        newData[category].times[index]['time-set'] = {}
      }

      newData[category].times[index]['time-set'][field] = value
      return { ...newData }
    })
  }

  const db = getFirestore(firebaseApp)

  // Function to update Firestore
  const handleUpdate = async (category, index) => {
    setIsUpdating(true)

    const categoryKey = category // 'regularSpaceData', 'privateSpaceData', etc.
    const entry = formData[categoryKey].times[index]

    let id
    if (categoryKey === 'regularSpaceData') {
      id = 'regular-space-doc'
    } else if (categoryKey === 'privateSpaceData') {
      id = 'private-space-doc'
    } else {
      id = 'premium-space-doc'
    }

    if (!id) {
      console.error('Missing document ID!')
      setIsUpdating(false)
      return
    }

    try {
      // Get the existing data from Firestore (if needed)
      const docRef = doc(db, 'space-setting-times', id)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        console.error('Document does not exist!')
        setIsUpdating(false)
        return
      }

      // Update the specific index in the `times` array
      const existingData = docSnap.data()
      const updatedTimes = [...existingData.times] // Clone the array
      updatedTimes[index] = entry // Update specific index

      await updateDoc(docRef, {
        times: updatedTimes, // Replace the whole array
      })

      console.log('Update successful!')
      fetchDataTimes()
      alert('Data updated successfully!')
    } catch (error) {
      console.error('Update failed:', error)
      fetchDataTimes()
    }

    setIsUpdating(false)
  }

  const [isAdding, setIsAdding] = React.useState(false)
  const [newEntry, setNewEntry] = React.useState({
    category: 'RegularSpace', // Default category
    'time-day': '',
    'time-set': { 'start-time': '', 'end-time': '' },
  })
  const handleNewEntryChange = (field, value) => {
    setNewEntry((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle new entry time-set change
  const handleNewTimeChange = (field, value) => {
    setNewEntry((prev) => ({
      ...prev,
      'time-set': { ...prev['time-set'], [field]: value },
    }))
  }

  // Add new entry to the selected category
  const handleAddData = async () => {
    const categoryKey = newEntry.category.toLowerCase() // Convert category to match Firestore collection keys

    // Validate input fields
    if (
      !newEntry['time-day'] ||
      !newEntry['time-set']?.['start-time'] ||
      !newEntry['time-set']?.['end-time']
    ) {
      alert('Please fill in all fields before adding.')
      return
    }

    // Define document ID based on category
    let id
    if (newEntry.category === 'RegularSpace') {
      id = 'regular-space-doc'
    } else if (newEntry.category === 'PrivateSpace') {
      id = 'private-space-doc'
    } else {
      id = 'premium-space-doc'
    }

    // Reference to the document
    const docRef = doc(db, 'space-setting-times', id)

    try {
      // Fetch the existing document data
      const docSnap = await getDoc(docRef)
      let existingTimes = []

      if (docSnap.exists()) {
        const data = docSnap.data()
        existingTimes = data.times || [] // Keep existing times if available
      }

      // New entry data to be pushed
      const newEntryData = {
        'time-day': newEntry['time-day'],
        'time-set': {
          'start-time': newEntry['time-set']['start-time'],
          'end-time': newEntry['time-set']['end-time'],
        },
      }

      // Append new entry to the existing times array
      existingTimes.push(newEntryData)

      // Update Firestore with the modified times array
      const { result, error } = await addData('space-setting-times', id, {
        times: existingTimes,
      })

      if (error) {
        console.error('Error adding data:', error)
        alert('Failed to add data. Please try again.')
      } else {
        alert('Data successfully added!')

        // Reset local state after successful addition
        setNewEntry({
          category: 'RegularSpace',
          'time-day': '',
          'time-set': { 'start-time': '', 'end-time': '' },
        })

        setIsAdding(false)
        fetchDataTimes()
      }

      fetchDataTimes()
    } catch (err) {
      console.error('Unexpected error:', err)
      alert('Something went wrong!')
      fetchDataTimes()
    }
  }

  return (
    <section className={`w-full flex flex-col gap-5 -mt-12`}>
      {isLoading ||
      privateSpaceData == null ||
      premiumSpaceData == null ||
      allSpaceTimeData == null ||
      formData == null ||
      regularSpaceData == null ? (
        <div className="flex items-center justify-center p-10">
          <HashLoader color="#FF6200" />
        </div>
      ) : (
        <>
          <div className="w-full mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg">
            {/* Add New Data Section */}
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="mt-6 px-6 py-2 bg-orange text-white rounded-md hover:bg-orange"
            >
              {isAdding ? 'Cancel' : 'Add Data'}
            </button>

            {isAdding && (
              <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Add New Data
                </h3>

                <label className="block mb-4">
                  <span className="text-gray-700 font-medium">
                    Select Category
                  </span>
                  <select
                    value={newEntry.category}
                    onChange={(e) =>
                      handleNewEntryChange('category', e.target.value)
                    }
                    className="w-full p-2 border rounded-md focus:ring focus:ring-orange-300"
                  >
                    <option value="RegularSpace">Regular Space</option>
                    <option value="PrivateSpace">Private Space</option>
                    <option value="PremiumSpace">Premium Space</option>
                  </select>
                </label>

                <label className="block mb-4">
                  <span className="text-gray-700 font-medium">Time Day</span>
                  <input
                    type="text"
                    value={newEntry['time-day']}
                    onChange={(e) =>
                      handleNewEntryChange('time-day', e.target.value)
                    }
                    className="w-full p-2 border rounded-md focus:ring focus:ring-orange-300"
                  />
                </label>

                <div className="flex gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Start Time"
                    value={newEntry['time-set']['start-time']}
                    onChange={(e) =>
                      handleNewTimeChange('start-time', e.target.value)
                    }
                    className="w-full p-2 border rounded-md focus:ring focus:ring-orange-300"
                  />
                  <input
                    type="text"
                    placeholder="End Time"
                    value={newEntry['time-set']['end-time']}
                    onChange={(e) =>
                      handleNewTimeChange('end-time', e.target.value)
                    }
                    className="w-full p-2 border rounded-md focus:ring focus:ring-orange-300"
                  />
                </div>

                <button
                  onClick={handleAddData}
                  className="mt-4 px-6 py-2 bg-orange text-white rounded-md hover:bg-orange w-full transition"
                >
                  Add
                </button>
              </div>
            )}

            {/* Table Section */}
            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-700">
              Time Data Table
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border px-4 py-2">Category</th>
                    <th className="border px-4 py-2">Time Day</th>
                    <th className="border px-4 py-2">Start Time</th>
                    <th className="border px-4 py-2">End Time</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(formData).map((category) =>
                    formData[category].times.map((time, index) => (
                      <tr key={`${category}-${index}`} className="border-b">
                        <td className="border px-4 py-2 font-semibold capitalize">
                          {category.replace('Data', ' ')}
                        </td>
                        <td className="border px-4 py-2">
                          <input
                            type="text"
                            value={time['time-day']}
                            onChange={(e) =>
                              handleChange(
                                category,
                                index,
                                'time-day',
                                e.target.value,
                              )
                            }
                            className="w-full p-2 border rounded-md"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <input
                            type="text"
                            value={time['time-set']['start-time']}
                            onChange={(e) =>
                              handleTimeChange(
                                category,
                                index,
                                'start-time',
                                e.target.value,
                              )
                            }
                            className="w-full p-2 border rounded-md"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <input
                            type="text"
                            value={time['time-set']['end-time']}
                            onChange={(e) =>
                              handleTimeChange(
                                category,
                                index,
                                'end-time',
                                e.target.value,
                              )
                            }
                            className="w-full p-2 border rounded-md"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <button
                            onClick={() => handleUpdate(category, index)}
                            className={`px-4 py-2 rounded-md ${
                              isUpdating
                                ? 'bg-gray-400'
                                : 'bg-orange hover:bg-orange'
                            } text-white flex items-center`}
                            disabled={isUpdating}
                          >
                            <TbEdit />

                            {isUpdating ? 'Updating...' : 'Update'}
                          </button>
                        </td>
                      </tr>
                    )),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
export default SpaceTimes
