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

    // Simulate file upload and transcription
    const transcribedText = "Simulated transcription text.";
    setTranscription(transcribedText);

    toast({
      title: "Transcription",
      description: "Transcription completed.",
    });

    handleFormatting(transcribedText);
  };

  const handleFormatting = async (text) => {
    toast({
      title: "Formatting",
      description: "Sending text for formatting...",
    });

    // Simulate GPT-3.5 call for formatting
    const formatted = `Formatted: ${text}`;
    setFormattedText(formatted);

    toast({
      title: "Formatting",
      description: "Formatting completed.",
    });
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