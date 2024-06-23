import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [formattedText, setFormattedText] = useState("");
  const [apiKey, setApiKey] = useState(localStorage.getItem("apiKey") || "");
  const { toast } = useToast();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleApiKeyChange = (e) => {
    const key = e.target.value;
    setApiKey(key);
    localStorage.setItem("apiKey", key);
  };

  const handleTranscription = async () => {
    if (!file || !apiKey) {
      toast({
        title: "Error",
        description: "Please provide a file and API key.",
      });
      return;
    }

    toast({
      title: "Transcription",
      description: "Sending file for transcription...",
    });

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("model", "whisper-1");

      const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Transcription request failed");
      }

      const data = await response.json();
      const transcribedText = data.text;
      setTranscription(transcribedText);

      toast({
        title: "Transcription",
        description: "Transcription completed.",
      });

      handleFormatting(transcribedText);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during transcription.",
      });
      console.error("Transcription error:", error);
    }
  };

  const handleFormatting = async (text) => {
    toast({
      title: "Formatting",
      description: "Sending text for formatting...",
    });

    try {
      const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "text-davinci-003",
          prompt: `Format the following text:\n\n${text}`,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        throw new Error("Formatting request failed");
      }

      const data = await response.json();
      const formatted = data.choices[0].text.trim();
      setFormattedText(formatted);

      toast({
        title: "Formatting",
        description: "Formatting completed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during formatting.",
      });
      console.error("Formatting error:", error);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center space-y-4 p-4">
      <h1 className="text-3xl">Transcription App</h1>
      <Input
        type="file"
        onChange={handleFileChange}
        className="mb-4"
      />
      <Input
        type="text"
        placeholder="Enter API Key"
        value={apiKey}
        onChange={handleApiKeyChange}
        className="mb-4"
      />
      <Button onClick={handleTranscription}>Transcribe</Button>
      <Textarea
        placeholder="Transcription Result"
        value={transcription}
        readOnly
        className="mt-4"
      />
      <Textarea
        placeholder="Formatted Text"
        value={formattedText}
        readOnly
        className="mt-4"
      />
    </div>
  );
};

export default Index;