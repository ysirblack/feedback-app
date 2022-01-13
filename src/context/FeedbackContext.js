import { createContext, useState, useEffect } from 'react'

const FeedbackContext = createContext()

export const FeedbackProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  
  //? feedback =>List.jsx, Stats.jsx te kullanılıyor
  const [feedback, setFeedback] = useState([])
  const [feedbackEdit, setFeedbackEdit] = useState({
    item: {},
    edit: false,
  })


  useEffect(() => { //bu dosya işlenir işlenmez bu useEffect çalışıyor
    fetchFeedback()
  }, [])

  // Fetch feedback
  const fetchFeedback = async () => { //fetch ile (package.jsonda proxy ayarladık http:localhost ... ) 
    //belirli server adresimize git oradan fetchlen eşitlen ne veriyor orası bana onu al
    const response = await fetch(`/feedback?_sort=id&_order=desc`)
    const data = await response.json()

    setFeedback(data) //feedbacki burada serverda olan verilerimizle set ediyoruz,dolduruyoruz
    setIsLoading(false)
  }

  /**
   *  Add feedback||  
   *  
   */
  //? Sdace Form.jsx de 
  const addFeedback = async (newFeedback) => {
    const response = await fetch('/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newFeedback),
    })

    const data = await response.json()

    setFeedback([data, ...feedback])
    //data yeni eklediğimiz , feedback ise eskiden olanlar
  }


    /**
   *  Delete feedback||  
   *  ?
   */
  //? Sdace Item.jsx de
  const deleteFeedback = async (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      await fetch(`/feedback/${id}`, { method: 'DELETE' })

      setFeedback(feedback.filter((item) => item.id !== id))
      //feedbackin içindeki her bir eleman item oluyor teker teker itemleri geçiriyor
    }
  }

  /**
   *   Update feedback item||  
   *  ? Form.jsx de
   */
  const updateFeedback = async (id, updItem) => {
    const response = await fetch(`/feedback/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updItem),
    })

    const data = await response.json()

    setFeedback(
      feedback.map((item) => (item.id === id ? {...item, ...data } : item))
    )
  }


  /**
   *    Set item to be updated|
   *  ? |Item.jsxte, RatingSelect.jsxt te
   */
  const editFeedback = (item) => {
    setFeedbackEdit({
      item,
      edit: true,
    })
  }

  return (
    <FeedbackContext.Provider
      value={{
        feedback,
        feedbackEdit,
        isLoading,
        deleteFeedback,
        addFeedback,
        editFeedback,
        updateFeedback,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  )
}

export default FeedbackContext
