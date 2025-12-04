import { marked } from "marked";
import katex from "katex";

interface MathSegment {
  type: 'block' | 'inline';
  eq: string;
}

/**
 * Converts Markdown with LaTeX to a Blob compatible with MS Word (doc/docx).
 * Uses MathML for equations to ensure they are editable in Word.
 */
export const generateWordDocument = (markdownContent: string): Blob => {
  const mathSegments: MathSegment[] = [];
  
  // 1. Placeholder strategy: Use strings that Markdown won't format.
  // DO NOT use underscores or asterisks which are Markdown control characters.
  
  // Replace block math $$...$$
  let protectedContent = markdownContent.replace(/\$\$([\s\S]*?)\$\$/g, (match, equation) => {
    mathSegments.push({ type: 'block', eq: equation });
    // Using a safe alphanumeric string
    return `MATHBLOCK${mathSegments.length - 1}ENDBLOCK`;
  });

  // Replace inline math $...$
  protectedContent = protectedContent.replace(/\$([^$\n]+?)\$/g, (match, equation) => {
    mathSegments.push({ type: 'inline', eq: equation });
    // Using a safe alphanumeric string
    return `MATHINLINE${mathSegments.length - 1}ENDINLINE`;
  });

  // 2. Convert Markdown text to HTML
  let htmlContent = marked.parse(protectedContent) as string;

  // 3. Render Math to MathML and inject back
  mathSegments.forEach((segment, index) => {
    try {
      const mathMLString = katex.renderToString(segment.eq, {
        output: "mathml",
        throwOnError: false,
        displayMode: segment.type === 'block'
      });
      
      // Extract just the <math>...</math> part to strip wrapping <span> tags from KaTeX
      // This helps Word recognize the MathML object directly
      const match = mathMLString.match(/<math([\s\S]*?)<\/math>/);
      let cleanMathML = match ? match[0] : mathMLString;

      // Ensure proper namespace for Word if missing
      if (!cleanMathML.includes('xmlns="http://www.w3.org/1998/Math/MathML"')) {
        cleanMathML = cleanMathML.replace('<math', '<math xmlns="http://www.w3.org/1998/Math/MathML"');
      }

      const placeholder = segment.type === 'block' 
        ? `MATHBLOCK${index}ENDBLOCK` 
        : `MATHINLINE${index}ENDINLINE`;
      
      const replacement = segment.type === 'block' 
        ? `<div style="text-align:center; margin: 1em 0;">${cleanMathML}</div>` 
        : cleanMathML;

      // Replace the placeholder in the HTML
      htmlContent = htmlContent.replace(placeholder, replacement);

    } catch (e) {
      console.error("Math render error", e);
    }
  });

  // 4. Construct the Final HTML Document with Word Namespaces
  // We add xmlns:m for MathML support in Word
  const docContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns:m='http://schemas.microsoft.com/office/2004/12/omml'
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>Export</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; }
        p { margin-bottom: 1em; }
        table { border-collapse: collapse; width: 100%; }
        td, th { border: 1px solid #000; padding: 5px; }
      </style>
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>
  `;

  // 5. Create Blob
  return new Blob([docContent], { type: 'application/msword' });
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};