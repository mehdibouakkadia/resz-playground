'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { PlaygroundState } from '@/types/playground';

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  state: PlaygroundState;
}

export function ExportModal({ open, onOpenChange, state }: ExportModalProps) {
  const [copied, setCopied] = useState(false);

  // Simple black/grey highlighting based on the image
  const renderHighlightedCode = (code: string) => {
    const lines = code.split('\n');
    
    return (
      <div className="font-mono text-sm leading-relaxed">
        {lines.map((line, index) => (
          <div key={index} className="whitespace-pre">
            {highlightLine(line)}
          </div>
        ))}
      </div>
    );
  };

  // Highlight a single line with black/grey colors
  const highlightLine = (line: string) => {
    const tokens: React.ReactNode[] = [];

    // Patterns for black (prominent) elements
    const blackPatterns = [
      { regex: /\b(import|export|function|return|from|const)\b/g, type: 'keyword' },
      { regex: /<\/?(\w+)(\.\w+)?/g, type: 'tag' },
      { regex: /\/>/g, type: 'tag' },
      { regex: />(?![^<]*<)/g, type: 'tag' },
      { regex: /\b(Resize|Command|Dialog|Input|List|Group|Item|Panel|Handle)\b/g, type: 'component' }
    ];

    // Create matches for black elements
    const allMatches: Array<{start: number, end: number, text: string, isBlack: boolean}> = [];
    
    blackPatterns.forEach(({ regex }) => {
      let match;
      while ((match = regex.exec(line)) !== null) {
        allMatches.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[0],
          isBlack: true
        });
      }
    });

    // Sort matches by start position
    allMatches.sort((a, b) => a.start - b.start);

    // Build the highlighted line
    let currentIndex = 0;
    allMatches.forEach((match) => {
      // Add grey text before this match
      if (match.start > currentIndex) {
        const greyText = line.substring(currentIndex, match.start);
        tokens.push(
          <span key={`grey-${currentIndex}`} className="text-gray-500">
            {greyText}
          </span>
        );
      }
      
      // Add the black match
      tokens.push(
        <span key={`black-${match.start}`} className="text-gray-900">
          {match.text}
        </span>
      );
      
      currentIndex = match.end;
    });

    // Add remaining grey text
    if (currentIndex < line.length) {
      tokens.push(
        <span key={`grey-end`} className="text-gray-500">
          {line.substring(currentIndex)}
        </span>
      );
    }

    // If no matches, entire line is grey
    if (tokens.length === 0) {
      return <span className="text-gray-500">{line}</span>;
    }

    return <>{tokens}</>;
  };

  const generateExportCode = () => {
    // Build props array - only include non-default values
    const props = [];
    
    // Initial dimensions (defaults are 300x200 in resz)
    if (state.initialWidth !== 300) props.push(`initialWidth={${state.initialWidth}}`);
    if (state.initialHeight !== 200) props.push(`initialHeight={${state.initialHeight}}`);
    
    // Spring preset or custom config
    if (state.preset === 'custom') {
      props.push(`config={{
        tension: ${state.springConfig.tension},
        friction: ${state.springConfig.friction},
        mass: ${state.springConfig.mass}
      }}`);
    } else if (state.preset && state.preset !== 'smooth') {
      props.push(`preset="${state.preset}"`);
    }
    
    // Add constraints if any are set
    const constraints = [];
    if (state.useMinConstraints && state.constraints.min) {
      const min = [];
      if (state.constraints.min.width) min.push(`width: ${state.constraints.min.width}`);
      if (state.constraints.min.height) min.push(`height: ${state.constraints.min.height}`);
      if (min.length > 0) constraints.push(`min: { ${min.join(', ')} }`);
    }
    if (state.useMaxConstraints && state.constraints.max) {
      const max = [];
      if (state.constraints.max.width) max.push(`width: ${state.constraints.max.width}`);
      if (state.constraints.max.height) max.push(`height: ${state.constraints.max.height}`);
      if (max.length > 0) constraints.push(`max: { ${max.join(', ')} }`);
    }
    if (state.useAspectRatio && state.constraints.aspectRatio) {
      constraints.push(`aspectRatio: ${state.constraints.aspectRatio}`);
    }
    
    if (constraints.length > 0) {
      const constraintString = constraints.length === 1
        ? `constraints={{ ${constraints[0]} }}`
        : `constraints={{
        ${constraints.join(',\n        ')}
      }}`;
      props.push(constraintString);
    }
    
    // Determine if we need to import Handle
    const needsHandle = state.visibleHandles.length > 0;
    const imports = needsHandle ? 'Resize, Handle' : 'Resize';
    
    // Generate handle elements
    const handleElements = state.visibleHandles.length > 0
      ? state.visibleHandles.map(dir => `      <Handle dir="${dir}" />`).join('\n')
      : '';
    
    // Format props
    const propsString = props.length > 0 ? '\n      ' + props.join('\n      ') : '';
    
    // Generate final code
    return `import { ${imports} } from 'resz'

export function MyResizablePanel() {
  return (
    <Resize${propsString}
    >
      <div style={{ padding: '20px' }}>
        {/* Your content here */}
      </div>
${handleElements ? '\n' + handleElements : ''}
    </Resize>
  )
}`;
  };

  const code = generateExportCode();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).fathom?.trackEvent('click_copy_code');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Failed to copy to clipboard
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Export Code</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Copy this code to use your configured resizable panel
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Code
                </>
              )}
            </Button>
          </div>
          
          <div className="flex-1 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
            <div className="h-full overflow-auto p-6">
              {renderHighlightedCode(code)}
            </div>
          </div>
          
          <div className="text-sm text-gray-500 space-y-1">
            <p>💡 The component is ready to use after installing <code className="px-1 py-0.5 bg-gray-100 rounded text-xs">npm install resz</code></p>
            <p>🎯 Replace <code className="px-1 py-0.5 bg-gray-100 rounded text-xs">{`{/* Your content here */}`}</code> with your actual content</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
