"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, Loader2, Bot, User } from "lucide-react"
import { askAIQuestion } from "@/lib/ai-actions"

// Bouton d'envoi qui montre un loader si la requête est en cours
function SendButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} size="sm" className="bg-purple-600 hover:bg-purple-700">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
    </Button>
  )
}

// Définition d'un message dans le chat
interface Message {
  id: string
  type: "user" | "ai" // "user" = utilisateur, "ai" = assistant IA
  content: string
  timestamp: Date
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Bonjour ! Je suis votre conseiller agricole IA. Je peux vous aider pour la gestion des cultures, la santé du sol, la lutte contre les parasites, l'irrigation et plus encore. Que voulez-vous savoir ?",
      timestamp: new Date(),
    },
  ])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fonction de soumission de question
  const handleSubmit = async (formData: FormData) => {
    const question = formData.get("question") as string
    if (!question.trim()) return

    // Ajoute le message de l'utilisateur
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), type: "user", content: question, timestamp: new Date() },
    ])

    setLoading(true)
    setError(null)

    try {
      // Appel à l'API IA pour obtenir la réponse
      const response = await askAIQuestion(question)
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), type: "ai", content: response, timestamp: new Date() },
      ])
    } catch (err) {
      setError("Impossible d'obtenir une réponse de l'IA.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="h-5 w-5 text-purple-600 mr-2" />
          Posez une question à l'IA
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Zone des messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex items-start space-x-2 max-w-[80%] ${
                    message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  {/* Icône utilisateur ou IA */}
                  <div className={`p-2 rounded-full ${message.type === "user" ? "bg-green-100" : "bg-purple-100"}`}>
                    {message.type === "user" ? <User className="h-4 w-4 text-green-600" /> : <Bot className="h-4 w-4 text-purple-600" />}
                  </div>
                  {/* Message */}
                  <div
                    className={`p-3 rounded-lg ${
                      message.type === "user" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-900 border"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.type === "user" ? "text-green-100" : "text-gray-500"}`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {/* Message temporaire pendant le chargement */}
            {loading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-lg bg-gray-100 border text-gray-500">Réflexion en cours...</div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Zone de saisie */}
        <div className="border-t p-4">
          <form action={handleSubmit} className="flex space-x-2">
            <Input
              name="question"
              placeholder="Posez une question sur vos cultures, le sol, la météo ou les pratiques agricoles..."
              className="flex-1"
              autoComplete="off"
            />
            <SendButton />
          </form>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
