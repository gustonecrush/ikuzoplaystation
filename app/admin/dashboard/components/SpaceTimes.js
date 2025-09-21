'use client'

import React from 'react'

import { Button } from '@/components/ui/button'

import Toast from '@/app/components/Toast'
import { HashLoader } from 'react-spinners'
import getDocument from '@/firebase/firestore/getData'
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore'
import firebaseApp from '@/firebase/config'
import addData from '@/firebase/firestore/addData'
import { AiOutlineDelete } from 'react-icons/ai'
import { FiEdit3 } from 'react-icons/fi'

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
      Toast.fire({
        icon: 'error',
        title: 'Oopsss!',
        text: `Missing document ID!`,
      })
      setIsUpdating(false)
      return
    }

    try {
      // Get the existing data from Firestore (if needed)
      const docRef = doc(db, 'space-setting-times', id)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        Toast.fire({
          icon: 'error',
          title: 'Oopsss!',
          text: `Document does not exist!`,
        })
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
      Toast.fire({
        icon: 'success',
        title: 'Ikuzoooo!',
        text: `Successfully to add data. Please try again.`,
      })
    } catch (error) {
      console.error('Update failed:', error)
      fetchDataTimes()
      Toast.fire({
        icon: 'error',
        title: 'Oopsss!',
        text: `Failed to update data. Please try again.`,
      })
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
      Toast.fire({
        icon: 'error',
        title: 'Oopsss!',
        text: `Please fill in all fields before adding.`,
      })

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

        Toast.fire({
          icon: 'error',
          title: 'Oopsss!',
          text: `Failed to add data. Please try again.`,
        })
      } else {
        Toast.fire({
          icon: 'success',
          title: 'Ikuzoooo!',
          text: `Time entry successfully added!`,
        })

        // Reset local state after successful addition
        setNewEntry({
          category: 'RegularSpace',
          'time-day': '',
          'time-set': { 'start-time': '', 'end-time': '' },
        })

        setIsAdding(false)
        fetchDataTimes()
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      Toast.fire({
        icon: 'error',
        title: 'Oopsss!',
        text: `Time entry fail deleted!`,
      })
      fetchDataTimes()
    }
  }

  const handleDelete = async (category, index) => {
    let id
    console.log({ category })
    if (category === 'regularSpaceData') {
      id = 'regular-space-doc'
    } else if (category === 'privateSpaceData') {
      id = 'private-space-doc'
    } else {
      id = 'premium-space-doc'
    }

    const docRef = doc(db, 'space-setting-times', id)

    try {
      // Fetch the existing document data
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) {
        alert('Document not found!')
        return
      }

      const data = docSnap.data()
      let existingTimes = data.times || []

      console.log({ existingTimes })

      // Remove the selected index
      const updatedTimes = existingTimes.filter((_, i) => i !== index)

      // Update Firestore with the modified array
      await updateDoc(docRef, { times: updatedTimes })
      fetchDataTimes()
      Toast.fire({
        icon: 'success',
        title: 'Ikuzoooo!',
        text: `Time entry successfully deleted!`,
      })
    } catch (error) {
      console.error('Error deleting time entry:', error)
      fetchDataTimes()
      Toast.fire({
        icon: 'error',
        title: 'Oopsss!',
        text: `Failed to delete data. Please try again.`,
      })
    }
  }

  return (
    <section className={`w-full flex flex-col gap-5`}>
      {isLoading ||
      privateSpaceData == null ||
      premiumSpaceData == null ||
      allSpaceTimeData == null ||
      formData == null ||
      regularSpaceData == null ? (
        <div className="flex items-center justify-center p-32">
          <HashLoader color="#FF6200" />
        </div>
      ) : (
        <>
          <div className="w-full mx-auto p-5 bg-white shadow-lg rounded-lg">
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
                        <td className="border px-4 py-2 gap-2 flex">
                          <Button
                            onClick={(e) => handleUpdate(category, index)}
                            variant="outline"
                            disabled={isUpdating}
                            className=" border border-yellow-500 hover:bg-yellow-500 bg-yellow-200 bg-opacity-10 text-xs  text-yellow-500"
                          >
                            <FiEdit3 className="h-4 w-4" />{' '}
                            {isUpdating ? 'Updating...' : 'Update'}
                          </Button>
                          <Button
                            onClick={() => handleDelete(category, index)}
                            variant="outline"
                            className="border border-red-500 hover:bg-red-500 bg-red-200 bg-opacity-10 text-xs  text-red-500"
                          >
                            <AiOutlineDelete className="h-4 w-4" /> Delete
                          </Button>
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
