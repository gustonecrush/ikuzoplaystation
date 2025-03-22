'use client'

import React from 'react'

// shadcn ui components
import { Button } from '@/components/ui/button'

import Toast from '@/app/components/Toast'
import { HashLoader } from 'react-spinners'
import getDocument from '@/firebase/firestore/getData'
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore'
import firebaseApp from '@/firebase/config'
import addData from '@/firebase/firestore/addData'
import { AiOutlineDelete } from 'react-icons/ai'
import { FiEdit3 } from 'react-icons/fi'
import { toPascalCase } from '@/utils/text'

function FacilityPrices({ facilities }) {
  const [familyOpenRoomData, setFamilyOpenRoomData] = React.useState(null)
  const [allFacilityPriceData, setAllFacilityPriceData] = React.useState(null)

  async function fetchDataPrices() {
    const dataFamilyRoom = await getDocument(
      'facility-setting-prices',
      'family-open-room',
    )
    setFamilyOpenRoomData(dataFamilyRoom.data)
    setAllFacilityPriceData({
      familyOpenRoomData: dataFamilyRoom.data,
    })
    setFormData({
      familyOpenRoomData: dataFamilyRoom.data,
    })
  }

  console.log({ familyOpenRoomData })

  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    fetchDataPrices()
  }, [])

  const [formData, setFormData] = React.useState(null)
  const [isUpdating, setIsUpdating] = React.useState(false)

  // Handle changes when editing a row
  const handleChange = (category, index, field, value) => {
    setFormData((prev) => {
      const newData = { ...prev }
      newData[category].prices[index][field] = value
      return { ...newData }
    })
  }

  const handlePriceChange = (category, index, field, value) => {
    setFormData((prev) => {
      const newData = { ...prev }
      newData[category].prices[index][field] = value
      return { ...newData }
    })
  }

  const db = getFirestore(firebaseApp)

  // Function to update Firestore
  const handleUpdate = async (category, index) => {
    setIsUpdating(true)

    const categoryKey = category // 'regularSpaceData', 'privateSpaceData', etc.
    const entry = formData[categoryKey].prices[index]

    let id
    if (categoryKey === 'familyOpenRoomData') {
      id = 'family-open-room'
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
      const docRef = doc(db, 'facility-setting-prices', id)
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
      const updatedPrices = [...existingData.prices] // Clone the array
      updatedPrices[index] = entry // Update specific index

      await updateDoc(docRef, {
        prices: updatedPrices, // Replace the whole array
      })

      console.log('Update successful!')
      fetchDataPrices()
      Toast.fire({
        icon: 'success',
        title: 'Ikuzoooo!',
        text: `Successfully to add data. Please try again.`,
      })
    } catch (error) {
      console.error('Update failed:', error)
      fetchDataPrices()
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
    category: 'FamilyOpenRoom', // Default category
    day: '',
    price: '',
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
      let existingPrices = []

      if (docSnap.exists()) {
        const data = docSnap.data()
        existingPrices = data.times || [] // Keep existing times if available
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
      existingPrices.push(newEntryData)

      // Update Firestore with the modified times array
      const { result, error } = await addData('space-setting-times', id, {
        times: existingPrices,
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
        fetchDataPrices()
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      Toast.fire({
        icon: 'error',
        title: 'Oopsss!',
        text: `Time entry fail deleted!`,
      })
      fetchDataPrices()
    }
  }

  const handleDelete = async (category, index) => {
    let id
    console.log({ category })
    if (category === 'familyOpenRoomData') {
      id = 'family-open-room'
    } else if (category === 'privateSpaceData') {
      id = 'private-space-doc'
    } else {
      id = 'premium-space-doc'
    }

    const docRef = doc(db, 'facility-setting-prices', id)

    try {
      // Fetch the existing document data
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) {
        alert('Document not found!')
        return
      }

      const data = docSnap.data()
      let existingPrices = data.prices || []

      console.log({ existingPrices })

      // Remove the selected index
      const updatedPrices = existingPrices.filter((_, i) => i !== index)

      // Update Firestore with the modified array
      await updateDoc(docRef, { prices: updatedPrices })
      fetchDataPrices()
      Toast.fire({
        icon: 'success',
        title: 'Ikuzoooo!',
        text: `Price entry successfully deleted!`,
      })
    } catch (error) {
      console.error('Error deleting price entry:', error)
      fetchDataPrices()
      Toast.fire({
        icon: 'error',
        title: 'Oopsss!',
        text: `Failed to delete data. Please try again.`,
      })
    }
  }

  return (
    <section className={`w-full flex flex-col gap-5 -mt-12`}>
      {isLoading ||
      allFacilityPriceData == null ||
      familyOpenRoomData == null ||
      formData == null ? (
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
                    {facilities.map((facility, index) => (
                      <option key={index} value="FamilyOpenRoom">
                        {facility.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block mb-4">
                  <span className="text-gray-700 font-medium">Days</span>
                  <input
                    type="text"
                    value={newEntry['day']}
                    placeholder="Day"
                    onChange={(e) =>
                      handleNewEntryChange('day', e.target.value)
                    }
                    className="w-full p-2 border rounded-md focus:ring focus:ring-orange-300"
                  />
                </label>

                <div className="">
                  <span className="text-gray-700 font-medium">
                    Price of Day
                  </span>
                  <input
                    type="text"
                    placeholder="Price in Rupiah"
                    value={newEntry['price']}
                    onChange={(e) =>
                      handleNewTimeChange('price', e.target.value)
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
              Facility Prices Data Table
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border px-4 py-2">Facility</th>
                    <th className="border px-4 py-2">Days</th>
                    <th className="border px-4 py-2">Price</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(formData).map((category) =>
                    formData[category].prices.map((price, index) => (
                      <tr key={`${category}-${index}`} className="border-b">
                        <td className="border px-4 py-2 font-semibold capitalize">
                          {category.replace('Data', ' ')}
                        </td>
                        <td className="border px-4 py-2">
                          <input
                            type="text"
                            value={price['day']}
                            onChange={(e) =>
                              handleChange(
                                category,
                                index,
                                'day',
                                e.target.value,
                              )
                            }
                            className="w-full p-2 border rounded-md"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <input
                            type="text"
                            value={price['price']}
                            onChange={(e) =>
                              handlePriceChange(
                                category,
                                index,
                                'price',
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
export default FacilityPrices
