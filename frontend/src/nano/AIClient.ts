'use client';

import { LanguageModel } from "@/nano/gobal"

export async function NanoClient() {
   // Implementation of the nano client creation
   try {
      // Check the API exist
      if (typeof LanguageModel === "undefined") {
         alert("Browser not supported");
         return null;
      }
      // Create client
      const client = await LanguageModel.create({ outputLanguage: "es" });

      return client;
   } catch (err) {
      console.error("Error using nanoClient:", err);
      return null
   }
}

