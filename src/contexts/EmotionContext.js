"use client"

import { createContext, useContext } from "react"
import { useEmotionDetection } from "../components/EmotionDetection"

const EmotionContext = createContext()

export const EmotionProvider = ({ children }) => {
  const emotionData = useEmotionDetection()

  return <EmotionContext.Provider value={emotionData}>{children}</EmotionContext.Provider>
}

export const useEmotionContext = () => {
  const context = useContext(EmotionContext)
  if (!context) {
    throw new Error("useEmotionContext must be used within an EmotionProvider")
  }
  return context
}
