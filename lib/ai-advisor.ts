import { generateText, generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const RecommendationSchema = z.object({
  type: z.enum(["irrigation", "fertilization", "pest_control", "harvest_timing", "general"]),
  title: z.string(),
  content: z.string(),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  actionItems: z.array(z.string()),
  estimatedCost: z.number().optional(),
  timeframe: z.string(),
})

const RecommendationsSchema = z.object({
  recommendations: z.array(RecommendationSchema),
})

export async function generateFarmRecommendations(farmData: {
  farmName: string
  location: string
  soilType?: string
  fields: Array<{
    name: string
    area: number
    soilPh?: number
    plantings: Array<{
      cropName: string
      variety?: string
      plantingDate: string
      plantedArea: number
      status: string
    }>
  }>
  weather?: {
    temperature: number
    humidity: number
    rainfall: number
    conditions: string
  }
}) {
  const prompt = `You are an expert agricultural advisor. Analyze the following farm data and provide specific, actionable recommendations for the farmer.

Farm Information:
- Name: ${farmData.farmName}
- Location: ${farmData.location}
- Soil Type: ${farmData.soilType || "Unknown"}

Fields and Crops:
${farmData.fields
  .map(
    (field) => `
Field: ${field.name} (${field.area} hectares, pH: ${field.soilPh || "Unknown"})
Current Plantings:
${field.plantings
  .map(
    (planting) =>
      `- ${planting.cropName} ${planting.variety ? `(${planting.variety})` : ""}: ${planting.plantedArea} ha, planted ${planting.plantingDate}, status: ${planting.status}`,
  )
  .join("\n")}`,
  )
  .join("\n")}

Current Weather:
${
  farmData.weather
    ? `Temperature: ${farmData.weather.temperature}°C, Humidity: ${farmData.weather.humidity}%, Rainfall: ${farmData.weather.rainfall}mm, Conditions: ${farmData.weather.conditions}`
    : "Weather data not available"
}

Please provide 3-5 specific recommendations covering different aspects like irrigation, fertilization, pest control, and harvest timing. Each recommendation should be practical, actionable, and tailored to the current conditions and crops.

Focus on:
1. Immediate actions needed based on current weather and crop status
2. Preventive measures for common issues
3. Optimization opportunities for better yields
4. Cost-effective solutions
5. Sustainable farming practices

Make sure each recommendation includes specific action items and realistic timeframes.`

  try {
    const result = await generateObject({
      model: openai("gpt-4o"),
      schema: RecommendationsSchema,
      prompt,
    })

    return result.object.recommendations
  } catch (error) {
    console.error("Error generating recommendations:", error)
    return []
  }
}

export async function generateAIResponse(message: string, context?: string) {
  const systemPrompt = `You are an expert agricultural advisor with deep knowledge of farming practices, crop management, soil science, and sustainable agriculture. You provide practical, actionable advice to farmers.

${context ? `Context about the farmer's operation: ${context}` : ""}

Guidelines:
- Provide specific, actionable advice
- Consider sustainable and cost-effective solutions
- Mention relevant timeframes for actions
- Include preventive measures when appropriate
- Be encouraging and supportive
- If you need more information, ask specific questions`

  try {
    const result = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: message,
      maxTokens: 500,
    })

    return result.text
  } catch (error) {
    console.error("Error generating AI response:", error)
    return "I apologize, but I'm having trouble processing your request right now. Please try again later."
  }
}
