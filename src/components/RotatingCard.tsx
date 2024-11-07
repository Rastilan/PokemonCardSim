'use client'

import React, { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "./ui/Card"
import { Loader2 } from "lucide-react"
import cardback from "../assets/CardBack.jpg";

interface PokemonCard {
  id: string
  name: string
  images: {
    small: string
    large: string
  }
  rarity?: string
  set: {
    name: string
  }
}

export default function PokemonRotatingCard() {
  const [rotating, setRotating] = useState(false)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [card, setCard] = useState<PokemonCard | null>(null)
  const [loading, setLoading] = useState(true)
  const startPos = useRef({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchRandomCard = async () => {
      try {
        const response = await fetch('https://api.pokemontcg.io/v2/cards?pageSize=1&page=' + Math.floor(Math.random() * 100))
        const data = await response.json()
        if (data.data && data.data.length > 0) {
          setCard(data.data[0])
        }
      } catch (error) {
        console.error('Error fetching Pokemon card:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRandomCard()
  }, [])

  const handleStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    setRotating(true)
    const pos = 'touches' in e ? e.touches[0] : e
    startPos.current = { x: pos.clientX, y: pos.clientY }
  }

  const handleEnd = () => {
    setRotating(false)
    setRotation({ x: 0, y: 0 })
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!rotating) return

    const pos = 'touches' in e ? e.touches[0] : e
    const deltaX = pos.clientX - startPos.current.x
    const deltaY = pos.clientY - startPos.current.y
    

    setRotation({
      x: deltaY * 0.1,
      y: -deltaX * 0.1,
    })
  
    
  }

  useEffect(() => {
    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleEnd)
    document.addEventListener('touchmove', handleMove)
    document.addEventListener('touchend', handleEnd)

    return () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchmove', handleMove)
      document.removeEventListener('touchend', handleEnd)
    }
  }, [handleMove, rotating])

  const isFlipped = Math.abs(rotation.x) > 90 || Math.abs(rotation.y) > 90

  return (
    //Background of page 
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-purple-900 p-4">
      {/* */}
      {/* Card component */}
      <Card
        ref={cardRef}
        className="w-[245px] h-[335px] cursor-grab active:cursor-grabbing transition-transform duration-300 ease-out overflow-hidden"
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: rotating ? 'none' : 'transform 0.5s ease-out',
        }}
      >
        <CardContent className="p-0 h-full flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-2 text-purple-300">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm">Loading card...</p>
            </div>
          ) : card ? (
            //checks if card is showing its back
            isFlipped ? (
              //back of card is showing due to rotation
              <img
              src={cardback}
              alt={`${card.name} from ${card.set.name}`}
              className="w-full h-full object-cover"
              draggable="false"
            />
            ) : (
              //front of card is showing due to rotation
            <img
              src={card.images.large}
              alt={`${card.name} from ${card.set.name}`}
              className="w-full h-full object-cover"
              draggable="false"
            />
            )
          ) : (
            //Card loading error
            <p className="text-center p-4 text-purple-300">Failed to load Pokemon card</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}