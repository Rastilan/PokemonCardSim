'use client'

import React, { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "./ui/Card"
import { Loader2 } from "lucide-react"
import cardback from "../assets/CardBack.jpg"
import "../index.css"

interface Attack {
  name: string
  damage?: string
  text?: string
}

interface PokemonCard {
  id: string
  name: string
  images: {
    small: string
    large: string
  }
  hp?: string
  types?: string[]
  rarity?: string
  attacks?: Attack[]
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
  const hasFetched = useRef(false)

  const fetchRandomCard = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        'https://api.pokemontcg.io/v2/cards?pageSize=1&page=' +
          Math.floor(Math.random() * 100)
      )
      const data = await response.json()
      if (data.data && data.data.length > 0) {
        setCard(data.data[0])
        console.log("Fetched Card:", data.data[0])

      }
    } catch (error) {
      console.error("Error fetching Pokemon card:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
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
  }, [rotating])

  const isFlipped = rotation.y > 90 || rotation.y < -90

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-purple-900 p-4">
      <Card
        ref={cardRef}
        className="relative w-[245px] h-[335px] cursor-grab active:cursor-grabbing transition-transform duration-300 ease-out overflow-hidden"
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: rotating ? 'none' : 'transform 0.5s ease-out',
        }}
      >
        <CardContent className="p-0 h-full flex items-center justify-center relative">
          <img src={cardback} alt="Preload card back" style={{ display: 'none' }} />
          {loading ? (
            <div className="flex flex-col items-center gap-2 text-purple-300">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm">Loading card...</p>
            </div>
          ) : card ? (
            <>
              <img
                src={cardback}
                alt="Card back"
                className={`w-full h-full object-cover no-highlight absolute inset-0 transition-opacity duration-300 ${
                  isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                draggable={false}
                style={{ backfaceVisibility: 'hidden' }}
              />
              <img
                src={card.images.large}
                alt={`${card.name} from ${card.set.name}`}
                className={`w-full h-full object-cover no-highlight absolute inset-0 transition-opacity duration-300 ${
                  isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
                draggable={false}
                style={{ backfaceVisibility: 'hidden' }}
              />
            </>
          ) : (
            <p className="text-center p-4 text-purple-300">Failed to load Pokemon card</p>
          )}
        </CardContent>
      </Card>

      {/* Draw Button */}
      <button
        onClick={() => {
          setRotation({ x: 0, y: 0 })
          fetchRandomCard()
        }}
        className="mt-6 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg shadow"
      >
        Draw Another Card
      </button>

      {/* Card Details */}
      {card && !loading && (
        
        <div className="mt-6 w-[245px] bg-purple-800 bg-opacity-70 rounded-lg p-4 text-white shadow-lg">
          <h2 className="text-xl font-bold mb-2">{card.name}</h2>
          <p className="mb-1">
            <span className="font-semibold">Series:</span> {card.set.name}
          </p>
          {card.rarity && (
            <p className="mb-2">
              <span className="font-semibold">Rarity:</span> {card.rarity}
            </p>
          )}
          {card.hp && (
            <p className="mb-2">
              <span className="font-semibold">HP:</span> {card.hp}
            </p>
          )}
          {card.types && card.types.length > 0 && (
            <p className="mb-2">
              <span className="font-semibold">Type:</span> {card.types.join(", ")}
            </p>
          )}
          {card.attacks && card.attacks.length > 0 && (
            <div>
              <span className="font-semibold">Attacks:</span>
              <ul className="list-disc list-inside mt-1 max-h-28 overflow-auto">
                {card.attacks.map((attack, index) => (
                  <li key={index} className="mb-1">
                    <p>
                      <span className="font-semibold">{attack.name}</span>{" "}
                      {attack.damage && <span>({attack.damage} dmg)</span>}
                    </p>
                    {attack.text && (
                      <p className="text-sm italic text-purple-300">{attack.text}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
