'use client'

import { NanoClient } from "@/nano/AIClient"
import { ExerciseOptions } from "@/nano/gobal";
import { getExerciseTemplate } from "./Templates";

export async function generateExercise(exerciseOptions: ExerciseOptions) {
   const client = await NanoClient();
   if (!client) {
      throw new Error("Failed to create NanoClient");
   }
   // Create exercise client with the specified output language
   const response = await client.prompt(getExerciseTemplate(exerciseOptions))
   return response;
}