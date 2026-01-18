"use client";

import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const renderContent = (text: string) => {
    const lines = text.trim().split('\n');
    const elements: React.ReactElement[] = [];

    lines.forEach((line, index) => {
      // Headers
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={index} id={`heading-${index}`} className="text-3xl font-bold text-foreground mb-6 mt-8 scroll-mt-24">
            {line.substring(2)}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} id={`heading-${index}`} className="text-2xl font-bold text-foreground mb-4 mt-8 scroll-mt-24">
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} id={`heading-${index}`} className="text-xl font-semibold text-foreground mb-3 mt-6 scroll-mt-24">
            {line.substring(4)}
          </h3>
        );
      } 
      // Bold headings
      else if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
        elements.push(
          <h4 key={index} className="text-lg font-semibold text-foreground mb-2 mt-4">
            {line.substring(2, line.length - 2)}
          </h4>
        );
      } 
      // Italic (quotes)
      else if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**') && line.length > 2) {
        elements.push(
          <p key={index} className="text-muted-foreground italic mb-4 pl-4 border-l-4 border-yellow-400">
            {line.substring(1, line.length - 1)}
          </p>
        );
      } 
      // Unordered lists
      else if (line.startsWith('- ')) {
        const content = line.substring(2);
        // Parse inline bold
        const parts = content.split(/(\*\*.*?\*\*)/g);
        const renderedContent = parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.substring(2, part.length - 2)}</strong>;
          }
          return <span key={i}>{part}</span>;
        });
        
        elements.push(
          <li key={index} className="mb-2 ml-6 list-disc">
            {renderedContent}
          </li>
        );
      } 
      // Ordered lists
      else if (line.match(/^\d+\./)) {
        const content = line.substring(line.indexOf('.') + 2);
        // Parse inline bold
        const parts = content.split(/(\*\*.*?\*\*)/g);
        const renderedContent = parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.substring(2, part.length - 2)}</strong>;
          }
          return <span key={i}>{part}</span>;
        });
        
        elements.push(
          <li key={index} className="text-foreground mb-2 ml-6 list-decimal">
            {renderedContent}
          </li>
        );
      } 
      // Empty lines
      else if (line.trim() === '') {
        // Skip empty lines
      } 
      // Regular paragraphs with inline formatting
      else {
        // Parse inline bold
        const parts = line.split(/(\*\*.*?\*\*)/g);
        const renderedContent = parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-semibold">{part.substring(2, part.length - 2)}</strong>;
          }
          return <span key={i}>{part}</span>;
        });
        
        elements.push(
          <p key={index} className="text-foreground mb-4 leading-relaxed">
            {renderedContent}
          </p>
        );
      }
    });

    return elements;
  };

  return (
    <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:!text-foreground prose-p:!text-foreground prose-li:!text-foreground prose-strong:!text-foreground prose-em:!text-foreground prose-code:!text-foreground" style={{ color: 'var(--foreground)' }}>
      <div className="article-content">
        {renderContent(content)}
      </div>
    </div>
  );
}
